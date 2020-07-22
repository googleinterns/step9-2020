package com.google.sps.utils;
import com.google.api.core.ApiFuture;
import com.google.api.core.ApiFuture;
import com.google.auth.oauth2.GoogleCredentials;
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
import com.google.sps.utils.Constants;
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
 * Description: 
 * Author: Kira Toal
 * Date: July 20, 2020
 */ 
public class StateSubcollectionBuilder {

  private static final String PATH_TO_SERVICE_ACCOUNT = "./serviceAccountKey.json"; 
  private static final String DATABASE_URL = "https://step9-2020-capstone.firebaseio.com"; 
  private static final String MAIN_COLLECTION = "ads";
  private static final String WRITE_COLLECTION = "dev_states";
  public static Firestore db; 

  public static Firestore initializeApp() throws Exception {
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
    return db;
  }

  public static Map<String, Long> getAdvertiserToTotalSpend(List<QueryDocumentSnapshot> documentsInState) {
    Map<String, Long> advertiserToTotalSpend = new HashMap<>();
    for (QueryDocumentSnapshot document: documentsInState) {
      String advertiser = document.getString("advertiser");
      long spendMax = document.getLong("spendMax");
      if (advertiserToTotalSpend.containsKey(advertiser)) {
        advertiserToTotalSpend.put(advertiser, advertiserToTotalSpend.get(advertiser) + spendMax);
      } else {
        advertiserToTotalSpend.put(advertiser, spendMax);
      }
    }
    return advertiserToTotalSpend;
  }

  public static void updateTotalStateSpend(String state, long totalStateSpend) {
    Map<String, Object> data = new HashMap<>();
    data.put("totalStateSpend", totalStateSpend);
    db
      .collection(WRITE_COLLECTION).document(state.toLowerCase())
      .collection("stateData").document("spendData")
      .set(data, SetOptions.merge());    
  }

  public static void updateStateSubcollection(String state,
      Map<String, Long> advertiserToTotalSpend) {

    long totalStateSpend = 0;

    for (String key : advertiserToTotalSpend.keySet()) {
      Map<String, Object> data = new HashMap<>();
      long totalAdvertiserSpend = advertiserToTotalSpend.get(key);
      totalStateSpend += totalAdvertiserSpend;
      data.put("totalAdvertiserSpend", totalAdvertiserSpend);
      db
        .collection(WRITE_COLLECTION).document(state.toLowerCase())
        .collection("advertisers").document(key)
        .set(data, SetOptions.merge());
    }
    
    updateTotalStateSpend(state, totalStateSpend);
  }

  public static void main(String[] args) throws Exception {
    initializeApp();

    // Sort ads into groups by geotarget.
    for (String state: Constants.TEST_GEO_TARGETS) {      
      ApiFuture<QuerySnapshot> future = db.collection(MAIN_COLLECTION)
                                          .whereArrayContains("geoTarget", state)
                                          .get();
      List<QueryDocumentSnapshot> documentsInState = future.get().getDocuments();
      Map<String, Long> advertiserToTotalSpend = getAdvertiserToTotalSpend(documentsInState);

      updateStateSubcollection(state, advertiserToTotalSpend);
    }
  }
}