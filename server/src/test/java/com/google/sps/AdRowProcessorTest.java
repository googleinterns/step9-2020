package com.google.sps;
import com.google.sps.utils.Ad;
import com.google.sps.utils.AdRowProcessor;
import java.time.format.DateTimeParseException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import org.junit.Assert;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.junit.runners.JUnit4;

@RunWith(JUnit4.class)
public final class AdRowProcessorTest {
  private static final int ID_INDEX = 0;
  private static final int ADVERTISER_INDEX = 1; 
  private static final int START_DATE_INDEX = 2;
  private static final int END_DATE_INDEX = 3;
  private static final int IMPRESSIONS_INDEX = 4;
  private static final int IS_TARGETING_AGE_INDEX = 5; 
  private static final int GENDER_TARGET_INDEX = 6; 
  private static final int GEO_TARGET_INDEX = 7;
  private static final int SPEND_MIN_INDEX = 8;
  private static final int SPEND_MAX_INDEX = 9; 
  private static final int HEADLINE_INDEX = 10; 
  private static final int LINK_INDEX = 11;
  private static final int CONTENT_INDEX = 12;
  private static final int HEADLINE_SENTIMENT_INDEX = 13;
  private static final int HEADLINE_TERMS_INDEX = 14;
  private static final int CONTENT_SENTIMENT_INDEX = 15;
  private static final int CONTENT_TERMS_INDEX = 16;
  String[] standardRow = {"Id","Advertiser","2000-01-01","2000-01-01","≤ 10k",
      "Not targeted","Not targeted","Not targeted","0","0",
      "Headline", "Ad Link","Content", "Headline Sentiment", "Headline Terms", 
      "Content Sentiment", "Content Terms"};

  @Test
  public void convertRowToAd_inputFormatExpected_parseWithoutError() {
    Ad ad = AdRowProcessor.convertRowToAd(standardRow);
    
    Assert.assertEquals(ad.getId(), "Id");
    Assert.assertEquals(ad.getAdvertiser(), "Advertiser");
    Assert.assertEquals(ad.getStartDate(), "2000-01-01");
    Assert.assertEquals(ad.getEndDate(), "2000-01-01");
    Assert.assertEquals(ad.getImpressionsMin(), 0);
    Assert.assertEquals(ad.getImpressionsMax(), 10000);
    Assert.assertEquals(ad.getIsTargetingAge(), false);
    Assert.assertEquals(ad.getGenderTarget(), Arrays.asList("Not targeted"));
    Assert.assertEquals(ad.getGeoTarget(), Arrays.asList("Not targeted"));
    Assert.assertEquals(ad.getSpendMin(), 0);
    Assert.assertEquals(ad.getSpendMax(), 0);
    Assert.assertEquals(ad.getHeadline(), "Headline");
    Assert.assertEquals(ad.getLink(), "Link");
    Assert.assertEquals(ad.getContent(), "Content");
    Assert.assertEquals(ad.getHeadlineSentiment(), "Headline Sentiment");
    Assert.assertEquals(ad.getHeadlineTerms(), "Headline Terms");
    Assert.assertEquals(ad.getContentSentiment(), "Content Sentiment");
    Assert.assertEquals(ad.getContentTerms(), "Content Terms");   
  }

  @Test(expected = IllegalArgumentException.class)
  public void convertRowToAd_wrongNumberOfArgs_throwException() {
    String[] row = {"Id","Advertiser"};
    Ad ad = AdRowProcessor.convertRowToAd(row);
  }

  @Test(expected = DateTimeParseException.class)
  public void checkDateFormat_nonisostringFormat_throwException() {
    String badStartDate = "2018-22-06";
    convertRowToAd(badStartDate, START_DATE_INDEX);
  }

  @Test
  public void checkAgeTarget_extraWhitespace_parseWithoutError() {
    String untargeted = "    Not Targeted  ";
    Assert.assertEquals(convertRowToAd(untargeted, IS_TARGETING_AGE_INDEX).getIsTargetingAge(), false); 

    String targeted = " 18-48, 65+, Unknown age  ";
    Assert.assertEquals(convertRowToAd(targeted, IS_TARGETING_AGE_INDEX).getIsTargetingAge(), true);   
  }

  @Test(expected = IllegalArgumentException.class)
  public void checkGenderTarget_invalidString_throwException() {
    convertRowToAd("apples, Male, Unknown gender", GENDER_TARGET_INDEX);
  }

  @Test(expected = IllegalArgumentException.class)
  public void checkGenderTarget_emptyString_throwException() {
    convertRowToAd("", GENDER_TARGET_INDEX);
  }

  @Test
  public void checkGeoTarget_extraWhitespace_parseWithoutError() {
    List<String> expected = Arrays.asList("California","Alaska");
    Assert.assertEquals(convertRowToAd(" California,    Alaska ", GEO_TARGET_INDEX).getGeoTarget(), expected); 
  }

  @Test(expected = IllegalArgumentException.class)
  public void checkGeoTarget_invalidString_throwException() {
    convertRowToAd("_Kentucky", GEO_TARGET_INDEX);
  }

  @Test(expected = IllegalArgumentException.class)
  public void checkGeoTarget_emptyString_throwException() {
    convertRowToAd("", GEO_TARGET_INDEX);
  }

  @Test(expected = IllegalArgumentException.class)
  public void convertStringToLong_invalidInput_throwException() {
    convertRowToAd(" one thousand ", SPEND_MIN_INDEX);
  }

  @Test(expected = IllegalArgumentException.class)
  public void convertStringToLong_emptyInput_throwException() {
    convertRowToAd("", SPEND_MIN_INDEX);
  }
  
  @Test
  public void getLink_oneArgLinkField_returnFirstArg() {
    String expected = "ad.com";
    Assert.assertEquals(convertRowToAd(" ad.com ", LINK_INDEX).getLink(), expected); 
  }
  
  @Test
  public void getLink_twoArgLinkField_returnSecondArg() {
    String expected = "ad.com";  
    Assert.assertEquals(convertRowToAd(" Ad ad.com ", LINK_INDEX).getLink(), expected); 
  }

  @Test(expected = IllegalArgumentException.class)
  public void getLink_moreThanTwoArgs_throwException() {
    convertRowToAd(" Ad ad.com ad.com", LINK_INDEX);
  }

  public Ad convertRowToAd(String input, int rowIndex) {
    String[] row = standardRow;
    row[rowIndex] = input; 
    Ad ad = AdRowProcessor.convertRowToAd(row);  
    return ad;  
  }
}