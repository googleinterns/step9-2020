import './SentimentAnalysis.css';

import { AnalysisInput, ColorBar, TermsDisplay } from './Helpers';
import React, { useState } from 'react';

import { CLIENT_KEY } from '../../constants/capcha_config';
import { INPUT_LIST } from '../../constants/analysis_constants';
import ReCAPTCHA from 'react-google-recaptcha';
import tardigrade from '../../images/tardigrade.png';

const SentimentAnalysis = () => {
  const [isVerified, setIsVerified] = useState(false);
  const [header, setHeader] = useState({
    entities: [],
    sentiment: { score: 0.0, magnitude: 0.0 },
  });

  const [content, setContent] = useState({
    entities: [],
    sentiment: { score: 0.0, magnitude: 0.0 },
  });

  const onChange = value => {
    setIsVerified(value !== null);
  };

  const submitForm = event => {
    event.preventDefault();
    const form = new FormData(event.target);
    const url = 'https://analysis-dot-step9-2020-capstone.appspot.com/analysis';

    fetch(url, { method: 'POST', body: form })
      .then(response => response.json())
      .then(data => {
        const headerEntities = data.header_entities;
        const headerSentiment = JSON.parse(data.header_sentiment);
        setHeader({ entities: headerEntities, sentiment: headerSentiment });

        const contentEntities = data.content_entities;
        const contentSentiment = JSON.parse(data.content_sentiment);
        setContent({ entities: contentEntities, sentiment: contentSentiment });
      });
  };

  return (
    <div className="search-container">
      <h3 className="filter-header">⤓ DOWNLOAD</h3>
      <form
        className="search-header center bottom-padding"
        onSubmit={submitForm}
      >
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
      </form>
      <div className="analysis-result-container center">
        <div className="analysis-card center">
          <h4>Header Analysis</h4>
          <ColorBar
            score={header.sentiment.score}
            magnitude={header.sentiment.magnitude}
          />
          <TermsDisplay termList={header.entities} />
        </div>
        <div className="analysis-card center">
          <h4>Content Analysis</h4>
          <ColorBar
            score={content.sentiment.score}
            magnitude={content.sentiment.magnitude}
          />
          <TermsDisplay termList={content.entities} />
        </div>
      </div>
    </div>
  );
};

export default SentimentAnalysis;
