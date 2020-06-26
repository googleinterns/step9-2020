/* 
 * Description: Creates ad objects 
 * Author: Kira Toal
 * Date: June 24, 2020
 */
import java.util.Date;

public class Ad {

  private String id; 
  private String advertiser;  
  private Date startDate;
  private Date endDate; 
  private long impressionsMin; 
  private long impressionsMax; 
  private int ageTargetMin; 
  private int ageTargetMax;
  private String[] genderTarget; 
  private String[] geoTarget; 
  private long spendMin; 
  private long spendMax; 
  private String headline; 
  private String link; 
  private String content; 
  private String headlineSentiment; 
  private String headlineTerms;
  private String contentSentiment; 
  private String contentTerms;  


  private Ad(AdBuilder builder) {
    this.id = builder.id;
    this.advertiser = builder.advertiser; 
    this.startDate = builder.startDate; 
    this.endDate = builder.endDate; 
    this.impressionsMin = builder.impressionsMin;
    this.impressionsMax = builder.impressionsMax; 
    this.ageTargetMin = builder.ageTargetMin;
    this.ageTargetMax = builder.ageTargetMax; 
    this.genderTarget = builder.genderTarget; 
    this.geoTarget = builder.geoTarget; 
    this.spendMin = builder.spendMin; 
    this.spendMax = builder.spendMax; 
    this.headline = builder.headline; 
    this.link = builder.link; 
    this.content = builder.content; 
    this.headlineSentiment = builder.headlineSentiment;
    this.headlineTerms = builder.headlineTerms; 
    this.contentSentiment = builder.contentSentiment; 
    this.contentTerms = builder.contentTerms; 
  }
  @Override 
  public String toString() {
    return String.format("ID: %s\nAdvertiser: %s\nSentiment: %s", this.id, this.advertiser, this.contentSentiment); 
  }

  public static class AdBuilder {

    private String id; 
    private String advertiser;  
    private Date startDate;
    private Date endDate; 
    private long impressionsMin; 
    private long impressionsMax; 
    private int ageTargetMin; 
    private int ageTargetMax;
    private String[] genderTarget; 
    private String[] geoTarget; 
    private long spendMin; 
    private long spendMax; 
    private String headline; 
    private String link;
    private String content;  
    private String headlineSentiment; 
    private String headlineTerms;
    private String contentSentiment; 
    private String contentTerms; 

    public AdBuilder id(String adId) {
      this.id = adId; 
      return this; 
    }

    public AdBuilder advertiser(String name) {
      this.advertiser = name; 
      return this; 
    }

    public AdBuilder startDate(Date date) {
      this.startDate = date; 
      return this; 
    }

    public AdBuilder endDate(Date date) {
      this.endDate = date; 
      return this; 
    }

    public AdBuilder impressionsMin(int impressions) {
      this.impressionsMin = impressions;
      return this; 
    }

    public AdBuilder impressionsMax(int impressions) {
      this.impressionsMax = impressions;
      return this; 
    }

    public AdBuilder ageTargetMin(int age) {
      this.ageTargetMin = age;
      return this; 
    }

    public AdBuilder ageTargetMax(int age) {
      this.ageTargetMax = age;
      return this; 
    }

    public AdBuilder genderTarget(String[] targets) {
      this.genderTarget = targets; 
      return this; 
    }

    public AdBuilder geoTarget(String[] targets) {
      this.geoTarget = targets; 
      return this; 
    }

    public AdBuilder spendMin(long spend) {
      this.spendMin = spend; 
      return this; 
    }

    public AdBuilder spendMax(long spend) {
      this.spendMax = spend; 
      return this; 
    }

    public AdBuilder headline(String text) {
      this.headline = text; 
      return this; 
    }

    public AdBuilder link(String url) {
      this.link = url; 
      return this; 
    }

    public AdBuilder content(String text) {
      this.content = text;
      return this; 
    }

    public AdBuilder headlineSentiment(String text) {
      this.headlineSentiment = text;
      return this; 
    }

    public AdBuilder headlineTerms(String text) {
      this.headlineTerms = text;
      return this; 
    }

    public AdBuilder contentSentiment(String text) {
      this.contentSentiment = text;
      return this; 
    }

    public AdBuilder contentTerms(String text) {
      this.contentTerms = text;
      return this;
    }

    // return the Ad object 
    public Ad build() {
      Ad ad = new Ad(this);
      return ad; 
    }
  }

  public static void main(String[] args) {
    Ad ad1 = new AdBuilder()
      .id("123456")
      .advertiser("JOE BIDEN")
      .contentSentiment("Magnitude: 10")
      .build(); 
    System.out.println(ad1.toString());
  }

}