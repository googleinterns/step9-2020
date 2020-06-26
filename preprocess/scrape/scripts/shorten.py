import csv
import sys

def split(a, n):
  k, m = divmod(len(a), n)
  return (a[i * k + min(i, m):(i + 1) * k + min(i + 1, m)] for i in range(n))

def write_in_batches(data_list, number_of_files):
  splitted_data = list(split(data_list, number_of_files))
  headers = ['Ad_ID', 'Ad_URL', 'Ad_Type']
  count = 0

  for batch in splitted_data:
    count += 1
    with open('data2/shorten_' + str(count) + '.csv', 'w') as csvfile:  
      csvwriter = csv.writer(csvfile) 
      csvwriter.writerow(headers) 
      for result in batch:
        csvwriter.writerow([result[0], result[1], result[2]])

def write_in_single_file(data_list):
  headers = {
    0: 'Ad_ID', 5: 'Advertiser_Name', 7: 'Date_Range_Start', 
    8: 'Date_Range_End', 10: 'Impressions', 14: 'Age_Targeting', 15: 'Gender_Targeting', 
    16: 'Geo_Targeting', 18: 'Spend_Range_Min_USD', 19: 'Spend_Range_Max_USD'
  }

  with open('shortened_text_only.csv', 'w') as csvfile:  
    csvwriter = csv.writer(csvfile) 
    csvwriter.writerow(headers.values()) 
    for row in data_list:
      content = []
      for index in headers:
        content.append(row[index])
      csvwriter.writerow(content)

def main(write_type):
  file = open('google-political-ads-creative-stats.csv')
  # file = open('data.csv')
  csv_file = csv.reader(file)
  results = filter(lambda row: (row[2] == 'Text' and row[3] == 'US'), csv_file)
  data_list = list(results)

  if write_type == 'batch':
    write_in_batches(data_list, 10)
  elif write_type == 'single':
    write_in_single_file(data_list)

if __name__ == "__main__":
  write_type = sys.argv[1]
  main(write_type)
  


        