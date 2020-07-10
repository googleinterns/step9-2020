package com.google.sps.utils;
import com.google.sps.utils.Ad.Builder;
import com.google.sps.utils.Ad;
import java.io.IOException;
import java.time.LocalDate;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

/* 
 * Description: Utility class that processes CSV rows and converts between row format and Ad format. 
 * Author: Kira Toal
 * Date: June 24, 2020
 */ 
public final class AdRowProcessor {

  private static final Set<String> VALID_GENDER_TARGETS = new HashSet<>(Arrays.asList
      ("not targeted", "female", "male", "unknown gender"));
  private static final Set<String> VALID_GEO_TARGETS = new HashSet<>(Arrays.asList("alabama", "alaska", 
      "american samoa", "arizona", "arkansas", "california", "colorado", "connecticut", "delaware", 
      "district of columbia", "florida", "georgia", "guam", "hawaii", "idaho", "illinois", "indiana", "iowa", 
      "kansas", "kentucky", "louisiana", "maine", "maryland", "massachusetts", "michigan", "minnesota", 
      "minor outlying islands", "mississippi", "missouri", "montana", "nebraska", "nevada", "new hampshire", 
      "new jersey", "new mexico", "new york", "north carolina", "north dakota", "northern mariana islands", 
      "ohio", "oklahoma", "oregon", "pennsylvania", "puerto rico", "rhode island", "south carolina", "south dakota", 
      "tennessee", "texas", "u.s. virgin islands", "utah", "vermont", "virginia", "washington", "west virginia", 
      "wisconsin", "wyoming", "united states", "the united states", "not targeted"));
  private static final int NUMBER_OF_FIELDS = 17;
  private static final int ID_COLUMN = 0;
  private static final int ADVERTISER_COLUMN = 1; 
  private static final int START_DATE_COLUMN = 2;
  private static final int END_DATE_COLUMN = 3;
  private static final int IMPRESSIONS_COLUMN = 4;
  private static final int IS_TARGETING_AGE_COLUMN = 5; 
  private static final int GENDER_TARGET_COLUMN = 6; 
  private static final int GEO_TARGET_COLUMN = 7;
  private static final int SPEND_MIN_COLUMN = 8;
  private static final int SPEND_MAX_COLUMN = 9; 
  private static final int HEADLINE_COLUMN = 10; 
  private static final int LINK_COLUMN = 11;
  private static final int CONTENT_COLUMN = 12;
  private static final int HEADLINE_SENTIMENT_COLUMN = 13;
  private static final int HEADLINE_TERMS_COLUMN = 14;
  private static final int CONTENT_SENTIMENT_COLUMN = 15;
  private static final int CONTENT_TERMS_COLUMN = 16; 

  public enum ImpressionType { 
    MIN, MAX 
  }

  public static Ad convertRowToAd(String[] row) {
    if (row.length != NUMBER_OF_FIELDS) {
      throw new IllegalArgumentException("Incorrect number of fields for Ad object. Row length:" 
          + row.length + "\nRow: " + row);
    }
    Ad ad = Ad.newBuilder()
        .id(row[ID_COLUMN])
        .advertiser(row[ADVERTISER_COLUMN])
        .startDate(checkDateFormat(row[START_DATE_COLUMN])) 
        .endDate(checkDateFormat(row[END_DATE_COLUMN]))
        .impressionsMin(getImpressions(row[IMPRESSIONS_COLUMN], ImpressionType.MIN))
        .impressionsMax(getImpressions(row[IMPRESSIONS_COLUMN], ImpressionType.MAX))
        .isTargetingAge(isTargetingAge(row[IS_TARGETING_AGE_COLUMN]))
        .genderTarget(checkGenderTarget(row[GENDER_TARGET_COLUMN]))
        .geoTarget(checkGeoTarget(row[GEO_TARGET_COLUMN]))
        .spendMin(convertStringToLong(row[SPEND_MIN_COLUMN]))
        .spendMax(convertStringToLong(row[SPEND_MAX_COLUMN]))
        .headline(row[HEADLINE_COLUMN].trim())
        .link(getLink(row[LINK_COLUMN]))
        .content(row[CONTENT_COLUMN].trim())
        .headlineSentiment(row[HEADLINE_SENTIMENT_COLUMN].trim())
        .headlineTerms(row[HEADLINE_TERMS_COLUMN].trim())
        .contentSentiment(row[CONTENT_SENTIMENT_COLUMN].trim())
        .contentTerms(row[CONTENT_TERMS_COLUMN].trim())
        .build();
    return ad; 
  }

