/* 
 * Author: Kira Toal
 * Date: June 24, 2020
 */
package com.google.sps.utils;
import java.util.List; 
 
public class Ad {
  // fields
  public String id; 
  public String advertiser;  
  public String startDate; // isostring format
  public String endDate; //isostring
  public long impressionsMin; 
  public long impressionsMax; 
  public boolean isTargetingAge; 
  public List<String> genderTargets; 
  public List<String> geoTargets;
  public long spendMin; 
  public long spendMax; 
  public String headline; 
  public String link;
  public String content;  
  public String headlineSentiment; 
  public String headlineTerms;
  public String contentSentiment; 
  public String contentTerms; 
  // setter methods
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
  // getter methods 
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
      instance.id = id; 
      return this; 
    }
    public Ad.Builder advertiser(String advertiser) {
      instance.advertiser = advertiser; 
      return this; 
    }
    public Ad.Builder startDate(String startDate) {
      instance.startDate = startDate; 
      return this; 
    }
    public Ad.Builder endDate(String endDate) {
      instance.endDate = endDate; 
      return this; 
    }
    public Ad.Builder impressionsMin(long impressionsMin) {
      instance.impressionsMin = impressionsMin; 
      return this; 
    }
    public Ad.Builder impressionsMax(long impressionsMax) {
      instance.impressionsMax = impressionsMax; 
      return this; 
    }
    public Ad.Builder isTargetingAge(boolean isTargetingAge) {
      instance.isTargetingAge = isTargetingAge; 
      return this; 
    }
    public Ad.Builder genderTargets(List<String> genderTargets) {
      instance.genderTargets = genderTargets; 
      return this; 
    }
    public Ad.Builder geoTargets(List<String> geoTargets) {
      instance.geoTargets = geoTargets; 
      return this; 
    }
    public Ad.Builder spendMin(long spendMin) {
      instance.spendMin = spendMin; 
      return this; 
    }
    public Ad.Builder spendMax(long spendMax) {
      instance.spendMax = spendMax; 
      return this; 
    }
    public Ad.Builder headline(String headline) {
      instance.headline = headline; 
      return this; 
    }
    public Ad.Builder link(String link) {
      instance.link = link; 
      return this; 
    }
    public Ad.Builder content(String content) {
      instance.content = content; 
      return this; 
    }
    public Ad.Builder headlineSentiment(String headlineSentiment) {
      instance.headlineSentiment = headlineSentiment; 
      return this; 
    }
    public Ad.Builder headlineTerms(String headlineTerms) {
      instance.headlineTerms = headlineTerms; 
      return this; 
    }
    public Ad.Builder contentSentiment(String contentSentiment) {
      instance.contentSentiment = contentSentiment; 
      return this; 
    }
    public Ad.Builder contentTerms(String contentTerms) {
      instance.contentTerms = contentTerms; 
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