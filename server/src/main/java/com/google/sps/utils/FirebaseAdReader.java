package com.google.sps.utils;
import com.google.api.core.ApiFuture;
import com.google.auth.oauth2.GoogleCredentials;
import com.google.cloud.firestore.DocumentReference;
import com.google.cloud.firestore.Firestore;
import com.google.cloud.firestore.WriteResult;
import com.google.firebase.FirebaseApp;
import com.google.firebase.FirebaseOptions;
import com.google.firebase.cloud.FirestoreClient;
import com.google.sps.utils.Ad;
import com.google.sps.utils.AdRowProcessor;
import com.google.sps.utils.FirebaseAdReader;
import java.io.FileInputStream;
import java.io.InputStream;
import java.util.List;

import com.google.cloud.firestore.QueryDocumentSnapshot;
import com.google.cloud.firestore.QuerySnapshot;



/* 
 * Description: Utility class that reads as objects to Firestore. 
 * Author: Kira Toal
 * Date: July 14, 2020
 */ 
public class FirebaseAdReader {

  private static final String COLLECTION = "testing";
  private static final String PATH_TO_SERVICE_ACCOUNT = "./serviceAccountKey.json"; 
  private static final String DATABASE_URL = "https://step9-2020-capstone.firebaseio.com"; 


  public static void main(String[] args) throws Exception {

    FileInputStream serviceAccount = new FileInputStream(PATH_TO_SERVICE_ACCOUNT);
    FirebaseOptions options = new FirebaseOptions.Builder()
        .setCredentials(GoogleCredentials.fromStream(serviceAccount))
        .setDatabaseUrl(DATABASE_URL)
        .build();
    // Initialize app.
    if(FirebaseApp.getApps().isEmpty()) {
      FirebaseApp.initializeApp(options);
    }

    Firestore db = FirestoreClient.getFirestore();


    System.out.println("\n\n\nTEST WORKS\n\n\n");
    // Retrieve all documents from the testing collection.

    ApiFuture<QuerySnapshot> future = db.collection(COLLECTION).get();
    List<QueryDocumentSnapshot> documents = future.get().getDocuments(); // future.get() blocks on response.
    for (QueryDocumentSnapshot document : documents) {
      System.out.println(document.getId() + " => " + document.toObject(Ad.class));
    }
  }


}