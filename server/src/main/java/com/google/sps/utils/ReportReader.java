/*
 * Description: File for reading in rows of CSV data
 * Author: Kira Toal
 * Date: June 24, 2020
 */
package com.google.sps.utils;

import com.google.sps.utils.Ad;
import com.google.sps.utils.AdRowProcessor;
import java.io.*;
import java.io.BufferedReader;
import java.io.FileReader;
import java.io.IOException;
import org.apache.commons.io.IOUtils; 

public class ReportReader {

  private static final String CSV_FILE_PATH = "/output.csv";
  private static final String COLLECTION = "testing"; 
  private static final int START_ROW_INDEX = 1;  // first csv row that gets read in to DB (1 based)
  private static final int END_ROW_INDEX = 3; // last csv row (exclusive)

  public static void readCSV(InputStream csvFile) throws Exception {
    try {    
      BufferedReader bufferedReader = new BufferedReader(new InputStreamReader(csvFile));      
      String[] currentRow = {}; // array stores single row of CSV data (one advertisement)
      // read header rows separately
      String primaryHeader = bufferedReader.readLine();
      String secondaryHeader = bufferedReader.readLine();
      int rowIndex = 1; 
      String row = ""; 
      while((row = bufferedReader.readLine()) != null && (rowIndex < END_ROW_INDEX)) {
        currentRow = row.split(",(?=(?:[^\"]*\"[^\"]*\")*[^\"]*$)", -1); 
        for (int currentColumn = 0; currentColumn < currentRow.length; currentColumn++) {
          currentRow[currentColumn] = currentRow[currentColumn].replace("\"", ""); // remove extra quotes
        }
        // process the row
        if (rowIndex >= START_ROW_INDEX) {
          System.out.println("\nReading row #" + rowIndex + " ...\n"); 
          AdRowProcessor processor = new AdRowProcessor(currentRow);
          Ad ad = processor.createAd(); 
          processor.addAdToDatabase(ad, rowIndex, COLLECTION); 
        }
        rowIndex++;  
      }
      bufferedReader.close();
    } catch(IOException e) {
      e.printStackTrace();
    }
  }

  public static void main(String[] args) throws IOException,Exception {
    InputStream inputStream = ReportReader.class.getResourceAsStream(CSV_FILE_PATH);
    readCSV(inputStream);
  } 
}