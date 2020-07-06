/* 
 * Description: File for building ads and adding them to Firestore
 * Author: Kira Toal
 * Date: June 24, 2020
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
import com.google.sps.utils.Ad.Builder;
import com.google.sps.utils.Ad;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

public class AdRowProcessor {

  private static final String PATH_TO_SERVICE_ACCOUNT = "./serviceAccountKey.json"; 
  private static final String DATABASE_URL = "https://step9-2020-capstone.firebaseio.com"; 
  private String[] row; 

  public AdRowProcessor(String[] csvRow) throws Exception {
    this.row = csvRow; 
    // initialize app
    FileInputStream serviceAccount = new FileInputStream(PATH_TO_SERVICE_ACCOUNT);
    FirebaseOptions options = new FirebaseOptions.Builder()
        .setCredentials(GoogleCredentials.fromStream(serviceAccount))
        .setDatabaseUrl(DATABASE_URL)
        .build();
    if(FirebaseApp.getApps().isEmpty()) {
      FirebaseApp.initializeApp(options);
    }
  }

  public void addAdToDatabase(Ad ad, int rowIndex, String collection) throws Exception {
    Firestore db = FirestoreClient.getFirestore();    
    ApiFuture<WriteResult> result = db.collection(collection).document(ad.id).set(ad);
    System.out.println("Update time : " + result.get().getUpdateTime());
  }

  public Ad createAd() {
    Ad ad = Ad.newBuilder()
        .id(row[0])
        .advertiser(row[1])
        .startDate(row[2]) 
        .endDate(row[3])
        .impressionsMin(getImpressionsMin(row[4]))
        .impressionsMax(getImpressionsMax(row[4]))
        .isTargetingAge(getAgeTargets(row[5]))
        .genderTargets(convertStringToList(row[6]))
        .geoTargets(convertStringToList(row[7]))
        .spendMin(convertStringToLong(row[8]))
        .spendMax(convertStringToLong(row[9]))
        .headline(row[10].trim())
        .link(row[11].substring(3)) // trim "Ad" from "Ad {URL}"
        .content(row[12].trim())
        .headlineSentiment(row[13].trim())
        .headlineTerms(row[14].trim())
        .contentSentiment(row[15].trim())
        .contentTerms(row[16].trim())
        .build();
    return ad; 
  }

  /* Min and max impression fields contain letters k and M as well as ≤. The 
  formatImpressionField helper method makes the fields easier to parse later.
  */ 
  public String[] formatImpressionField(String str) {
    String impressionsString = str.replace("k", "000").replace("M", "000000").replace(" ","").replace("≤", "");
    String[] impressionsArray = impressionsString.split("-");
    return impressionsArray; 
  }

  public long getImpressionsMin(String impressionsField) throws IllegalArgumentException{
    String[] impressionsArray = formatImpressionField(impressionsField); 
    // If csv field uses "<=", arr has length 1 and min number of impressions is 0.
    if (impressionsArray.length > 1) {
      try {
        return Long.parseLong(impressionsArray[0]);
      } catch (IllegalArgumentException e) {
        return -1; 
      }
    }
    return 0;
  }

  public long getImpressionsMax(String impressionsField) throws IllegalArgumentException {
    String[] impressionsArray = formatImpressionField(impressionsField); 
    try {
      return Long.parseLong(impressionsArray[impressionsArray.length - 1]);   
    } catch (IllegalArgumentException e) {
      return -1; 
    }
  }

  public boolean getAgeTargets(String str) {
    if (str.trim().equals("Not targeted")) {
      return false; 
    }
    return true; 
  }

  public List<String> convertStringToList(String str) {
    List<String> trimmedList = Arrays.stream(str.split(","))
        .map(String::trim)
        .collect(Collectors.toList());
    return trimmedList;  
  }

  public long convertStringToLong(String str) {
    if (str.isEmpty()) {
      return -1; 
    }
    return (long) Double.parseDouble(str); 
  }
}