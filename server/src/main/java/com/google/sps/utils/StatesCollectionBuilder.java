package com.google.sps.utils;
import com.google.api.core.ApiFuture;
import com.google.auth.oauth2.GoogleCredentials;
import com.google.cloud.firestore.DocumentReference;
import com.google.cloud.firestore.Firestore;
import com.google.cloud.firestore.WriteResult;
import com.google.firebase.FirebaseApp;
import com.google.firebase.FirebaseOptions;
import com.google.firebase.cloud.FirestoreClient;
import java.io.FileInputStream;
import java.io.InputStream;

import java.util.Set;
import java.util.HashSet;
import java.util.HashMap;
import java.util.Map;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;


import com.google.cloud.firestore.Query;
import com.google.sps.utils.Ad;

import com.google.cloud.firestore.QueryDocumentSnapshot;
import com.google.cloud.firestore.QuerySnapshot;
import com.google.api.core.ApiFuture;
import com.google.cloud.firestore.DocumentReference;
import com.google.cloud.firestore.DocumentSnapshot;

import com.google.cloud.firestore.FieldValue;
import com.google.cloud.firestore.SetOptions;


/* 
 * Description:  
 * Author: Kira Toal
 * Date: July 20, 2020
 */ 
public class StatesCollectionBuilder {

  private static final Set<String> VALID_GEO_TARGETS = new HashSet<>(Arrays.asList("Alabama", "Alaska", 
          "Arizona", "Arkansas", "California", "Colorado", "Connecticut", "Delaware", "Florida", "Georgia", 
          "Hawaii", "Idaho", "Illinois", "Indiana", "Iowa", "Kansas", "Kentucky", "Louisiana", "Maine", 
          "Maryland", "Massachusetts", "Michigan", "Minnesota", "Mississippi", "Missouri", "Montana", 
          "Nebraska", "Nevada", "New Hampshire", "New Jersey", "New Mexico", "New York", "North Carolina", 
          "North Dakota", "Ohio", "Oklahoma", "Oregon", "Pennsylvania", "Puerto Rico", "Rhode Island", 
          "South Carolina", "South Dakota", "Tennessee", "Texas", "Utah", "Vermont", "Virginia", "Washington", 
          "West Virginia", "Wisconsin", "Wyoming", "United States"));
  private static final Set<String> TEST_SET = new HashSet<>(Arrays.asList("New York"));     
  private static final String PATH_TO_SERVICE_ACCOUNT = "./serviceAccountKey.json"; 
  private static final String DATABASE_URL = "https://step9-2020-capstone.firebaseio.com"; 
  private static final String READ_FROM_COLLECTION = "ads";
  private static final String WRITE_TO_COLLECTION = "states";
  private static Firestore db; 

  public static void initializeApp() throws Exception {
    FileInputStream serviceAccount = new FileInputStream(PATH_TO_SERVICE_ACCOUNT);
    FirebaseOptions options = new FirebaseOptions.Builder()
        .setCredentials(GoogleCredentials.fromStream(serviceAccount))
        .setDatabaseUrl(DATABASE_URL)
        .build();
    
    // Initialize app.
    if(FirebaseApp.getApps().isEmpty()) {
      FirebaseApp.initializeApp(options);
    }
    db = FirestoreClient.getFirestore();    
  }

  public static void createSubcollections() throws Exception {
    for (String state: TEST_SET) {      
      // Get all documents from each state.
      ApiFuture<QuerySnapshot> future = db.collection(READ_FROM_COLLECTION)
                                          .whereArrayContains("geoTarget", state)
                                          .get();
      List<QueryDocumentSnapshot> documents = future.get().getDocuments();

      // Advertiser name, ad ids
      Map<String, ArrayList> advertiserToAdIds = new HashMap<>();

      for (QueryDocumentSnapshot document : documents) {
        Ad ad = document.toObject(Ad.class);
        // Build dictionary.
        String key = ad.getAdvertiser();
        ArrayList<String> value = new ArrayList<String>(); 
        if (advertiserToAdIds.containsKey(key)) {
          value = advertiserToAdIds.get(key);
          value.add(ad.getId());
        } else {
          value.add(ad.getId());
        }
        advertiserToAdIds.put(key, value);
      }

      for (String key : advertiserToAdIds.keySet()) {
        // use the key here
        Map<String, Object> data = new HashMap<>();
        data.put("ads", advertiserToAdIds.get(key));
        db.collection(state.toLowerCase()).document(key).set(data, SetOptions.merge());
      }

        // db.collection(state.toLowerCase()).document(ad.getAdvertiser()).set(data, SetOptions.merge());
        // db.collection(state.toLowerCase()).document(ad.getAdvertiser()).update("ads", FieldValue.arrayUnion(ad.getId()));
    }
  }

  public static void main(String[] args) throws Exception {
    initializeApp();
    createSubcollections();
  }

}