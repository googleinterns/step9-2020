import { COLOR_MAP, INPUT_ROWS } from '../../constants/analysis_constants';

import PropTypes from 'prop-types';
import React from 'react';

/**
 * Component that display a user-input textarea for Sentiment Analysis.
 */

const AnalysisInput = props => {
  const { label, placeholder, value = '' } = props;

  return (
    <div className="search-header center">
      <h3 className="analysis-label">{label.toUpperCase()}</h3>
      <textarea
        name={label}
        type="text"
        rows={INPUT_ROWS}
        className="ad-input"
        placeholder={placeholder}
        defaultValue={value}
        required
      />
    </div>
  );
};

AnalysisInput.propTypes = {
  label: PropTypes.string,
  placeholder: PropTypes.string,
  value: PropTypes.string,
};

/**
 * Component that changes color based on the given score and magnitude
 * i.e. Negative is red, Positive is green and Neutral is gray
 */

const ColorBar = props => {
  const { score, magnitude } = props;

  const colorObject = COLOR_MAP.neutral;

  if (score < 0.0) {
    Object.assign(colorObject, COLOR_MAP.negative);
  } else if (score > 0.0) {
    Object.assign(colorObject, COLOR_MAP.positive);
  }

  return (
    <div
      className="color-bar"
      style={{
        color: colorObject.color,
        backgroundColor: colorObject.background,
      }}
    >
      {`${colorObject.label}: ${score} ----- Magnitude: ${magnitude}`}
    </div>
  );
};

ColorBar.propTypes = {
  score: PropTypes.number,
  magnitude: PropTypes.number,
};

/**
 * Component that displays each of the entity's term as tags
 */

const TermsDisplay = props => {
  const { termList } = props;

  return (
    <div className="analysis-text-container">
      {termList.map((term, index) => {
        const termObject = typeof term === 'string' ? JSON.parse(term) : term;
        return (
          <div key={index} className="center">
            <div className="analysis-text special-text">{termObject.name}</div>
            <div className="analysis-text">type: {termObject.type}</div>
            <div className="analysis-text">salience: {termObject.salience}</div>
          </div>
        );
      })}
    </div>
  );
};

TermsDisplay.propTypes = {
  termList: PropTypes.array,
};

export { AnalysisInput, ColorBar, TermsDisplay };
