/* Description: ReportReader reads in lines of CSV data and sends them 
 *              to the processor. 
 * Author: Kira Toal
 * Date: June 24, 2020
 */
package com.google.sps.utils;

import com.google.sps.utils.Ad;
import com.google.sps.utils.AdRowProcessor;
import com.google.sps.utils.WriteAd;
import java.io.BufferedReader;
import java.io.FileReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;

public class ReportReader {

  private static final String CSV_FILE_PATH = "/output.csv";
  private static final String COLLECTION = "testing"; 
  private static final int START_ROW_INDEX = 1;  // first csv row that gets read in to DB (1 based)
  private static final int END_ROW_INDEX = 4; // last csv row (exclusive)
  private static final String PATH_TO_SERVICE_ACCOUNT = "./serviceAccountKey.json"; 
  private static final String DATABASE_URL = "https://step9-2020-capstone.firebaseio.com"; 

  public static void readCSV(InputStream csvFile) throws Exception {
    BufferedReader bufferedReader = new BufferedReader(new InputStreamReader(csvFile));      
    String[] currentRow = {}; // array stores single row of CSV data (one advertisement)
    
    // read header rows separately
    String primaryHeader = bufferedReader.readLine();
    String secondaryHeader = bufferedReader.readLine();
    int rowIndex = START_ROW_INDEX; 
    String row = ""; 
    while((row = bufferedReader.readLine()) != null && (rowIndex < END_ROW_INDEX)) {
      /* Regex splits the row into a String array by columns (columns are indicated in 
      the csv by commas.) It ignores commas inside quotation marks to avoid spliting 
      individual text fields (the text field "North Carolina, Florida" is not split 
      into two different Strings). 
      */
      currentRow = row.split(",(?=(?:[^\"]*\"[^\"]*\")*[^\"]*$)", -1); 
      for (int currentColumn = 0; currentColumn < currentRow.length; currentColumn++) {
        currentRow[currentColumn] = currentRow[currentColumn].replace("\"", ""); // remove extra quotes
      }
      
      // process the row
      if (rowIndex >= START_ROW_INDEX) {
        Ad ad = AdRowProcessor.createAd(currentRow);
        WriteAd.writeAd(ad, COLLECTION, PATH_TO_SERVICE_ACCOUNT, DATABASE_URL); 
        // AdRowProcessor processor = new AdRowProcessor(currentRow);
        // Ad ad = processor.createAd(); 
        // processor.writeAd(ad, rowIndex, COLLECTION); 
      }
      rowIndex++;  
    }
    bufferedReader.close();
  }

  public static void main(String[] args) throws IOException, Exception {
    InputStream inputStream = ReportReader.class.getResourceAsStream(CSV_FILE_PATH);
    readCSV(inputStream);
  } 
}