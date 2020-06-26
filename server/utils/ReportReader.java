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

  private static final String CSV_FILE_PATH = "./data/output.csv";

  public static void readCSV(String csvFile) {
    try {    
      // set up readers 
      FileReader fileReader = new FileReader(new File(csvFile));
      BufferedReader bufferedReader = new BufferedReader(fileReader);      
      String[] currentRow = {}; // array stores single row of CSV data (one advertisement)
      // read header rows separately
      String primaryHeader = bufferedReader.readLine();
      String secondaryHeader = bufferedReader.readLine();
      // read rows and split into array by column
      int rowIndex = 1; 
      String row = ""; 
      while((row = bufferedReader.readLine()) != null && (rowIndex < 3)) {
        currentRow = row.split(",(?=(?:[^\"]*\"[^\"]*\")*[^\"]*$)", -1); 
        for (int currentColumn = 0; currentColumn < currentRow.length; currentColumn++) {
          currentRow[currentColumn] = currentRow[currentColumn].replace("\"", ""); // remove extra quotes
        }
        // process the row
        System.out.println("\nReading row #" + rowIndex + " ...\n"); 
        AdRowProcessor processor = new AdRowProcessor(currentRow);
        processor.createAdPojo();  
        rowIndex++;  
      }
      bufferedReader.close();
    } catch(IOException e) {
      e.printStackTrace();
    }
  }

  public static void main(String[] args) {
    readCSV(CSV_FILE_PATH);
  }

}