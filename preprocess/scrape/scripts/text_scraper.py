import csv
import sys
import time
import urllib.request as urllib2

from bs4 import BeautifulSoup
from selenium import webdriver


def createHeadlessChromeBrowser():
  options = webdriver.ChromeOptions()
  options.add_argument('headless')
  return webdriver.Chrome(options=options)

def main(file_number):
  file = open('data2/shorten_' + file_number + '.csv')
  csv_file = csv.reader(file)
  browser = createHeadlessChromeBrowser()

  text_fields = ['Ad ID', 'Headline', 'Link', 'Content']  
  text_filename = "extra_scraped_text.csv"

  image_fields = ['Ad ID', 'URL']  
  image_filename = "scraped_image.csv"

  with open(text_filename, 'w') as csvfile:  
    csvwriter = csv.writer(csvfile)  
    csvwriter.writerow(text_fields)  

  # with open(image_filename, 'w') as csvfile:  
  #   csvwriter = csv.writer(csvfile)  
  #   csvwriter.writerow(image_fields)

  delay = 3
  count = 1

  for row in csv_file:
    print('(' + row[2] + ') - row #' + str(count) + ':')
    if row[2] == 'Text':
      url = row[1]
      browser.get(url)
      browser.switch_to.default_content
      time.sleep(delay)
      html = browser.page_source
      soup = BeautifulSoup(html, features="lxml")
      
      ad_div = soup.find('div', class_="ad-container full ng-star-inserted")
      if ad_div:
        content = [row[0]]
        for div in ad_div.find_all("div"):
          if (div.text != "Ad"):
            content.append(div.text)
        print(content)
        print('\n')
        with open(text_filename,'a') as csv_text:
          csvwriter = csv.writer(csv_text)
          csvwriter.writerow(content)
    count += 1


if __name__ == "__main__":
  file_number = sys.argv[1]
  main(file_number)
