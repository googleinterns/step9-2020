package com.google.sps.utils;
import java.util.List; 

/* Description: Ad defines the ad objects that we write to Firebase.
 * Author: Kira Toal
 * Date: June 24, 2020
 */
public class Ad {

  private String id; 
  private String advertiser;  
  private String startDate; 
  private String endDate;
  private long impressionsMin; 
  private long impressionsMax; 
  private boolean isTargetingAge; 
  private List<String> genderTargets; 
  private List<String> geoTargets;
  private long spendMin; 
  private long spendMax; 
  private String headline; 
  private String link;
  private String content;  
  private String headlineSentiment; 
  private String headlineTerms;
  private String contentSentiment; 
  private String contentTerms; 

  /*
   * id refers to the id of the ad in the Google Transparency Report.
   * Expected format: CR + a sequence of integers (Ex: CR100069576900870144)
   */ 
  public void setId(String id) {
    this.id = id; 
  }
  /*
   * advertiser refers to the name of the organisations that ran the ad.
   * Expected format: Advertiser name (Ex: DONALD J. TRUMP FOR PRESIDENT, INC.)
   */ 
  public void setAdvertiser(String advertiser) {
    this.advertiser = advertiser; 
  }
  /*
   * startDate refers to the first day on which the ad started running (inclusive).
   * Expected format: isostring (Ex: 2019-06-18)
   */ 
  public void setStartDate(String startDate) {
    this.startDate = startDate; 
  }
  /*
   * endDate refers to the last day on which the ad ran (inclusive).
   * Expected format: isostring (Ex: 2019-09-18)
   */ 
  public void setEndDate(String endDate) {
    this.endDate = endDate; 
  }
  /*
   * setImpressionsMin refers to the estimated minimum number of people who viewed the ad.
   * Expected format: long (Ex: 100000)
   */ 
  public void setImpressionsMin(long impressionsMin) {
    this.impressionsMin = impressionsMin; 
  }
  /*
   * setImpressionsMax refers to the estimated maximum number of people who viewed the ad.
   * Expected format: long (Ex: 10000)
   */ 
  public void setImpressionsMax(long impressionsMax) {
    this.impressionsMax = impressionsMax; 
  }
  /*
   * isTargetingAge refers to whether the age targeting column of the CSV says
   *        "Not targeted" (in which case isTargetingAge is set to false) or 
   *        contains a list of age ranges (in which case isTargetingAge is set
   *        to true.)
   * Expected format: boolean
   */ 
  public void setIsTargetingAge(boolean isTargetingAge) {
    this.isTargetingAge = isTargetingAge; 
  }
  /*
   * genderTargets refers to the genders at which the ad is targeted.
   * Expected format: A list containing only "Not targeted", or a list containing
   *        at least one of the following: "Female", "Male", "Unknown gender".
   *        (Ex: ["Female", "Unknown gender"])
   */ 
  public void setGenderTargets(List<String> genderTargets) {
    this.genderTargets = genderTargets; 
  }
  /*
   * geoTargets refers to the states at which the ad is targeted.
   * Expected format: A list containing at least one of the 50 states or US
   *        territories (Ex: ["California", "Texas"])
   */ 
  public void setGeoTargets(List<String> geoTargets) {
    this.geoTargets = geoTargets;
  }
  /*
   * spendMin is the estimated minimum amount of money paid to run the ad.
   * Expected format: cost in USD as a long (Ex: 1000)
   */ 
  public void setSpendMin(long spendMin) {
    this.spendMin = spendMin; 
  }
  /*
   * spendMin is the estimated maximum amount of money paid to run the ad.
   * Expected format: cost in USD as a long (Ex: 100000)
   */ 
  public void setSpendMax(long spendMax) {
    this.spendMax = spendMax; 
  }
  /*
   * headline refers to the ad's headline.
   * Expected format: String (Ex: Georgia for TRUMP 2020 | Make America Great Again | Donate Now)
   */ 
  public void setHeadline(String headline) {
    this.headline = headline; 
  }
  /*
   * link refers to the URL at which the original ad can be accessed.
   * Expected format: URL domain and path (no protocal) (Ex: peteforamerica.com)
   */ 
  public void setLink(String link) {
    this.link = link; 
  }
  /*
   * content refers to the text content of the ad.
   * Expected format: A short blurb (Ex: It’s time to turn the page 
          on the broken politics we've come to expect from Washington. 
          Read our plans to fix the economy, tackle climate change, and 
          finally stop endless war.)
   */ 
  public void setContent(String content) {
    this.content = content; 
  }
  /*
   * Expected format: JSON Object (Ex: {score: 0.1, magnitude: 0.1})
   */ 
  public void setHeadlineSentiment(String headlineSentiment) {
    this.headlineSentiment = headlineSentiment; 
  }
  /*
   * Expected format: JSON Array (Ex: ['{name: politics, type: OTHER, salience: 0.27}', 
          '{name: page, type: OTHER, salience: 0.22}', '{name: Washington, type: 
          LOCATION, salience: 0.16}'])
   */ 
  public void setHeadlineTerms(String headlineTerms) {
    this.headlineTerms = headlineTerms; 
  }
  /*
   * Expected format: JSON Object (Ex: {score: -0.4, magnitude: 0.9})
   */ 
  public void setContentSentiment(String contentSentiment) {
    this.contentSentiment = contentSentiment; 
  }
  /*
   * Expected format: JSON Array (Ex: ['{name: Pete Buttigieg, type: PERSON, salience: 0.78}', 
          '{name: Campaign Website, type: OTHER, salience: 0.22}', '{name: 2020, type: DATE, 
          salience: 0.0}'])
   */ 
  public void setContentTerms(String contentTerms) {
    this.contentTerms = contentTerms; 
  }

