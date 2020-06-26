/* 
 * Description: File for building a POJO from a row of CSV data
 * Author: Kira Toal
 * Date: June 24, 2020
 */ 
import java.time.LocalDate; 
import java.util.regex.Matcher;
import java.util.regex.Pattern;

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


}