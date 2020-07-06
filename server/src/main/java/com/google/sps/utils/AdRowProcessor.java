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
  private static final int ID_ROW = 0;
  private static final int ADVERTISER_ROW = 1; 
  private static final int START_DATE_ROW = 2;
  private static final int END_DATE_ROW = 3;
  private static final int IMPRESSIONS_ROW = 4;
  private static final int IS_TARGETING_AGE_ROW = 5; 
  private static final int GENDER_TARGETS_ROW = 6; 
  private static final int GEO_TARGETS_ROW = 7;
  private static final int SPEND_MIN_ROW = 8;
  private static final int SPEND_MAX_ROW = 9; 
  private static final int HEADLINE_ROW = 10; 
  private static final int LINK_ROW = 11;
  private static final int CONTENT_ROW = 12;
  private static final int HEADLINE_SENTIMENT_ROW = 13;
  private static final int HEADLINE_TERMS_ROW = 14;
  private static final int CONTENT_SENTIMENT_ROW = 15;
  private static final int CONTENT_TERMS_ROW = 16; 
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

  public void writeAd(Ad ad, int rowIndex, String collection) throws Exception {
    Firestore db = FirestoreClient.getFirestore();    
    ApiFuture<WriteResult> result = db.collection(collection).document(ad.getId()).set(ad);
    System.out.println("Update time : " + result.get().getUpdateTime());
  }

  public Ad createAd() {
    Ad ad = Ad.newBuilder()
        .id(row[ID_ROW])
        .advertiser(row[ADVERTISER_ROW])
        .startDate(row[START_DATE_ROW]) 
        .endDate(row[END_DATE_ROW])
        .impressionsMin(getImpressionsMin(row[IMPRESSIONS_ROW]))
        .impressionsMax(getImpressionsMax(row[IMPRESSIONS_ROW]))
        .isTargetingAge(getAgeTargets(row[IS_TARGETING_AGE_ROW]))
        .genderTargets(convertStringToList(row[GENDER_TARGETS_ROW]))
        .geoTargets(convertStringToList(row[GEO_TARGETS_ROW]))
        .spendMin(convertStringToLong(row[SPEND_MIN_ROW]))
        .spendMax(convertStringToLong(row[SPEND_MAX_ROW]))
        .headline(row[HEADLINE_ROW].trim())
        .link(row[LINK_ROW].substring(3)) // trim "Ad" from "Ad {URL}"
        .content(row[CONTENT_ROW].trim())
        .headlineSentiment(row[HEADLINE_SENTIMENT_ROW].trim())
        .headlineTerms(row[HEADLINE_TERMS_ROW].trim())
        .contentSentiment(row[CONTENT_SENTIMENT_ROW].trim())
        .contentTerms(row[CONTENT_TERMS_ROW].trim())
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

  public long getImpressionsMin(String impressionsField) throws IllegalArgumentException {
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