  /*
   * Helper function for cleaning up strings.
   */
  public static String trimAndLower(String str) { 
    return str.trim().toLowerCase(); 
  }

  /*
   * Helper function tries to convert date strings to LocalDates to ensure they are 
   * in isostring format.
   * checkDateFormat does *not* return the parsed LocalDate because Firestore does not
   * support that datatype. Dates are converted after retrieval from Firestore.
   */
  public static String checkDateFormat(String date) {
    DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");
    LocalDate localDate = LocalDate.parse(date, formatter);
    return date;
  }

  /* 
   * getImpressions attempts to parse the impressions field for min and max impressions.
   * Impression field stores impressions in one of the following formats, where n and m are numbers:
   *      (a) <= n
   *      (b) n-m
   * In the case of a, min impressions = 0 and max impressions = n.
   * In the case of b, min impressions = n and max impressions = m.
   */ 
  public static long getImpressions(String impressionsField, ImpressionType impressionType) throws IllegalArgumentException, NumberFormatException { 
    String[] impressionsArray = formatImpressionField(impressionsField); 
    if (impressionType.equals(ImpressionType.MIN)) { // Get minimum number of impressions.
      if (impressionsArray.length > 1) {
        return Long.parseLong(impressionsArray[0]);
      }
      return 0L; // If csv field uses "<=", the min number of impressions is 0.
    } else if (impressionType.equals(ImpressionType.MAX)) { // Get maximum number of impressions.
      return Long.parseLong(impressionsArray[impressionsArray.length - 1]);   
    } else {
      throw new IllegalArgumentException(impressionType + " is not a valid impression type.");
    }
  }

  /* 
   * Helper function for getImpressionsMin and getImpressionsMax.
   * Min and max impression fields contain letters k and M as well as ≤. The 
   * formatImpressionField helper method makes the fields easier to parse later.
   */ 
  public static String[] formatImpressionField(String str) {
    String impressionsString = str.replace("k", "000").replace("M", "000000").replace(" ","").replace("≤", "");
    String[] impressionsArray = impressionsString.split("-");
    return impressionsArray; 
  }

  /* 
   * isTargetingAge determines whether or not the ad is targeting age.
   */ 
  public static boolean isTargetingAge(String str) {
    return !trimAndLower(str).equals("not targeted");
  }

  /* 
   * checkGenderTarget determines if the arguments in the gender target field are valid.
   * If they are not valid, the function will throw an exception.
   */
  public static List<String> checkGenderTarget(String str) throws IllegalArgumentException {
    List<String> targets = convertStringToList(str);
    for (String target : targets) {
      if (!VALID_GENDER_TARGETS.contains(trimAndLower(target))) {
          throw new IllegalArgumentException("Gender target field contains invalid target.");
      }
    }
    return targets;  
  }

  /* 
   * checkGeoTargets determines if the arguments in the geo target field are valid.
   * If they are not valid, the function will throw an exception.
   */
  public static List<String> checkGeoTarget(String str) throws IllegalArgumentException {
    List<String> targets = convertStringToList(str);
    for (String target : targets) {
      if (!VALID_GEO_TARGETS.contains(trimAndLower(target))) {
          throw new IllegalArgumentException("Geo target field contains invalid target.");
      }
    }
    return targets;  
  }

  /*
   * Helper function for checkGenderTargets and checkGeoTargets that converts the 
   * fields from String to list format and removes excess whitespace. 
   */ 
  public static List<String> convertStringToList(String str) {
    List<String> trimmedList = Arrays.stream(str.split(","))
        .map(String::trim)
        .collect(Collectors.toList());
    return trimmedList;  
  }

  /* 
   * convertStringToLong attempts to convert a String argument to a long and throws
   * an exception if the String is not parsable.
   */ 
  public static long convertStringToLong(String str) throws IllegalArgumentException {
    return (long) Double.parseDouble(str.trim());
  }

  /* 
   * getLink determines the format of the link in the ad's link field.
   * The function parses the link if it is in a valid format, and throws and exception if it is not.
   */ 
  public static String getLink(String link) throws IllegalArgumentException {
    String[] linkArray = link.trim().split(" ");
    int arrLength = linkArray.length;
    switch(arrLength) {
      case 1 :
        return linkArray[0]; 
      case 2 :
        return linkArray[1];
      default :
        throw new IllegalArgumentException("Link field contains invalid argument. Link: " + link);
    }
  }
}