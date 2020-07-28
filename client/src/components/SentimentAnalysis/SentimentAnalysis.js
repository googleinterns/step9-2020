import './SentimentAnalysis.css';

import {
  API_URL,
  DEFAULT_ANALYSIS,
  INPUT_LIST,
} from '../../constants/analysis_constants';
import { AnalysisInput, ColorBar, TermsDisplay } from './Helpers';
import React, { useEffect, useState } from 'react';

import { CLIENT_KEY } from '../../constants/capcha_config';
import PropTypes from 'prop-types';
import ReCAPTCHA from 'react-google-recaptcha';
import ShareModal from '../ShareModal/ShareModal';
import TinyURL from 'tinyurl';
import { database } from '../../firebase/firebase';
import html2canvas from '@nidi/html2canvas';
import { saveAs } from 'file-saver';
import tardigrade from '../../images/tardigrade.png';
import { useParams } from 'react-router-dom';

const removeSingleQuote = str => str.replace(/'/g, '');

const SentimentAnalysis = () => {
  const { id } = useParams();

  const [isVerified, setIsVerified] = useState(false);
  const [headline, setHeadline] = useState(DEFAULT_ANALYSIS);
  const [content, setContent] = useState(DEFAULT_ANALYSIS);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [shareLink, setShareLink] = useState(undefined);
  const [copyContent, setCopyContent] = useState('Copy');

  const shortenLink = () => {
    const originalUrl = window.location.href;
    if (shareLink === undefined) {
      TinyURL.shorten(originalUrl).then((res, err) => {
        setShareLink(err ? originalUrl : res);
      });
    }
  };

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
      text: data.headline,
      entities: JSON.parse(removeSingleQuote(data.headlineTerms)),
      sentiment: JSON.parse(data.headlineSentiment),
    });
    setContent({
      text: data.content,
      entities: JSON.parse(removeSingleQuote(data.contentTerms)),
      sentiment: JSON.parse(data.contentSentiment),
    });
    shortenLink();
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
    if (id === undefined) {
      return '';
    }
    return label === 'headline' ? headline.text : content.text;
  };

  /**
   * Generates a PNG screenshot of the current result page and
   * automatically saves it to user's local machine
   * Note: download as PNG because of its flexibility in dimensions
   * @returns {Void} doesn't return anything
   */
  const downloadScreenshot = () => {
    const input = document.getElementById('analysis-container');
    html2canvas(input).then(canvas => {
      const imgData = canvas.toDataURL('image/png');
      saveAs(imgData, 'tardigrade-analysis.png');
    });
  };

  useEffect(() => {
    if (id === undefined) {
      setShareLink(undefined);
      return;
    }
    database
      .collection('ads')
      .doc(id)
      .get()
      .then(doc => updatePage(doc.data()))
      .catch(error => console.log('Error getting documents: ', error));
  }, [id, headline, content, shareLink]);

  const openModal = () => {
    setIsModalOpen(true);
  };

  return (
    <div className="search-container" id="analysis-container">
      <h3
        className="filter-header"
        id="position-left"
        onClick={downloadScreenshot}
      >
        ⤓ DOWNLOAD
      </h3>
      {shareLink && (
        <h3 className="filter-header" id="position-right" onClick={openModal}>
          SHARE ⤒
        </h3>
      )}
      <ShareModal
        shareLink={shareLink}
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        copyContent={copyContent}
        setCopyContent={setCopyContent}
      />
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