  public String getId() {
    return this.id; 
  }
  public String getAdvertiser() {
    return this.advertiser; 
  }
  public String getStartDate() {
    return this.startDate;
  }
  public String getEndDate() {
    return this.endDate; 
  }
  public long getImpressionsMin() {
    return this.impressionsMin; 
  }
  public long getImpressionsMax() {
    return this.impressionsMax; 
  }
  public boolean getIsTargetingAge() {
    return this.isTargetingAge; 
  }
  public List<String> getGenderTargets() {
    return this.genderTargets; 
  }
  public List<String> getGeoTargets() {
    return this.geoTargets;
  }
  public long getSpendMin() {
    return this.spendMin; 
  }
  public long getSpendMax() {
    return this.spendMax; 
  }
  public String getHeadline() {
    return this.headline; 
  }
  public String getLink() {
    return this.link; 
  }
  public String getContent() {
    return this.content; 
  }
  public String getHeadlineSentiment() {
    return this.headlineSentiment; 
  }
  public String getHeadlineTerms() {
    return this.headlineTerms; 
  }
  public String getContentSentiment() {
    return this.contentSentiment; 
  }
  public String getContentTerms() {
    return this.contentTerms; 
  }
  /*
   * Builds an instance of Ad. 
   */ 
  static class Builder {
    private Ad instance; 
    public Builder() {
      instance = new Ad(); 
    }
    public Ad.Builder id(String id) {
      instance.setId(id);  
      return this; 
    }
    public Ad.Builder advertiser(String advertiser) {
      instance.setAdvertiser(advertiser); 
      return this; 
    }
    public Ad.Builder startDate(String startDate) {
      instance.setStartDate(startDate); 
      return this; 
    }
    public Ad.Builder endDate(String endDate) {
      instance.setEndDate(endDate); 
      return this; 
    }
    public Ad.Builder impressionsMin(long impressionsMin) {
      instance.setImpressionsMin(impressionsMin); 
      return this; 
    }
    public Ad.Builder impressionsMax(long impressionsMax) {
      instance.setImpressionsMax(impressionsMax); 
      return this; 
    }
    public Ad.Builder isTargetingAge(boolean isTargetingAge) {
      instance.setIsTargetingAge(isTargetingAge); 
      return this; 
    }
    public Ad.Builder genderTargets(List<String> genderTargets) {
      instance.setGenderTargets(genderTargets); 
      return this; 
    }
    public Ad.Builder geoTargets(List<String> geoTargets) {
      instance.setGeoTargets(geoTargets); 
      return this; 
    }
    public Ad.Builder spendMin(long spendMin) {
      instance.setSpendMin(spendMin); 
      return this; 
    }
    public Ad.Builder spendMax(long spendMax) {
      instance.setSpendMax(spendMax); 
      return this; 
    }
    public Ad.Builder headline(String headline) {
      instance.setHeadline(headline); 
      return this; 
    }
    public Ad.Builder link(String link) {
      instance.setLink(link); 
      return this; 
    }
    public Ad.Builder content(String content) {
      instance.setContent(content); 
      return this; 
    }
    public Ad.Builder headlineSentiment(String headlineSentiment) {
      instance.setHeadlineSentiment(headlineSentiment); 
      return this; 
    }
    public Ad.Builder headlineTerms(String headlineTerms) {
      instance.setHeadlineTerms(headlineTerms); 
      return this; 
    }
    public Ad.Builder contentSentiment(String contentSentiment) {
      instance.setContentSentiment(contentSentiment); 
      return this; 
    }
    public Ad.Builder contentTerms(String contentTerms) {
      instance.setContentTerms(contentTerms); 
      return this; 
    }
    public Ad build() {
      return instance; 
    }
  }
  public static Builder newBuilder() {
    return new Ad.Builder(); 
  }
}