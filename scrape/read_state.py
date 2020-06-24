import csv

import requests

url = "http://api.zippopotam.us/us/"

file = open('output.csv')
csv_file = csv.reader(file)

count = 1

class RangeDict(dict):
  def __getitem__(self, item):
    if not isinstance(item, range): # or xrange in Python 2
      for key in self:
        if item in key:
          return self[key]
      raise KeyError(item)
    else:
      return super().__getitem__(item) # or super(RangeDict, self) for Python 2

zip_codes = RangeDict({
  range(35801, 35816): 'Alabama',
  range(99501, 99524): 'Alaska',
  range(85001, 85055): 'Arizona',
  range(72201, 72217): 'Arkansas',
  range(94203, 94209): 'California',
  range(90001, 90089): 'California',
  range(90209, 90213): 'California',
  range(80201, 80239): 'Colorado',
  range( 6101,  6112): 'Conneticut',
  range(19901, 19905): 'Deleware',
  range(20001, 20020): 'District of Columbia',
  range(32501, 32509): 'Florida',
  range(33124, 33190): 'Florida',
  range(32801, 32837): 'Florida',
  range(30301, 30381): 'Georgia',
  range(96801, 96830): 'Hawaii',
  range(83254, 83254): 'Idaho',
  range(60601, 60641): 'Illinois',
  range(62701, 62709): 'Illinois',
  range(46201, 46209): 'Indiana',
  range(52801, 52809): 'Iowa',
  range(50301, 50323): 'Iowa',
  range(67201, 67221): 'Kansas',
  range(41701, 41702): 'Kentucky',
  range(70112, 70119): 'Lousiana',
  range(4032, 4034): 'Maine',
  range(21201, 21237): 'Maryland',
  range(2101, 2137): 'Massachusetts',
  range(49036, 49036): 'Michigan',
  range(49734 - 49735): 'Michigan',
  range(55801, 55808): 'Minnesota',
  range(39530, 39535): 'Mississippo',
  range(63101, 63141): 'Missouri',
  range(59044, 59044): 'Montana',
  range(68901 - 68902): 'Nebraska',
  range(89501, 89513): 'Nevada',
  range(3217, 3217): 'New Hampshire',
  range(7039, 7039): 'New Jersey',
  range(87500, 87506): 'New Mexico',
  range(10001, 10048): 'New York',
  range(27565, 27565): 'North Carolina',
  range(58282, 58282): 'North Dakota',
  range(44101, 44179): 'Ohio',
  range(74101, 74110): 'Oklahoma',
  range(97201, 97225): 'Oregon',
  range(15201, 15244): 'Pennsylvania',
  range(2840, 2841): 'Rhode Island',
  range(29020, 29020): 'South Carolina',
  range(57401, 57402): 'South Dakota',
  range(37201, 37222): 'Tennessee',
  range(78701, 78705): 'Texas',
  range(84321, 84323): 'Utah',
  range(5751, 5751): 'Vermont',
  range(24517, 24517): 'Virginia',
  range(98004, 98009): 'Washington',
  range(25813, 25813): 'West Virginia',
  range(53201, 53228): 'Wisconsin',
  range(82941, 82941): 'Wyoming',
})

print(int('02101'))
print(len(zip_codes))


# count = 1

for row in csv_file:
  print(count)
  if count > 12247:
    if (str(row[7])[:4]).isdigit():
      codes = row[7].split(', ')
      result_set = set()
      for code in codes:
        result = ''
        try:
          result = zip_codes[int(code)]
        except:
          r = requests.get(url = (url + code)) 
          data = r.json()
          if data:
            result = data.get("places")[0].get("state")
        finally:
          result_set.add(result)
      result_row = ', '.join(result_set)
      print(result_row)
      row[7] = result_row

    with open('output2.csv', 'a') as csvfile:  
      csvwriter = csv.writer(csvfile) 
      csvwriter.writerow(row)
  count+=1