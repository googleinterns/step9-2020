import { COLOR_MAP, INPUT_ROWS } from '../../constants/analysis_constants';

import PropTypes from 'prop-types';
import React from 'react';

const AnalysisInput = props => {
  const { label, placeholder } = props;

  return (
    <div className="search-header center">
      <h3 className="analysis-label">{label}</h3>
      <textarea
        type="text"
        rows={INPUT_ROWS}
        className="ad-input"
        placeholder={placeholder}
      />
    </div>
  );
};

AnalysisInput.propTypes = {
  label: PropTypes.string,
  placeholder: PropTypes.string,
};

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

const TermsDisplay = props => {
  const { termList } = props;

  return (
    <div className="analysis-text-container">
      {termList.map((termString, index) => {
        const termObject = JSON.parse(termString);
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
