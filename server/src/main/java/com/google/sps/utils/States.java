package com.google.sps.utils;

import java.util.Set;
import java.util.HashSet;
import java.util.HashMap;
import java.util.ArrayList;
import java.util.Arrays;

/* 
 * Description: Utility class that 
 * Author: Kira Toal
 * Date: July 16, 2020
 */ 
public final class States {

  private static final Set<String> VALID_GEO_TARGETS = new HashSet<>(Arrays.asList("Alabama", "Alaska", 
          "American Samoa", "Arizona", "Arkansas", "California", "Colorado", "Connecticut", "Delaware", 
          "District of Columbia", "Florida", "Georgia", "Guam", "Hawaii", "Idaho", "Illinois", "Indiana", 
          "Iowa", "Kansas", "Kentucky", "Louisiana", "Maine", "Maryland", "Massachusetts", "Michigan", 
          "Minnesota", "Minor Outlying Islands", "Mississippi", "Missouri", "Montana", "Nebraska", "Nevada", 
          "New Hampshire", "New Jersey", "New Mexico", "New York", "North Carolina", "North Dakota", 
          "Northern Mariana Islands", "Ohio", "Oklahoma", "Oregon", "Pennsylvania", "Puerto Rico", "Rhode Island", 
          "South Carolina", "South Dakota", "Tennessee", "Texas", "U.S. Virgin Islands", "Utah", "Vermont", 
          "Virginia", "Washington", "West Virginia", "Wisconsin", "Wyoming"));

  public static HashMap<String, Integer> getStates() {
    HashMap<String, Integer> states = new HashMap<String, Integer>();
    for (String state: VALID_GEO_TARGETS) {
      states.put(state, 0);
    }
    return states;
  }
}