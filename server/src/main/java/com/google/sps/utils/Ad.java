/* Description: Ad defines the ad objects that we write to Firebase.
 * Author: Kira Toal
 * Date: June 24, 2020
 */
package com.google.sps.utils;
import java.util.List; 
 
public class Ad {

  private String id; 
  private String advertiser;  
  private String startDate; // isostring format
  private String endDate; //isostring
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

  public void setId(String id) {
    this.id = id; 
  }
  public void setAdvertiser(String advertiser) {
    this.advertiser = advertiser; 
  }
  public void setStartDate(String startDate) {
    this.startDate = startDate; 
  }
  public void setEndDate(String endDate) {
    this.endDate = endDate; 
  }
  public void setImpressionsMin(long impressionsMin) {
    this.impressionsMin = impressionsMin; 
  }
  public void setImpressionsMax(long impressionsMax) {
    this.impressionsMax = impressionsMax; 
  }
  public void setIsTargetingAge(boolean isTargetingAge) {
    this.isTargetingAge = isTargetingAge; 
  }
  public void setGenderTargets(List<String> genderTarget) {
    this.genderTargets = genderTargets; 
  }
  public void setGeoTargets(List<String> geoTargets) {
    this.geoTargets = geoTargets;
  }
  public void setSpendMin(long spendMin) {
    this.spendMin = spendMin; 
  }
  public void setSpendMax(long spendMax) {
    this.spendMax = spendMax; 
  }
  public void setHeadline(String headline) {
    this.headline = headline; 
  }
  public void setLink(String link) {
    this.link = link; 
  }
  public void setContent(String content) {
    this.content = content; 
  }
  public void setHeadlineSentiment(String headlineSentiment) {
    this.headlineSentiment = headlineSentiment; 
  }
  public void setHeadlineTerms(String headlineTerms) {
    this.headlineTerms = headlineTerms; 
  }
  public void setContentSentiment(String contentSentiment) {
    this.contentSentiment = contentSentiment; 
  }
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