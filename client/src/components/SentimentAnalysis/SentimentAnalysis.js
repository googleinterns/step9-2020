import './SentimentAnalysis.css';

import { AnalysisInput, ColorBar, TermsDisplay } from './Helpers';
import React, { useState } from 'react';

import { CLIENT_KEY } from '../../constants/capcha_config';
import { INPUT_LIST } from '../../constants/analysis_constants';
import ReCAPTCHA from 'react-google-recaptcha';
import tardigrade from '../../images/tardigrade.png';

const DEFAULT_ANALYSIS = {
  entities: [],
  sentiment: { score: 0.0, magnitude: 0.0 },
};

const SentimentAnalysis = props => {
  const locationState = props.location.state;
  const [isVerified, setIsVerified] = useState(false);
  const [header, setHeader] = useState(
    locationState !== undefined
      ? locationState.ad.headlineAnalysis
      : DEFAULT_ANALYSIS
  );

  const [content, setContent] = useState(
    locationState !== undefined
      ? locationState.ad.contentAnalysis
      : DEFAULT_ANALYSIS
  );

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

  const handleInputValue = label => {
    if (locationState !== undefined) {
      const { headline, content } = locationState.ad;
      if (label === "headline") {
        return headline;
      } else {
        return content;
      }
    } else {
      return "";
    }
  }

  return (
    <div className="search-container">
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
              value={handleInputValue(input.label)}
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
