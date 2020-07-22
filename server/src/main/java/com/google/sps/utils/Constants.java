package com.google.sps.utils;
import java.util.Arrays;
import java.util.HashSet;
import java.util.Set;

/**
 * Description: Defines constants that are used across multiple files.
 * Author: Kira Toal
 * Date: 2020-08-22
 */

public final class Constants {

  public static final Set<String> VALID_GEO_TARGETS = new HashSet<>
      (Arrays.asList("Alabama", "Alaska", "Arizona", "Arkansas", "California",
      "Colorado", "Connecticut", "Delaware", "Florida", "Georgia", "Hawaii",
      "Idaho", "Illinois", "Indiana", "Iowa", "Kansas", "Kentucky", "Louisiana",
      "Maine", "Maryland", "Massachusetts", "Michigan", "Minnesota", "Mississippi",
      "Missouri", "Montana", "Nebraska", "Nevada", "New Hampshire", "New Jersey",
      "New Mexico", "New York", "North Carolina", "North Dakota", "Ohio", "Oklahoma",
      "Oregon", "Pennsylvania", "Rhode Island", "South Carolina", "South Dakota",
      "Tennessee", "Texas", "Utah", "Vermont", "Virginia", "Washington", 
      "West Virginia", "Wisconsin", "Wyoming", "United States"));

  public static final Set<String> TEST_GEO_TARGETS = new HashSet<>
      (Arrays.asList("California"));
}
