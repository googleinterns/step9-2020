import './SentimentAnalysis.css';

import { AnalysisInput, ColorBar, INPUT_LIST, TermsDisplay } from './Helpers';

import React from 'react';
import tardigrade from '../../images/tardigrade.png';

const mockContentTerms = [
  '{"name": "Donald Trump", "type": "PERSON", "salience": 0.61}',
  '{"name": "Georgia", "type": "LOCATION", "salience": 0.2}',
  '{"name": "re-election", "type": "EVENT", "salience": 0.1}',
  '{"name": "help", "type": "OTHER", "salience": 0.08}',
  '{"name": "Chip", "type": "PERSON", "salience": 0.01}',
  '{"name": "2020", "type": "DATE", "salience": 0.0}',
  '{"name": "$5", "type": "PRICE", "salience": 0.0}',
  '{"name": "2020", "type": "NUMBER", "salience": 0.0}',
  '{"name": "5", "type": "NUMBER", "salience": 0.0}',
];

const mockHeaderTerms = [
  '{"name": "Georgia", "type": "LOCATION", "salience": 0.9}',
  '{"name": "Make America Great Again", "type": "OTHER", "salience": 0.1}',
  '{"name": "2020", "type": "DATE", "salience": 0.0}',
  '{"name": "2020", "type": "NUMBER", "salience": 0.0}',
];

const SentimentAnalysis = () => (
  <div className="search-container">
    <div className="search-header center">
      <img src={tardigrade} className="logo" alt="logo" />
      <div className="center">
        {INPUT_LIST.map((input, index) => (
          <AnalysisInput
            key={index}
            label={input.label}
            placeholder={input.placeholder}
          />
        ))}
      </div>
      <button className="analysis-button">Analyze</button>
    </div>
    <div className="analysis-result-container center">
      <div className="analysis-card center">
        <h4>Header Analysis</h4>
        <ColorBar score={0.4} magnitude={0.7} />
        <TermsDisplay termList={mockHeaderTerms} />
      </div>
      <div className="analysis-card center">
        <h4>Content Analysis</h4>
        <ColorBar score={-0.1} magnitude={0.2} />
        <TermsDisplay termList={mockContentTerms} />
      </div>
    </div>
  </div>
);

export default SentimentAnalysis;
