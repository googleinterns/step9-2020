/* 
 * Description: File for building a POJO from a row of CSV data
 * Author: Kira Toal
 * Date: June 24, 2020
 */ 

import java.util.Arrays;
import java.util.List;

public class RowProcessor {
  
  private static final String CSV_FILE_PATH = "./data/output4.csv";

  public static void main(String[] args) {

    List<String[]> allAds = ReportReader.readCSV(CSV_FILE_PATH); // read in the CSV
    for (int i = 0; i < allAds.size(); i++) {
      //make a POJO
      //make an entity w/ AdAdapter 
      //send entity to firestore 
    }
    // allAds.forEach(array -> System.out.println(Arrays.toString(array)));
  }

}