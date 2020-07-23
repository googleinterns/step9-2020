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
// import java.io.InputStream;
// import java.util.ArrayList;
// import java.util.Arrays;
import java.util.HashMap;
// import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;

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
    public static Map<String, Long> getAdvertiserToSpend(
      List<QueryDocumentSnapshot> documentsInState) {
    Map<String, Long> advertiserToSpend = new HashMap<>();

    for (QueryDocumentSnapshot document: documentsInState) {
      String advertiser = document.getString("advertiser");
      long spendMax = document.getLong("spendMax");

      if (advertiserToSpend.containsKey(advertiser)) {
        spendMax += advertiserToSpend.get(advertiser); 
      }
      
      advertiserToSpend.put(advertiser, spendMax);
    }
    
    return advertiserToSpend;
  }

  /**
   * Writes advertiser documents to Firestore
   * @param state the current state subcollection (tells Firestore
   *              where to write the advertiser documents)
   * @param advertiserToSpend map that relates every advertiser
   *              to their total ad spend in a particular state              
   */
  public static void updateStateSubcollection(String state,
      Map<String, Long> advertiserToSpend) {

    long totalStateSpend = 0;

    for (String key : advertiserToSpend.keySet()) {
      Map<String, Object> data = new HashMap<>();
      long totalAdvertiserSpend = advertiserToSpend.get(key);
      totalStateSpend += totalAdvertiserSpend;
      data.put("totalAdvertiserSpend", totalAdvertiserSpend);
      db.collection(WRITE_COLLECTION)
        .document(state.toLowerCase())
        .collection("advertisers")
        .document(key)
        .set(data, SetOptions.merge()); // Granular merge instead of overwrite.
    }  
    updateTotalStateSpend(state, totalStateSpend);
  }

 /**
  * Writes stateData documents, which contain information on each state's
  * total ad spend across all advertisers, to Firestore
  * @param state the current state subcollection (tells Firestore where to
  *              write the advertiser documents)
  * @param totalStateSpend how much money (USD) has been spent in a particular
  *              state across all advertisers
  */
  public static void updateTotalStateSpend(String state, long totalStateSpend) {
    Map<String, Object> data = new HashMap<>();
    data.put("totalStateSpend", totalStateSpend);
    db
      .collection(WRITE_COLLECTION).document(state.toLowerCase())
      .collection("stateData").document("spendData")
      .set(data, SetOptions.merge());    
  }

  public static void main(String[] args) throws Exception {
    initializeApp();

    for (String state: Constants.VALID_GEO_TARGETS) {      
      ApiFuture<QuerySnapshot> future = db.collection(MAIN_COLLECTION)
                                          .whereArrayContains("geoTarget", state)
                                          .get();
      List<QueryDocumentSnapshot> documentsInState = future.get().getDocuments();
      Map<String, Long> advertiserToSpend = getAdvertiserToSpend(documentsInState);

      updateStateSubcollection(state, advertiserToSpend);
    }
  }
}
