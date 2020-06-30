/*
 * Description: File for reading in rows of CSV data
 * Author: Kira Toal
 * Date: June 24, 2020
 */
package com.google.sps.utils;
import java.io.*;
import java.io.BufferedReader;
import java.io.FileReader;
import java.io.IOException;
import org.apache.commons.io.IOUtils;

import com.google.sps.utils.AdRowProcessor; 
import com.google.sps.utils.Ad; 

public class ReportReader {

  private static final String CSV_FILE_PATH = "/output.csv";

  public static void readCSV(InputStream csvFile) throws Exception {
    try {    
      BufferedReader bufferedReader = new BufferedReader(new InputStreamReader(csvFile));      
      String[] currentRow = {}; // array stores single row of CSV data (one advertisement)
      // read header rows separately
      String primaryHeader = bufferedReader.readLine();
      String secondaryHeader = bufferedReader.readLine();
      // read rows and split into array by column
      int rowIndex = 1; 
      String row = ""; 
      // TODO: make for all (remove && row index)
      while((row = bufferedReader.readLine()) != null && (rowIndex < 3)) {
        currentRow = row.split(",(?=(?:[^\"]*\"[^\"]*\")*[^\"]*$)", -1); 
        for (int currentColumn = 0; currentColumn < currentRow.length; currentColumn++) {
          currentRow[currentColumn] = currentRow[currentColumn].replace("\"", ""); // remove extra quotes
        }
        // process the row
        System.out.println("\nReading row #" + rowIndex + " ...\n"); 
        AdRowProcessor processor = new AdRowProcessor(currentRow);
        Ad ad = processor.createAdPojo(); 
        processor.addAdToDatabase(ad, rowIndex); 
        rowIndex++;  
      }
      bufferedReader.close();
    } catch(IOException e) {
      e.printStackTrace();
    }
  }

  public static void main(String[] args) throws IOException,Exception {
    System.out.println("I AM RUNNING");
    // InputStream inputStream = getClass().getResourceAsStream("/output.csv");
    InputStream inputStream = ReportReader.class.getResourceAsStream(CSV_FILE_PATH);
    // String content = IOUtils.toString(inputStream);
    readCSV(inputStream);
  }
  
}