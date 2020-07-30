/* eslint-disable no-eval */
import './ResultItem.css';

import { Highlight } from 'react-instantsearch-dom';
import PropTypes from 'prop-types';
import React from 'react';
import { useHistory } from 'react-router-dom';

/* Algolia's Hit: display a result item from search */
const ResultItem = props => {
  // a hit (result) object that contains all info about a result item
  const { hit } = props;
  const history = useHistory();

  /**
   * Creates an Ad Analysis object and passes it to
   * the /analysis route (SentimentAnalysis component)
   * @returns {Void} doesn't return anything
   */
  const handleAnalysis = () => {
    const { data } = hit;
    history.push(`/analysis/${data.id}`);
  };

  return (
    <div className="result-item-container">
      <a
        href={`https://www.${hit.data.link}`}
        className="highlight-header"
        target="_blank"
        rel="noopener noreferrer"
      >
        <Highlight attribute="data.headline" hit={hit} />
      </a>
      <p className="highlight-body">
        <Highlight attribute="data.content" hit={hit} />
      </p>
      <button
        className="analysis-button item-analysis"
        onClick={handleAnalysis}
      >
        Analyze
      </button>
    </div>
  );
};

ResultItem.propTypes = {
  hit: PropTypes.object.isRequired,
};

export default ResultItem;
