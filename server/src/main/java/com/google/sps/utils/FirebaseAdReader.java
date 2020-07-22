package com.google.sps.utils;
import com.google.api.core.ApiFuture;
import com.google.auth.oauth2.GoogleCredentials;
import com.google.cloud.firestore.DocumentReference;
import com.google.cloud.firestore.Firestore;
import com.google.cloud.firestore.FirestoreOptions;
import com.google.cloud.firestore.QueryDocumentSnapshot;
import com.google.cloud.firestore.QuerySnapshot;
import com.google.cloud.firestore.WriteResult;
import com.google.firebase.FirebaseApp;
import com.google.firebase.FirebaseOptions;
import com.google.firebase.cloud.FirestoreClient;
import com.google.sps.utils.Ad;
import com.google.sps.utils.AdRowProcessor;
import com.google.sps.utils.FirebaseAdReader;
import java.io.FileInputStream;
import java.io.InputStream;
import java.util.concurrent.TimeUnit;
import java.util.ArrayList;
import java.util.List;

/**
 * Description: Utility class that reads ad objects from Firestore. 
 * Author: Kira Toal
 * Date: July 14, 2020
 */ 
public final class FirebaseAdReader {

  /**
   * Reads in all documents from a collection.
   * @param collection The collection to read documents from.
   * @param databaseURL The database from which to read documents.
   * @param limit Maximum number of documents to read from the collection.
   * @param timeoutSecs Time in seconds to wait for the future before
   *                    timing out.
   */
  public static List<Ad> readAds(String collection, 
      String databaseURL, 
      String pathToServiceAccount,
      int limit, 
      int timeoutSecs) 
      throws Exception {
    FileInputStream serviceAccount = new FileInputStream(pathToServiceAccount);
    FirebaseOptions options = new FirebaseOptions.Builder()
        .setCredentials(GoogleCredentials.fromStream(serviceAccount))
        .setDatabaseUrl(databaseURL)
        .build();
    
    // Initialize app.
    if (FirebaseApp.getApps().isEmpty()) {
      FirebaseApp.initializeApp(options);
    }
    Firestore db = FirestoreClient.getFirestore();

    // Retrieve all documents from the collection.
    ApiFuture<QuerySnapshot> future = db.collection(collection).limit(limit).get();
    List<QueryDocumentSnapshot> documents = future.get(timeoutSecs, TimeUnit.SECONDS).getDocuments();
    List<Ad> ads = new ArrayList<Ad>(); 
    for (QueryDocumentSnapshot document : documents) {
      ads.add(document.toObject(Ad.class));
    }
    return ads;
  }
}
