/*
 * Description: File for reading in rows of CSV data
 * Author: Kira Toal
 * Date: June 24, 2020
 */
import java.io.*;
import java.io.BufferedReader;
import java.io.FileReader;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

public class ReportReader {
  /* 
   * Reads every row of the CSV into a string array then returns list of row arrays. 
   */
  public static List<String[]> readCSV(String csvFile) {
    List<String[]> allAds = new ArrayList<String[]>();
    try {    
      FileReader fileReader = new FileReader(new File(csvFile));
      BufferedReader bufferedReader = new BufferedReader(fileReader); // wraps file reader
      String row = "";
      String[] singleAd = {}; // array stores single row of CSV data (one advertisement)
      while((row = bufferedReader.readLine()) != null) {
        singleAd = row.split(",(?=(?:[^\"]*\"[^\"]*\")*[^\"]*$)", -1); // split by CSV column
        for (int i = 0; i < singleAd.length; i++) {
          singleAd[i] = singleAd[i].replace("\"", ""); 
        }
        allAds.add(singleAd); // add ad array to aggregate list 
      }
      bufferedReader.close();
    } catch(IOException e) {
      e.printStackTrace();
    }
    return allAds; 
  }

}