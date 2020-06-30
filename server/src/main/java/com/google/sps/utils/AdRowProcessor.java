/* 
 * Description: File for building ad and adding it to Firestore
 * Author: Kira Toal
 * Date: June 24, 2020
 */ 
package com.google.sps.utils;
import java.time.LocalDate;
import com.google.sps.utils.Ad; 

import com.google.auth.oauth2.GoogleCredentials;
import com.google.cloud.firestore.Firestore;

import com.google.firebase.FirebaseApp;
import com.google.firebase.FirebaseOptions;

import com.google.firebase.cloud.FirestoreClient;
import com.google.cloud.firestore.DocumentReference;

import java.io.IOException;

public class AdRowProcessor {

  private String[] row; 

  public AdRowProcessor(String[] csvRow) {
    this.row = csvRow; 
  }

  public Ad createAdPojo() {
    Ad ad = new Ad.AdBuilder()
      .id(row[0])
      .advertiser(row[1])
      .startDate(LocalDate.parse(row[2])) 
      .endDate(LocalDate.parse(row[3]))
      .impressionsMin(getImpressionsMin(row[4]))
      .impressionsMax(getImpressionsMax(row[4]))
      .ageTargetingEnabled(isAgeTargetingEnabled(row[5]))
      .genderTarget(getArray(row[6]))
      .geoTarget(getArray(row[7]))
      .spendMin(getLong(row[8]))
      .spendMax(getLong(row[9]))
      .headline(row[10].trim())
      .link(row[11].substring(3)) // trim "Ad" from "Ad {URL}"
      .content(row[12].trim())
      .headlineSentiment(row[13].trim())
      .headlineTerms(row[14].trim())
      .contentSentiment(row[15].trim())
      .contentTerms(row[16].trim())
      .build(); 
    System.out.println(ad.toString());
    return ad; 
  }

  public void addAdToDatabase(Ad ad) throws IOException {
    // Use the application default credentials
    GoogleCredentials credentials = GoogleCredentials.getApplicationDefault();
    FirebaseOptions options = new FirebaseOptions.Builder()
        .setCredentials(credentials)
        .setProjectId("step9-2020-capstone")
        .build();
    FirebaseApp.initializeApp(options);
    Firestore db = FirestoreClient.getFirestore();

    DocumentReference docRef = db.collection("ads").document("alovelace");
    // Add document data  with id "alovelace" using a hashmap
    // Map<String, Object> data = new HashMap<>();
    // data.put("first", "Ada");
    // data.put("last", "Lovelace");
    // data.put("born", 1815);
    //asynchronously write data
    // ApiFuture<WriteResult> result = docRef.set(data);
    // System.out.println("Update time : " + result.get().getUpdateTime());
  }

  public long getImpressionsMin(String str) {
    String s = str.replace("k", "000").replace("M", "000000").replace(" ","").replace("\u2264", "");
    String[] arr = s.split("-");
    if (arr.length > 1) {
        return Long.parseLong(arr[0]); 
    }
    return 0;    
  }

  public long getImpressionsMax(String str) {
    String s = str.replace("k", "000").replace("M", "000000").replace(" ","").replace("\u2264", "");
    String[] arr = s.split("-");
    return Long.parseLong(arr[arr.length - 1]);   
  }

  public boolean isAgeTargetingEnabled(String str) {
    if (str.trim().equals("Not targeted")) {
      return false; 
    }
    return true; 
  }

  public String[] getArray(String str) {
    return str.trim().split(","); 
  }

  public long getLong(String value) {
    return (long)Double.parseDouble(value); 
  }
}