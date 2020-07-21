package com.google.sps.utils;
import com.google.api.core.ApiFuture;
import com.google.api.core.ApiFuture;
import com.google.auth.oauth2.GoogleCredentials;
import com.google.cloud.firestore.DocumentReference;
import com.google.cloud.firestore.DocumentReference;
import com.google.cloud.firestore.DocumentSnapshot;
import com.google.cloud.firestore.FieldValue;
import com.google.cloud.firestore.Firestore;
import com.google.cloud.firestore.Query;
import com.google.cloud.firestore.QueryDocumentSnapshot;
import com.google.cloud.firestore.QuerySnapshot;
import com.google.cloud.firestore.SetOptions;
import com.google.cloud.firestore.WriteResult;
import com.google.firebase.FirebaseApp;
import com.google.firebase.FirebaseOptions;
import com.google.firebase.cloud.FirestoreClient;
import com.google.sps.utils.Ad;
import java.io.FileInputStream;
import java.io.InputStream;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;

/**
 * Description: StateCollectionBuilder reads in advertisements from the "ads" collection in Firestore.
 *              Ad documents that are geo-targeted at the same state are grouped together in a state
 *              subcollection. These subcollections are populated with advertiser documents. Each 
 *              document contains a ads field, which is an ArrayList of primary keys for advertisement
 *              documents in the "ads" collection.
 * Author: Kira Toal
 * Date: July 20, 2020
 */ 
public class StateCollectionBuilder {

  private static final Set<String> VALID_GEO_TARGETS = new HashSet<>(Arrays.asList("Alabama", "Alaska", 
          "Arizona", "Arkansas", "California", "Colorado", "Connecticut", "Delaware", "Florida", "Georgia", 
          "Hawaii", "Idaho", "Illinois", "Indiana", "Iowa", "Kansas", "Kentucky", "Louisiana", "Maine", 
          "Maryland", "Massachusetts", "Michigan", "Minnesota", "Mississippi", "Missouri", "Montana", 
          "Nebraska", "Nevada", "New Hampshire", "New Jersey", "New Mexico", "New York", "North Carolina", 
          "North Dakota", "Ohio", "Oklahoma", "Oregon", "Pennsylvania", "Rhode Island", "South Carolina", 
          "South Dakota", "Tennessee", "Texas", "Utah", "Vermont", "Virginia", "Washington", "West Virginia", 
          "Wisconsin", "Wyoming", "United States"));
  private static final String PATH_TO_SERVICE_ACCOUNT = "./serviceAccountKey.json"; 
  private static final String DATABASE_URL = "https://step9-2020-capstone.firebaseio.com"; 
  private static final String MAIN_COLLECTION = "ads";
  private static Firestore db; 

  private static final Set<String> MOCK_DATA = new HashSet<>(Arrays.asList("Utah", "California"));  

  public static void initializeApp() throws Exception {
    // Set account and build options.
    FileInputStream serviceAccount = new FileInputStream(PATH_TO_SERVICE_ACCOUNT);
    FirebaseOptions options = new FirebaseOptions.Builder()
        .setCredentials(GoogleCredentials.fromStream(serviceAccount))
        .setDatabaseUrl(DATABASE_URL)
        .build();
    
    // Initialize app.
    if (FirebaseApp.getApps().isEmpty()) {
      FirebaseApp.initializeApp(options);
    }
    db = FirestoreClient.getFirestore();
  }

  public static void updateStateCollection(String state, List<QueryDocumentSnapshot> documents) throws Exception {
    // Initialize a HashMap to organize ad data into documents.
    Map<String, ArrayList> advertiserToAdIds = new HashMap<>();

    // Create a document for every advertiser.
    for (QueryDocumentSnapshot document : documents) {
      Ad ad = document.toObject(Ad.class); // Convert document to Ad to use methods like .getAdvertiser().
      String key = ad.getAdvertiser();
      ArrayList<String> value = new ArrayList<String>(); 
      if (advertiserToAdIds.containsKey(key)) {
        value = advertiserToAdIds.get(key);
      }
      value.add(ad.getId());
      advertiserToAdIds.put(key, value);
    }

    // Add advertiser documents to the corresponding state collection.
    for (String key : advertiserToAdIds.keySet()) {
      Map<String, Object> data = new HashMap<>();
      data.put("ads", advertiserToAdIds.get(key));
      db
        .collection("states").document(state.toLowerCase())
        .collection("ads").document(key)
        .set(data, SetOptions.merge());
    }
  }

  public static void main(String[] args) throws Exception {
    initializeApp();

    // Sort ads into groups by geotarget.
    for (String state: MOCK_DATA) {      
      ApiFuture<QuerySnapshot> future = db.collection(MAIN_COLLECTION)
                                          .whereArrayContains("geoTarget", state)
                                          .get();
      List<QueryDocumentSnapshot> documents = future.get().getDocuments();
      updateStateCollection(state, documents);
    }
  }
}
