/* 
 * Description: File for building a POJO from a row of CSV data
 * Author: Kira Toal
 * Date: June 24, 2020
 */ 
import java.util.Arrays;
import java.util.Date;
import java.text.DateFormat;  
import java.text.SimpleDateFormat; 
import java.util.List;

public class AdRowProcessor {

  private String[] row; 

  public AdRowProcessor(String[] csvRow) {
    this.row = csvRow; 
  }

  public void createAdPojo() {
    // System.out.println(Arrays.toString(row)); 
    Ad ad1 = new Ad.AdBuilder()
      .id(row[0])
      .advertiser(row[1])
      .startDate(new Date(2019, 8, 19))
      .build(); 
    System.out.println(ad1.toString());
  }

  public Date stringToDate(String date) {
    String[] dateArr= date.split("-"); 
    for (int i = 0; i < dateArr.length; i++) {
      dateArr[i] = dateArr[i].replace("-", "");
    }
    return new Date(2019, 8, 19); 
  }

}