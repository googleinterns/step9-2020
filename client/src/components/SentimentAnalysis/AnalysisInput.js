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

export { AnalysisInput, INPUT_LIST };
