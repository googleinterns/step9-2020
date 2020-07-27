import PropTypes from 'prop-types';
import { AnalysisInput, ColorBar, TermsDisplay } from './Helpers';
import React from 'react';

/**
 * Component that ...
 */

const SimilarAds = props => {

  // console.log(headline);

  return (
    <div className="similar-container">
      <div className="similar-card">
        <h4>Similar Advertisements By Sentiment</h4>
        <p>
          Here are other ads with a headline sentiment score 
          of {props.headlineScore} and a content sentiment score 
          of {props.contentScore}.
        </p> 
      </div>
    </div>
  );
};

export default SimilarAds;
