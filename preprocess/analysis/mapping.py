import csv

from language_analysis import analyze_entities, analyze_sentiment

def get_analysis(text):
  return {
    'sentiment': analyze_sentiment(text),
    'entities': analyze_entities(text)
  }

file = open('input.csv')

csv_file = csv.reader(file)

count = 1

existed = dict()

for row in csv_file:
  print(count)
  if count > 36730:
    analysis_info = []
    if count == 1:
      row.extend(['Headline_Sentiment', 'Headline_Entities', 'Content_Sentiment', 'Content_Entities'])
    else:
      headlineAndContent = [row[len(row) - 3], row[len(row) - 1]]
      for text in headlineAndContent:
        if text in existed:
          analysis_info.append(existed[text].get('sentiment'))
          analysis_info.append(existed[text].get('entities'))
        else:
          new_dict = get_analysis(text)
          analysis_info.append(new_dict.get('sentiment'))
          analysis_info.append(new_dict.get('entities'))
          existed[text] = new_dict

      row.extend(analysis_info)
  
    with open('output.csv','a') as csv_text:
      csvwriter = csv.writer(csv_text)
      csvwriter.writerow(row)
      print(analysis_info)
      print('\n')
  count+=1
