package com.google.sps;

import com.google.sps.utils.Ad;
import com.google.sps.utils.AdRowProcessor;
import java.time.format.DateTimeParseException; 
import java.util.List; 
import java.util.Arrays; 
import java.util.ArrayList;
import org.junit.Assert;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.junit.runners.JUnit4;

@RunWith(JUnit4.class)
public final class AdRowProcessorTest {
  @Test
  public void Should_ParseInputWithoutError_When_InputFormatExpected() {
    String[] row = {"Id","Advertiser","2000-01-01","2000-01-01","≤ 10k",
            "Not targeted","Not targeted","Not targeted","0","0",
            "Headline", "Ad Link","Content", "Headline Sentiment", "Headline Terms", 
            "Content Sentiment", "Content Terms"};
    Ad ad = AdRowProcessor.convertRowToAd(row);
    
    Assert.assertEquals(ad.getId(), "Id");
    Assert.assertEquals(ad.getAdvertiser(), "Advertiser");
    Assert.assertEquals(ad.getStartDate(), "2000-01-01");
    Assert.assertEquals(ad.getEndDate(), "2000-01-01");
    Assert.assertEquals(ad.getImpressionsMin(), 0);
    Assert.assertEquals(ad.getImpressionsMax(), 10000);
    Assert.assertEquals(ad.getIsTargetingAge(), false);
    Assert.assertEquals(ad.getGenderTargets(), Arrays.asList("Not targeted"));
    Assert.assertEquals(ad.getGeoTargets(), Arrays.asList("Not targeted"));
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
  public void Should_ThrowException_When_IncorrectNumberOfArguments() {
    String[] row = {"Id","Advertiser"};
    Ad ad = AdRowProcessor.convertRowToAd(row);
  }

  @Test(expected = DateTimeParseException.class)
  public void Should_ThrowException_When_StartDateNotIsostringFormat() {
    String badStartDate = "2018-22-06";
    String[] row = {"Id","Advertiser",badStartDate,"2000-01-01","≤ 10k",
            "Not targeted","Not targeted","Not targeted","0","0",
            "Headline", "Ad Link","Content", "Headline Sentiment", "Headline Terms", 
            "Content Sentiment", "Content Terms"};
    Ad ad = AdRowProcessor.convertRowToAd(row);
  }

  @Test(expected = DateTimeParseException.class)
  public void Should_ThrowException_When_EndDateNotIsostringFormat() {
    String badEndDate = "2018.11.06";
    String[] row = {"Id","Advertiser","2000-01-01",badEndDate,"≤ 10k",
            "Not targeted","Not targeted","Not targeted","0","0",
            "Headline", "Ad Link","Content", "Headline Sentiment", "Headline Terms", 
            "Content Sentiment", "Content Terms"};
    Ad ad = AdRowProcessor.convertRowToAd(row);
  }

  @Test
  public void Should_ProcessAgeTargetWithoutError_When_TargetHasWhitespace() {
    String untargeted = "    Not Targeted  ";
    String[] row1 = {"Id","Advertiser","2000-01-01","2000-01-01","≤ 10k",untargeted,
                    "Not targeted","Not targeted","0","0","Headline", "Ad Link",
                    "Content", "Headline Sentiment", "Headline Terms", "Content Sentiment",
                    "Content Terms"}; 
    Ad ad1 = AdRowProcessor.convertRowToAd(row1);
    Assert.assertEquals(ad1.getIsTargetingAge(), false); 

    String targeted = " 18-48 ";
    String[] row2 = {"Id","Advertiser","2000-01-01","2000-01-01","≤ 10k",targeted,
                    "Not targeted","Not targeted","0","0","Headline", "Ad Link",
                    "Content", "Headline Sentiment", "Headline Terms", "Content Sentiment",
                    "Content Terms"}; 
    Ad ad2 = AdRowProcessor.convertRowToAd(row2);
    Assert.assertEquals(ad2.getIsTargetingAge(), true);   
  }

  @Test
  public void Should_AcceptTarget_When_GenderTargetValid() {
    String validInput = " Female, Unknown gender ";
    List<String> expected = Arrays.asList("Female","Unknown gender");
    String[] row = {"Id","Advertiser","2000-01-01","2000-01-01","≤ 10k","Not targeted",
                    validInput,"Not targeted","0","0","Headline", "Ad Link",
                    "Content", "Headline Sentiment", "Headline Terms", "Content Sentiment",
                    "Content Terms"}; 
    Ad ad = AdRowProcessor.convertRowToAd(row);
    Assert.assertEquals(ad.getGenderTargets(), expected); 
  }

  @Test(expected = IllegalArgumentException.class)
  public void Should_ThrowException_When_GenderTargetInvalid() {
    String invalidInput = " apples ";
    String[] row = {"Id","Advertiser","2000-01-01","2000-01-01","≤ 10k","Not targeted",
                    invalidInput,"Not targeted","0","0","Headline", "Ad Link",
                    "Content", "Headline Sentiment", "Headline Terms", "Content Sentiment",
                    "Content Terms"}; 
    Ad ad = AdRowProcessor.convertRowToAd(row);
  }

  @Test
  public void Should_AcceptTarget_When_GeoTargetValid() {
    String validInput = " California,    Alaska ";
    List<String> expected = Arrays.asList("California","Alaska");
    String[] row = {"Id","Advertiser","2000-01-01","2000-01-01","≤ 10k","Not targeted",
                    "Not targeted",validInput,"0","0","Headline", "Ad Link",
                    "Content", "Headline Sentiment", "Headline Terms", "Content Sentiment",
                    "Content Terms"}; 
    Ad ad = AdRowProcessor.convertRowToAd(row);
    Assert.assertEquals(ad.getGeoTargets(), expected); 
  }

  @Test(expected = IllegalArgumentException.class)
  public void Should_ThrowException_When_GeoTargetInvalid() {
    String invalidInput = " apples ";
    String[] row = {"Id","Advertiser","2000-01-01","2000-01-01","≤ 10k","Not targeted",
                    "Not targeted",invalidInput,"0","0","Headline", "Ad Link",
                    "Content", "Headline Sentiment", "Headline Terms", "Content Sentiment",
                    "Content Terms"};  
    Ad ad = AdRowProcessor.convertRowToAd(row);
  }

  @Test(expected = IllegalArgumentException.class)
  public void Should_ThrowException_When_SpendMinNotParsable() {
    String invalidInput = " one thousand ";
    String[] row = {"Id","Advertiser","2000-01-01","2000-01-01","≤ 10k","Not targeted",
                    "Not targeted","Not targeted",invalidInput,"0","Headline", "Ad Link",
                    "Content", "Headline Sentiment", "Headline Terms", "Content Sentiment",
                    "Content Terms"};  
    Ad ad = AdRowProcessor.convertRowToAd(row);
  }

  @Test(expected = IllegalArgumentException.class)
  public void Should_ThrowException_When_SpendMaxNotParsable() {
    String invalidInput = " two million ";
    String[] row = {"Id","Advertiser","2000-01-01","2000-01-01","≤ 10k","Not targeted",
                    "Not targeted","Not targeted","0",invalidInput,"Headline", "Ad Link",
                    "Content", "Headline Sentiment", "Headline Terms", "Content Sentiment",
                    "Content Terms"};  
    Ad ad = AdRowProcessor.convertRowToAd(row);
  }



}