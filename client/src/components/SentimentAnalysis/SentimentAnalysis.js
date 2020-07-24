import './SentimentAnalysis.css';

import { AnalysisInput, ColorBar, TermsDisplay } from './Helpers';
import {
  DEFAULT_ANALYSIS,
  INPUT_LIST,
} from '../../constants/analysis_constants';
import React, { useState } from 'react';

import { CLIENT_KEY } from '../../constants/capcha_config';
import PropTypes from 'prop-types';
import ReCAPTCHA from 'react-google-recaptcha';
import tardigrade from '../../images/tardigrade.png';

const SentimentAnalysis = props => {
  const locationState = props.location.state;
  const ad = locationState !== undefined ? locationState.ad : DEFAULT_ANALYSIS;

  const [isVerified, setIsVerified] = useState(false);
  const [headline, setHeadline] = useState(ad.headlineAnalysis);
  const [content, setContent] = useState(ad.contentAnalysis);

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
        const headlineEntities = data.headline_entities;
        const headlineSentiment = JSON.parse(data.headline_sentiment);
        setHeadline({
          entities: headlineEntities,
          sentiment: headlineSentiment,
        });

        const contentEntities = data.content_entities;
        const contentSentiment = JSON.parse(data.content_sentiment);
        setContent({ entities: contentEntities, sentiment: contentSentiment });
      });
  };

  const displayTextareaValue = label => {
    if (locationState !== undefined) {
      if (label === 'headline') {
        return locationState.ad.headline;
      } else {
        return locationState.ad.content;
      }
    } else {
      return '';
    }
  };

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
              value={displayTextareaValue(input.label)}
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
          <h4>Headline Analysis</h4>
          <ColorBar
            score={headline.sentiment.score}
            magnitude={headline.sentiment.magnitude}
          />
          <TermsDisplay termList={headline.entities} />
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

SentimentAnalysis.propTypes = {
  props: PropTypes.object,
  location: PropTypes.object,
};

export default SentimentAnalysis;
