/* 
 * Description: File for building a POJO from a row of CSV data
 * Author: Kira Toal
 * Date: June 24, 2020
 */ 
import java.time.LocalDate; 

public class AdRowProcessor {

  private String[] row; 

  public AdRowProcessor(String[] csvRow) {
    this.row = csvRow; 
  }

  public void createAdPojo() {
    Ad ad = new Ad.AdBuilder()
      .id(row[0])
      .advertiser(row[1])
      .startDate(LocalDate.parse(row[2])) 
      .endDate(LocalDate.parse(row[3]))
      .impressionsMin(getImpressionsMin(row[4]))
      .impressionsMax(getImpressionsMax(row[4]))
      .ageTargetingEnabled(isAgeTargetingEnabled(row[5]))
      .genderTarget(getArray(row[6]))
      .geoTarget(getArray(row[7]))
      .spendMin(getLong(row[8]))
      .spendMax(getLong(row[9]))
      .headline(row[10].trim())
      .link(row[11].substring(3)) // trim "Ad" from "Ad {URL}"
      .content(row[12].trim())
      .headlineSentiment(row[13].trim())
      .headlineTerms(row[14].trim())
      .contentSentiment(row[15].trim())
      .contentTerms(row[16].trim())
      .build(); 
    System.out.println(ad.toString());
  }

  public long getImpressionsMin(String str) {
    String s = str.replace("k", "000").replace("M", "000000").replace(" ","").replace("\u2264", "");
    String[] arr = s.split("-");
    if (arr.length > 1) {
        return Long.parseLong(arr[0]); 
    }
    return 0;    
  }

  public long getImpressionsMax(String str) {
    String s = str.replace("k", "000").replace("M", "000000").replace(" ","").replace("\u2264", "");
    String[] arr = s.split("-");
    return Long.parseLong(arr[arr.length - 1]);   
  }

  public boolean isAgeTargetingEnabled(String str) {
    if (str.trim().equals("Not targeted")) {
      return false; 
    }
    return true; 
  }

  public String[] getArray(String str) {
    return str.trim().split(","); 
  }

  public long getLong(String value) {
    return (long)Double.parseDouble(value); 
  }
}