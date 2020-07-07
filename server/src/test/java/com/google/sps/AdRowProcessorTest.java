package com.google.sps;

import com.google.sps.utils.Ad;
import com.google.sps.utils.AdRowProcessor;

import org.junit.Assert;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.junit.runners.JUnit4;

/*
 * 
 */
@RunWith(JUnit4.class)
public final class AdRowProcessorTest {
  @Test
  public void equality() {
    String[] row = {"CR53959591413","FRIENDS OF SUZY GLOWIAK","2018-09-22","2018-11-06","≤ 10k",
            "Not targeted","Not targeted","Illinois","100","1000.0","The reasonable choice",
            "Ad suzyforsenate.com/about","Suzy Glowiak is the common-sense pick for the 24th.",
            "Headline Sentiment", "Headline Terms", "Content Sentiment", "Content Terms"};
    Ad ad = AdRowProcessor.convertRowToAd(row);
    
    Assert.assertEquals(ad.getId(), "CR53959591413");
    Assert.assertEquals(ad.getId(), "CR53959591413");
   
  }

}