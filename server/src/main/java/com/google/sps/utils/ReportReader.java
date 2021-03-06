package com.google.sps.utils;
import com.google.sps.utils.Ad;
import com.google.sps.utils.AdRowProcessor;
import com.google.sps.utils.FirebaseAdWriter;
import java.io.FileReader;
import java.io.IOException;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.Reader;
import java.util.Arrays;
import java.util.List;
import java.util.Scanner;
import org.apache.commons.csv.CSVFormat;
import org.apache.commons.csv.CSVParser;
import org.apache.commons.csv.CSVRecord;

/* Description: ReportReader reads in lines of CSV data and sends them 
 *              to the processor.
 * Author: Kira Toal
 * Date: June 24, 2020
 */
public class ReportReader {

  private static final String CSV_FILE_PATH = "/output.csv";
  // NUMBER_CSV_HEADER_ROWS helps the parser know what rows to skip when reading the CSV.
  private static final int NUMBER_CSV_HEADER_ROWS = 2;
  private static String COLLECTION;
  private static int START_ROW_INDEX; // First row sent to processor (inclusive).
  private static int END_ROW_INDEX; // Last row sent to processor (inclusive).
  private static final String PATH_TO_SERVICE_ACCOUNT = "./serviceAccountKey.json"; 
  private static final String DATABASE_URL = "https://step9-2020-capstone.firebaseio.com"; 

  public static void readCSV(InputStream csv) throws Exception {
    CSVParser csvParser = CSVFormat.DEFAULT.parse(new InputStreamReader(csv));
    List<CSVRecord> csvRecordList = csvParser.getRecords();
    CSVRecord[] csvRecords = new CSVRecord[csvRecordList.size()];
    csvRecords = csvRecordList.toArray(csvRecords);
    int currentRowIndex = 0; 
    while (currentRowIndex <= END_ROW_INDEX + NUMBER_CSV_HEADER_ROWS) {
      if (currentRowIndex >= START_ROW_INDEX + NUMBER_CSV_HEADER_ROWS) {
        int currentRowSize = csvRecords[currentRowIndex].size(); 
        String[] currentRow = new String[currentRowSize];
        for (int i = 0; i < currentRowSize; i++) {
          currentRow[i] = csvRecords[currentRowIndex].get(i); 
        }
        
        // Try to process the ad. If the add throws an exception, skip the row.
        try {
          Ad ad = AdRowProcessor.convertRowToAd(currentRow);
          FirebaseAdWriter.writeAd(ad, COLLECTION, PATH_TO_SERVICE_ACCOUNT, DATABASE_URL);
        } catch(Exception e) {
          System.out.println("Exception at line: " + currentRowIndex + "\nRow: " + currentRow);
          e.printStackTrace();
        }
      }
      currentRowIndex++;
    }
  }

  public static void main(String[] args) throws IOException, Exception {
    InputStream inputStream = ReportReader.class.getResourceAsStream(CSV_FILE_PATH);
    
    // Get collection and number of ads from user.
    Scanner scanner = new Scanner(System.in);
    System.out.print("Collection to write to: ");
    COLLECTION = scanner.nextLine().trim();
    System.out.print("First row to read (inclusive): ");
    START_ROW_INDEX = scanner.nextInt();  
    System.out.print("Last row to read (inclusive): ");
    END_ROW_INDEX = scanner.nextInt();

    // Read each row of the CSV.
    readCSV(inputStream);
  }
}
