package com.google.sps;

import com.google.sps.utils.Ad;
import com.google.sps.utils.AdRowProcessor;
import java.util.List; 
import java.util.Arrays; 
import org.junit.Assert;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.junit.runners.JUnit4;

import java.time.format.DateTimeParseException; 

/*
 * 
 */
@RunWith(JUnit4.class)
public final class AdRowProcessorTest {
  @Test
  public void expectedInput() {
    String[] row = {"CR53959591413","FRIENDS OF SUZY GLOWIAK","2018-09-22","2018-11-06","≤ 10k",
            "Not targeted","Not targeted","Illinois, California","100","1000.0","The reasonable choice",
            "Ad suzyforsenate.com/about","Suzy Glowiak is the common-sense pick for the 24th.",
            "Headline Sentiment", "Headline Terms", "Content Sentiment", "Content Terms"};
    Ad ad = AdRowProcessor.convertRowToAd(row);
    
    Assert.assertEquals(ad.getId(), "CR53959591413");
    Assert.assertEquals(ad.getAdvertiser(), "FRIENDS OF SUZY GLOWIAK");
    Assert.assertEquals(ad.getStartDate(), "2018-09-22");
    Assert.assertEquals(ad.getEndDate(), "2018-11-06");
    Assert.assertEquals(ad.getImpressionsMin(), 0);
    Assert.assertEquals(ad.getImpressionsMax(), 10000);
    Assert.assertEquals(ad.getIsTargetingAge(), false);
    Assert.assertEquals(ad.getGenderTargets(), Arrays.asList("Not targeted"));
    Assert.assertEquals(ad.getSpendMin(), 100);
    Assert.assertEquals(ad.getSpendMax(), 1000);
    Assert.assertEquals(ad.getHeadline(), "The reasonable choice");
    Assert.assertEquals(ad.getLink(), "suzyforsenate.com/about");
    Assert.assertEquals(ad.getContent(), "Suzy Glowiak is the common-sense pick for the 24th.");
    Assert.assertEquals(ad.getHeadlineSentiment(), "Headline Sentiment");
    Assert.assertEquals(ad.getHeadlineTerms(), "Headline Terms");
    Assert.assertEquals(ad.getContentSentiment(), "Content Sentiment");
    Assert.assertEquals(ad.getContentTerms(), "Content Terms");   
  }

  @Test(expected = IllegalArgumentException.class)
  public void incorrectNumberOfArguments() {
    String[] row = {"CR53959591413","FRIENDS OF SUZY GLOWIAK"};
    Ad ad = AdRowProcessor.convertRowToAd(row);
  }

  @Test(expected = DateTimeParseException.class)
  public void startDateNotInIsostringFormat() {
    String badStartDate = "2018-22-09";
    String[] row = {"CR53959591413","FRIENDS OF SUZY GLOWIAK",badStartDate,"2018-11-06","≤ 10k",
            "Not targeted","Not targeted","Illinois, California","100","1000.0","The reasonable choice",
            "Ad suzyforsenate.com/about","Suzy Glowiak is the common-sense pick for the 24th.",
            "Headline Sentiment", "Headline Terms", "Content Sentiment", "Content Terms"};
    Ad ad = AdRowProcessor.convertRowToAd(row);
  }

  @Test(expected = DateTimeParseException.class)
  public void endDateNotInIsostringFormat() {
    String badEndDate = "2018.11.06";
    String[] row = {"CR53959591413","FRIENDS OF SUZY GLOWIAK","2018-09-22",badEndDate,"≤ 10k",
            "Not targeted","Not targeted","Illinois, California","100","1000.0","The reasonable choice",
            "Ad suzyforsenate.com/about","Suzy Glowiak is the common-sense pick for the 24th.",
            "Headline Sentiment", "Headline Terms", "Content Sentiment", "Content Terms"};
    Ad ad = AdRowProcessor.convertRowToAd(row);
  }

  @Test
  public void ageTargeting() {
    String untargeted = "    Not Targeted  ";
    String[] firstRow = {"CR53959591413","FRIENDS OF SUZY GLOWIAK","2018-09-22","2018-10-01","≤ 10k",
            untargeted,"Not targeted","Illinois, California","100","1000.0",
            "The reasonable choice", "Ad suzyforsenate.com/about","Suzy Glowiak is the common-sense pick for the 24th.",
            "Headline Sentiment", "Headline Terms", "Content Sentiment", "Content Terms"};
    Ad ad1 = AdRowProcessor.convertRowToAd(firstRow);
    Assert.assertEquals(ad1.getIsTargetingAge(), false); 

    String targeted = " 18-48 ";
    String[] secondRow = {"CR53959591413","FRIENDS OF SUZY GLOWIAK","2018-09-22","2018-10-01","≤ 10k",
            targeted,"Not targeted","Illinois, California","100","1000.0",
            "The reasonable choice", "Ad suzyforsenate.com/about","Suzy Glowiak is the common-sense pick for the 24th.",
            "Headline Sentiment", "Headline Terms", "Content Sentiment", "Content Terms"};
    Ad ad2 = AdRowProcessor.convertRowToAd(secondRow);
    Assert.assertEquals(ad2.getIsTargetingAge(), true);   
  }

}