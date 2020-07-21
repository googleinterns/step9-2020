import React from 'react';
import Search from '../components/Search/Search';
import SentimentAnalysis from '../components/SentimentAnalysis/SentimentAnalysis';
import Visualization from '../components/Visualization/Visualization';

const HEADERS = ['Ads Search', 'Data Visualization', 'Sentiment Analysis'];

const PAGE_MAP = {
  'Ads Search': <Search />,
  'Data Visualization': <Visualization />,
  'Sentiment Analysis': <SentimentAnalysis />,
};

export { HEADERS, PAGE_MAP };