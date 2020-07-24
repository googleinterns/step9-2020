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
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;

import com.google.cloud.firestore.WriteBatch;


/**
 * Description: Class creates collection by state. Each state collection contains
 *              two subcollections: 'advertisers', which contains information about
 *              each advertiser's total ad spend, and 'stateData', which contains
 *              information about each state's total ad spend.
 * Author: Kira Toal
 * Date: July 20, 2020
 */ 
public class StateSubcollectionBuilder {

  private static final String PATH_TO_SERVICE_ACCOUNT = "./serviceAccountKey.json"; 
  private static final String DATABASE_URL = "https://step9-2020-capstone.firebaseio.com"; 
  private static final String MAIN_COLLECTION = "ads";
  private static final String WRITE_COLLECTION = "dev_states";
  private static final Set<String> GEO_TARGETS = Constants.VALID_GEO_TARGETS;
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

  /**
   * Maps advertisers to their total ad spend in a particular state
   * @param documentsInState list of all document snapshots targeted
   *                         at a particular state 
   */
    public static Map<String, Long> getAdvertiserSpend(
      List<QueryDocumentSnapshot> documentsInState) {
    Map<String, Long> advertiserSpendMap = new HashMap<>();

    for (QueryDocumentSnapshot document: documentsInState) {
      String advertiser = document.getString("advertiser");
      long maxSpend = document.getLong("spendMax");

      if (advertiserSpendMap.containsKey(advertiser)) {
        maxSpend += advertiserSpendMap.get(advertiser); 
      }
      
      advertiserSpendMap.put(advertiser, maxSpend);
    }
    
    return advertiserSpendMap;
  }

  /**
   * Writes advertiser documents to Firestore
   * @param state the current state subcollection (tells Firestore
   *              where to write the advertiser documents)
   * @param advertiserSpendMap map that relates every advertiser
   *              to their total ad spend in a particular state              
   */
  public static void updateAdvertiserSpendSubCollection(String state,
      Map<String, Long> advertiserSpendMap) {

    long totalStateSpend = 0;

    WriteBatch batch = db.batch();

    // Set the advertiser subcollections.
    for (String key : advertiserSpendMap.keySet()) {
      Map<String, Object> data = new HashMap<>();
      long totalAdSpend = advertiserSpendMap.get(key);
      data.put("totalAdvertiserSpend", totalAdSpend);
      DocumentReference advertiser = db.collection(WRITE_COLLECTION)
          .document(state)
          .collection("advertisers")
          .document(key);
      batch.set(advertiser, data);
      totalStateSpend += advertiserSpendMap.get(key);
    }
    
    // Set state spend.
    DocumentReference stateRef = db.collection(WRITE_COLLECTION)
        .document(state);
    Map<String, Object> stateSpendMap = new HashMap<>();
    stateSpendMap.put("totalStateSpend", totalStateSpend);
    batch.set(stateRef, stateSpendMap);

    // Commit the batch.
    batch.commit();
  }

  public static void main(String[] args) throws Exception {
    initializeApp();

    for (String state: GEO_TARGETS) {      
      ApiFuture<QuerySnapshot> future = db.collection(MAIN_COLLECTION)
                                          .whereArrayContains("geoTarget", state)
                                          .get();
      List<QueryDocumentSnapshot> documentsInState = future.get().getDocuments();
      Map<String, Long> advertiserSpendMap = getAdvertiserSpend(documentsInState);

      updateAdvertiserSpendSubCollection(state.toLowerCase(), advertiserSpendMap);
    }
  }
}
