import './SentimentAnalysis.css';

import {
  API_URL,
  DEFAULT_ANALYSIS,
  INPUT_LIST,
} from '../../constants/analysis_constants';
import { AnalysisInput, ColorBar, TermsDisplay } from './Helpers';
import React, { useState } from 'react';

import { CLIENT_KEY } from '../../constants/capcha_config';
import PropTypes from 'prop-types';
import ReCAPTCHA from 'react-google-recaptcha';
import html2canvas from 'html2canvas';
import { saveAs } from 'file-saver';
import tardigrade from '../../images/tardigrade.png';

const SentimentAnalysis = props => {
  const locationState = props.location.state;
  const ad = locationState !== undefined ? locationState.ad : DEFAULT_ANALYSIS;

  const [isVerified, setIsVerified] = useState(false);
  const [headline, setHeadline] = useState(ad.headlineAnalysis);
  const [content, setContent] = useState(ad.contentAnalysis);

  /**
   * Creates an Ad Analysis object and passes it to
   * the /analysis route (SentimentAnalysis component)
   * @param {Boolean} value - whether the user has been
   * verified by the capcha
   * @returns {Void} doesn't return anything
   */
  const onChange = value => {
    setIsVerified(value !== null);
  };

  /**
   * Set the current headline and content analysis of
   * the component with new data
   * @param {Boolean} data - new data returned from API
   * @returns {Void} doesn't return anything
   */
  const updatePage = data => {
    setHeadline({
      entities: data.headline_entities,
      sentiment: JSON.parse(data.headline_sentiment),
    });
    setContent({
      entities: data.content_entities,
      sentiment: JSON.parse(data.content_sentiment),
    });
  };

  /**
   * Send user-input form to API and get back data
   * @param {FormSubmitEvent} event - event that targets
   * the whole form
   * @returns {Void} doesn't return anything
   */
  const submitForm = event => {
    event.preventDefault();
    const form = new FormData(event.target);
    fetch(API_URL, { method: 'POST', body: form })
      .then(response => response.json())
      .then(data => updatePage(data));
  };

  /**
   * Pick the appropriate value for textarea based on
   * the given label
   * @param {String} label - the label of textarea
   * @returns {String} the appropriate value for textarea
   * - If there's params passed from Search route, display those values
   * - If not, show empty textarea so user can filled in themselves
   */
  const displayTextareaValue = label => {
    if (locationState === undefined) {
      return '';
    }
    return label === 'headline'
      ? locationState.ad.headline
      : locationState.ad.content;
  };

  /**
   * Generates a PNG image of the current result page and
   * automatically saves it to user's local machine
   * @returns {Void} doesn't return anything
   */
  const handleDownload = () => {
    const input = document.getElementById('analysis-container');
    html2canvas(input).then(canvas => {
      const imgData = canvas.toDataURL('image/png');
      saveAs(imgData, 'tardigrade-analysis.png');
    });
  };

  return (
    <div className="search-container" id="analysis-container">
      <h3 className="filter-header" onClick={handleDownload}>
        ⤓ DOWNLOAD
      </h3>
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
