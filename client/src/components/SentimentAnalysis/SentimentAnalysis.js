import './SentimentAnalysis.css';

import { AnalysisInput, INPUT_LIST } from './AnalysisInput';

import React from 'react';
import tardigrade from '../../images/tardigrade.png';

const SentimentAnalysis = () => (
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
);

export default SentimentAnalysis;
