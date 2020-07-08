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

import java.time.format.DateTimeFormatter;
import java.time.LocalDate; 

/* 
 * Description: Utility class that processes a CSV row and converts between row format and Ad format. 
 * Author: Kira Toal
 * Date: June 24, 2020
 */ 
public final class AdRowProcessor {

  private static final int ID_COLUMN = 0;
  private static final int ADVERTISER_COLUMN = 1; 
  private static final int START_DATE_COLUMN = 2;
  private static final int END_DATE_COLUMN = 3;
  private static final int IMPRESSIONS_COLUMN = 4;
  private static final int IS_TARGETING_AGE_COLUMN = 5; 
  private static final int GENDER_TARGETS_COLUMN = 6; 
  private static final int GEO_TARGETS_COLUMN = 7;
  private static final int SPEND_MIN_COLUMN = 8;
  private static final int SPEND_MAX_COLUMN = 9; 
  private static final int HEADLINE_COLUMN = 10; 
  private static final int LINK_COLUMN = 11;
  private static final int CONTENT_COLUMN = 12;
  private static final int HEADLINE_SENTIMENT_COLUMN = 13;
  private static final int HEADLINE_TERMS_COLUMN = 14;
  private static final int CONTENT_SENTIMENT_COLUMN = 15;
  private static final int CONTENT_TERMS_COLUMN = 16; 

  public static Ad convertRowToAd(String[] row) {
    if (row.length != 17) {
      throw new IllegalArgumentException();
    }
    Ad ad = Ad.newBuilder()
        .id(row[ID_COLUMN])
        .advertiser(row[ADVERTISER_COLUMN])
        .startDate(checkDateFormat(row[START_DATE_COLUMN])) 
        .endDate(checkDateFormat(row[END_DATE_COLUMN]))
        .impressionsMin(getImpressionsMin(row[IMPRESSIONS_COLUMN]))
        .impressionsMax(getImpressionsMax(row[IMPRESSIONS_COLUMN]))
        .isTargetingAge(getAgeTargets(row[IS_TARGETING_AGE_COLUMN]))
        .genderTargets(checkGenderTargets(row[GENDER_TARGETS_COLUMN]))
        .geoTargets(checkGeoTargets(row[GEO_TARGETS_COLUMN]))
        .spendMin(convertStringToLong(row[SPEND_MIN_COLUMN]))
        .spendMax(convertStringToLong(row[SPEND_MAX_COLUMN]))
        .headline(row[HEADLINE_COLUMN].trim())
        .link(row[LINK_COLUMN].substring(3)) // trim "Ad" from "Ad {URL}"
        .content(row[CONTENT_COLUMN].trim())
        .headlineSentiment(row[HEADLINE_SENTIMENT_COLUMN].trim())
        .headlineTerms(row[HEADLINE_TERMS_COLUMN].trim())
        .contentSentiment(row[CONTENT_SENTIMENT_COLUMN].trim())
        .contentTerms(row[CONTENT_TERMS_COLUMN].trim())
        .build();
    return ad; 
  }

  /*
   * Helper function tries to convert date strings to LocalDates to ensure they are 
   * in isostring format.
   * checkDateFormat does *not* return the parsed LocalDate because Firebase does not
   * support that datatype. Dates are converted after retrieval from Firebase.
   */
  public static String checkDateFormat(String date) {
    DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");
    LocalDate localDate = LocalDate.parse(date, formatter);
    return date;
  }

  public static long getImpressionsMin(String impressionsField) throws IllegalArgumentException, NumberFormatException {
    String[] impressionsArray = formatImpressionField(impressionsField); 
    
    // If csv field uses "<=", arr has length 1 and min number of impressions is 0.
    if (impressionsArray.length > 1) {
      return Long.parseLong(impressionsArray[0]);
    }
    return 0;
  }

  public static long getImpressionsMax(String impressionsField) throws IllegalArgumentException, NumberFormatException {
    String[] impressionsArray = formatImpressionField(impressionsField); 
    return Long.parseLong(impressionsArray[impressionsArray.length - 1]);   
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

  public static boolean getAgeTargets(String str) {
    if (str.trim().toLowerCase().equals("not targeted")) {
      return false; 
    }
    return true; 
  }

  public static List<String> checkGenderTargets(String str) throws IllegalArgumentException {
    List<String> targets = convertStringToList(str);
    List<String> validGenderTargets = Arrays.asList("not targeted", "female", "male", "unknown gender");
    for (String target : targets) {
      if (!validGenderTargets.contains(target.trim().toLowerCase())) {
          throw new IllegalArgumentException("Gender target field contains invalid target.");
      }
    }
    return targets;  
  }

  public static List<String> checkGeoTargets(String str) throws IllegalArgumentException {
    List<String> targets = convertStringToList(str);
    List<String> validGeoTargets = Arrays.asList("alabama", "alaska", "american samoa", "arizona", 
                                                "arkansas", "california", "colorado", "connecticut", 
                                                "delaware", "district of columbia", "florida", "georgia", 
                                                "guam", "hawaii", "idaho", "illinois", "indiana", "iowa", 
                                                "kansas", "kentucky", "louisiana", "maine", "maryland", 
                                                "massachusetts", "michigan", "minnesota", "minor outlying islands", 
                                                "mississippi", "missouri", "montana", "nebraska", "nevada", 
                                                "new hampshire", "new jersey", "new mexico", "new york", 
                                                "north carolina", "north dakota", "northern mariana islands", 
                                                "ohio", "oklahoma", "oregon", "pennsylvania", "puerto rico", 
                                                "rhode island", "south carolina", "south dakota", "tennessee", 
                                                "texas", "u.s. virgin islands", "utah", "vermont", "virginia", 
                                                "washington", "west virginia", "wisconsin", "wyoming", 
                                                "united states", "the united states","not targeted");
    for (String target : targets) {
      if (!validGeoTargets.contains(target.trim().toLowerCase())) {
          throw new IllegalArgumentException("Geo target field contains invalid target.");
      }
    }
    return targets;  
  }

  public static List<String> convertStringToList(String str) {
    List<String> trimmedList = Arrays.stream(str.split(","))
        .map(String::trim)
        .collect(Collectors.toList());
    return trimmedList;  
  }

  public static long convertStringToLong(String str) throws IllegalArgumentException {
    return (long) Double.parseDouble(str);
  }
}