import './SentimentAnalysis.css';

import { AnalysisInput, ColorBar, TermsDisplay } from './Helpers';
import { INPUT_LIST, MOCK_DATA } from '../../constants/analysis_constants';
import React, { useState } from 'react';

import { CLIENT_KEY } from '../../constants/capcha_config';
import ReCAPTCHA from 'react-google-recaptcha';
import tardigrade from '../../images/tardigrade.png';

const SentimentAnalysis = () => {
  const [isVerified, setIsVerified] = useState(false);

  const onChange = value => {
    setIsVerified(value !== null);
  };

  const {
    mockContentTerms,
    mockHeaderTerms,
    mockHeaderScore,
    mockHeaderMagnitude,
    mockContentScore,
    mockContentMagnitude,
  } = MOCK_DATA;

  return (
    <div className="search-container">
      <div className="search-header center bottom-padding">
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
        {isVerified ? (
          <button className="analysis-button">Analyze</button>
        ) : (
          <ReCAPTCHA sitekey={CLIENT_KEY} onChange={onChange} />
        )}
      </div>
      <div className="analysis-result-container center">
        <div className="analysis-card center">
          <h4>Header Analysis</h4>
          <ColorBar score={mockHeaderScore} magnitude={mockHeaderMagnitude} />
          <TermsDisplay termList={mockHeaderTerms} />
        </div>
        <div className="analysis-card center">
          <h4>Content Analysis</h4>
          <ColorBar score={mockContentScore} magnitude={mockContentMagnitude} />
          <TermsDisplay termList={mockContentTerms} />
        </div>
      </div>
    </div>
  );
};

export default SentimentAnalysis;
