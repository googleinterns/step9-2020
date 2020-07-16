import PropTypes from 'prop-types';
import React from 'react';

const HEADLINE_PLACEHOLDER =
  'i.e. Fighting Climate Change | Pete Buttigieg 2020 | Learn More';
const CONTENT_PLACEHOLDER =
  "i.e. Climate change is a life and death issue for our generation. It's time for bold action.";

const INPUT_LIST = [
  { label: 'HEADER', placeholder: HEADLINE_PLACEHOLDER },
  { label: 'CONTENT', placeholder: CONTENT_PLACEHOLDER },
];

const AnalysisInput = props => {
  const { label, placeholder } = props;

  return (
    <div className="search-header center">
      <h3 className="analysis-label">{label}</h3>
      <textarea
        type="text"
        rows={3}
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

  const colorMap = {
    negative: { label: 'Negative', color: 'red', background: '#ffbbc6' },
    neutral: { label: 'Neutral', color: 'gray', background: '#e8e8e8' },
    positive: { label: 'Positive', color: 'green', background: '#a8ffcc' },
  };

  const colorObject = colorMap.neutral;

  if (score < 0.0) {
    Object.assign(colorObject, colorMap.negative);
  } else if (score > 0.0) {
    Object.assign(colorObject, colorMap.positive);
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
            <div className="analysis-text" id="special-text">
              {termObject.name}
            </div>
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

export { AnalysisInput, ColorBar, INPUT_LIST, TermsDisplay };
