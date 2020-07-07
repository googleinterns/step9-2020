/* 
 * Description: Utility class that writes as objects to Firestore. 
 * Author: Kira Toal
 * Date: July 6, 2020
 */ 
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


public final class WriteAd {

  public static void writeAd(Ad ad, String collection, String pathToServiceAccount, String databaseURL) throws Exception {
    // initialize app
    FileInputStream serviceAccount = new FileInputStream(pathToServiceAccount);
    FirebaseOptions options = new FirebaseOptions.Builder()
        .setCredentials(GoogleCredentials.fromStream(serviceAccount))
        .setDatabaseUrl(databaseURL)
        .build();
    if(FirebaseApp.getApps().isEmpty()) {
      FirebaseApp.initializeApp(options);
    }

    // write ad to firestore
    Firestore db = FirestoreClient.getFirestore();    
    ApiFuture<WriteResult> result = db.collection(collection).document(ad.getId()).set(ad);
    System.out.println("Update time : " + result.get().getUpdateTime());
  }
}