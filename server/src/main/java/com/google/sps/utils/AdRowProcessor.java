/* 
 * Description: Utility class that processes a CSV row and converts between row format and Ad format. 
 * Author: Kira Toal
 * Date: June 24, 2020
 */ 
package com.google.sps.utils;

import com.google.sps.utils.Ad.Builder;
import com.google.sps.utils.Ad;
import java.io.IOException;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

public final class AdRowProcessor {

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

  public static Ad convertRowToAd(String[] row) {
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

  /* 
   * Min and max impression fields contain letters k and M as well as ≤. The 
   * formatImpressionField helper method makes the fields easier to parse later.
   */ 
  public static String[] formatImpressionField(String str) {
    String impressionsString = str.replace("k", "000").replace("M", "000000").replace(" ","").replace("≤", "");
    String[] impressionsArray = impressionsString.split("-");
    return impressionsArray; 
  }

  public static long getImpressionsMin(String impressionsField) throws IllegalArgumentException {
    String[] impressionsArray = formatImpressionField(impressionsField); 
    
    // If csv field uses "<=", arr has length 1 and min number of impressions is 0.
    if (impressionsArray.length > 1) {
      try {
        return Long.parseLong(impressionsArray[0]);
      } catch (NumberFormatException e) {
        System.out.println("Error: " + e);
        System.exit(0);
      }
    }
    return 0;
  }

  public static long getImpressionsMax(String impressionsField) throws IllegalArgumentException {
    String[] impressionsArray = formatImpressionField(impressionsField); 
    try {
      return Long.parseLong(impressionsArray[impressionsArray.length - 1]);   
    } catch (NumberFormatException e) {
      System.out.println("Error: " + e);
      System.exit(0);
    }
    return -1;
  }

  public static boolean getAgeTargets(String str) {
    if (str.trim().equals("Not targeted")) {
      return false; 
    }
    return true; 
  }

  public static List<String> convertStringToList(String str) {
    List<String> trimmedList = Arrays.stream(str.split(","))
        .map(String::trim)
        .collect(Collectors.toList());
    return trimmedList;  
  }

  public static long convertStringToLong(String str) {
    try {
      return (long) Double.parseDouble(str);
    } catch (IllegalArgumentException e) {
      System.out.println("Error: " + e);
      System.exit(0);
    }
    return -1;
  }
}