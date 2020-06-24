import csv
import urllib.request as urllib2
import time
import sys

from bs4 import BeautifulSoup
from selenium import webdriver

def createHeadlessChromeBrowser():
  options = webdriver.ChromeOptions()
  options.add_argument('headless')
  return webdriver.Chrome(options=options)

def main(file_number):
  file = open('data/shorten_' + file_number + '.csv')
  csv_file = csv.reader(file)
  browser = createHeadlessChromeBrowser()
  image_filename = "scraped_image.csv"

  delay = 3

  count = 1

  for row in csv_file:
    print('(' + row[2] + ') - row #' + str(count) + ':')
    count += 1
    if row[2] == "Image" and count >= 2:
      url = row[1]
      browser.get(url)
      browser.switch_to.default_content
      time.sleep(delay)
      html = browser.page_source
      soup = BeautifulSoup(html, features="lxml")

      result = [row[0]]
      
      img = soup.find('img', class_='ng-star-inserted')
      if img and img['src'].startswith('https://s0.2mdn.net/'):
        result.append(img['src'])
      
      iframe = soup.find("iframe")
      if iframe:
        browser.switch_to.frame(iframe["id"])
        time.sleep(delay)
        iframe_html = browser.page_source
        iframe_soup = BeautifulSoup(iframe_html, features="lxml")
        img = iframe_soup.find('img')
        if img:
          result.append(img['src'])
      
      if len(result) > 1:
        print(result)
        print('\n')
        with open(image_filename,'a') as csv_image:
          csvwriter = csv.writer(csv_image)
          csvwriter.writerow(result)

if __name__ == "__main__":
  file_number = sys.argv[1]
  main(file_number)