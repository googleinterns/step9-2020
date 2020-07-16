package com.google.sps.utils;

import com.google.sps.utils.Ad;
import com.google.sps.utils.FirebaseAdReader;

import java.util.ArrayList;
import java.util.List;

/* 
 * Description: 
 * Author: Kira Toal
 * Date: July 16, 2020
 */ 
public class StateSorter {

  private static final String COLLECTION = "testing";
  private static final String DATABASE_URL = "https://step9-2020-capstone.firebaseio.com"; 
  private static final String PATH_TO_SERVICE_ACCOUNT = "./serviceAccountKey.json"; 
  private static final int TIMEOUT_ALLOWANCE = 30; // Time in seconds before future.get() times out.

  public static void main(String[] args) throws Exception {
    List<Ad> ads = FirebaseAdReader.readAds(COLLECTION, DATABASE_URL, PATH_TO_SERVICE_ACCOUNT, TIMEOUT_ALLOWANCE);

    for (Ad ad: ads) {
      System.out.println(ad.getId());
    }
  }

}