<!-- PROJECT LOGO -->
<br />
<p align="center">
<img src="./client/src/images/tardigrade.png" width="250" height="200">
<h3 align="center"> Political Tardigrade </h3>
<p align="justify">
Welcome to Political Tardigrade — a web app developed by three Google STEP interns over the course of approximately five weeks in the summer of 2020. The   mission of Political Tardigrade is to compile and highlight overarching trends in America’s political ad space for students, researchers, and advertisers. By making such data more accessible and easy to analyze, this webapp aims to promote sociopolitical awareness. 
</p>
~~Live link: https://step9-2020-capstone.uc.r.appspot.com/~~ This site is no longer live. 

<!-- TABLE OF CONTENTS -->
## Table of Contents

* [About the Project](#about-the-project)
  * [Background](#background)
  * [Team](#team)
  * [Built With](#built-with)
* [Getting Started](#getting-started)
  * [Prerequisites](#prerequisites)
  * [Installation](#installation)
* [Usage/demo](#usage)
* [Roadmap](#roadmap)
* [License](#license)

<!-- ABOUT THE PROJECT -->
## About The Project

### Background

The [Google Transparency Report](https://transparencyreport.google.com/political-ads/home?hl=en) is a comprehensive, open source library of political advertisements hosted on Google services since May of 2018. Political Tardigrade is committed to presenting data from this library, which represents nearly 310 million dollars in cumulative ad spend, in an informative and interactive format — with tools that enable our users to find, visualize, and perform analysis on advertisements.

### Team

- Kira Toal (kirakira0), Google STEP Intern
- Robert Marcus (rob-marcus), Google STEP Intern
- Scarlet Nguyen (scarletnguyen13), Google STEP Intern 

The development of Political Tardigrade has been overseen by Google software engineers and STEP intern hosts Andrew Latham and Aileme Omogbai.

### Built With

* [React](https://reactjs.org/)
* [Firebase/firestore](https://firebase.google.com/docs/firestore)
* [Cloud functions](https://cloud.google.com/functions/?utm_source=google&utm_medium=cpc&utm_campaign=na-US-all-en-dr-skws-all-all-trial-b-dr-1009135&utm_content=text-ad-none-any-DEV_c-CRE_311510854038-ADGP_Hybrid+%7C+AW+SEM+%7C+SKWS+%7C+US+%7C+en+%7C+BMM+~+Compute+~+Cloud+Functions+~+cloud+function-KWID_43700044772532459-kwd-140174300228&utm_term=KW_%2Bcloud%20%2Bfunction-ST_%2Bcloud+%2Bfunction&gclid=EAIaIQobChMI6MfnuY2K6wIVysDACh0nDQ6SEAAYASAAEgLsTvD_BwE)
* [Algolia](https://www.algolia.com/)
* [Google Natural Language API](https://cloud.google.com/natural-language)
* [Victory JS](https://formidable.com/open-source/victory/)

Data is from
* [Google Transparency report](https://transparencyreport.google.com/political-ads/home?hl=en)
* With additional analysis by the team. 

<!-- GETTING STARTED -->
## Getting Started

To get a local copy up and running follow these simple steps.

### Installation
 
1. Clone the repo
```sh
git clone https://github.com/github_username/repo.git
```
2. Install NPM packages
```sh
npm install
```

<!-- USAGE EXAMPLES -->
## Usage
The webapp is split into three main pages: search, data visualization, and language analysis. 
![splash page](https://github.com/googleinterns/step9-2020/blob/master/readme_files/Screen%20Shot%202020-08-07%20at%206.25.17%20PM.png)
Ever wonder how many candidates like to flex their wrestling prowess? Just search for it!
![wrestling search result with filter](https://github.com/googleinterns/step9-2020/blob/master/readme_files/Screen%20Shot%202020-08-07%20at%206.31.33%20PM.png)
You can also generate word clouds of search results to see what the overall language looks like. 
![word cloud sample](https://github.com/googleinterns/step9-2020/blob/master/readme_files/Screen%20Shot%202020-08-07%20at%206.33.59%20PM.png)
For data visualization, we built two charts as a proof of concept that we could do fast, interactive visualizations on large parts of our data set. We have a scatter plot that shows top advertisers across time, and a geochart that shows top advertiser in each state by spend and overall ad money spent in each state.
![scatterplot](https://github.com/googleinterns/step9-2020/blob/master/readme_files/image.gif)
![geochart](https://github.com/googleinterns/step9-2020/blob/master/readme_files/Screen%20Shot%202020-08-07%20at%206.28.31%20PM.png)

Users also have the ability to analyze ads for sentiment, or input their own ads for analysis. We also return ads with similar sentiment. They can also share and download these results.
![sentiment analysis](https://github.com/googleinterns/step9-2020/blob/master/readme_files/sentimentAnalysis.png)
![similar ads by sentiment analysis](https://github.com/googleinterns/step9-2020/blob/master/readme_files/similarAdsSentimentAnalysis.png)
