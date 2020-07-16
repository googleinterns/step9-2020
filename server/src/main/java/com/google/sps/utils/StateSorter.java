package com.google.sps.utils;

import com.google.sps.utils.Ad;
import com.google.sps.utils.FirebaseAdReader;
import com.google.sps.utils.States;

import java.util.ArrayList;
import java.util.List;
import java.util.HashMap;

/* 
 * Description: 
 * Author: Kira Toal
 * Date: July 16, 2020
 */ 
public class StateSorter {

  private static final String COLLECTION = "ads";
  private static final String DATABASE_URL = "https://step9-2020-capstone.firebaseio.com"; 
  private static final String PATH_TO_SERVICE_ACCOUNT = "./serviceAccountKey.json"; 
  private static final int TIMEOUT_ALLOWANCE = 30; // Time in seconds before future.get() times out.

  public static void main(String[] args) throws Exception {
    List<Ad> ads = FirebaseAdReader.readAds(COLLECTION, DATABASE_URL, PATH_TO_SERVICE_ACCOUNT, TIMEOUT_ALLOWANCE);
    HashMap<String, Integer> statesMap = States.getStates();

    for (Ad ad: ads) {
      for (String geoTarget: ad.getGeoTarget()) {
        increment(statesMap, geoTarget);
      }
    }

    System.out.println(statesMap);

  }

  public static<String> void increment(HashMap<String, Integer> map, String key) {
		map.putIfAbsent(key, 0);
		map.put(key, map.get(key) + 1);
	}

}