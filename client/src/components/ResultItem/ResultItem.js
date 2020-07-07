import './ResultItem.css';

import { Highlight } from 'react-instantsearch-dom';
import PropTypes from 'prop-types';
import React from 'react';

/* Algolia's Hit: display a result item from search */
function ResultItem(props) {
  // a hit (result) object that contains all info about a result item
  const { hit } = props;

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
    </div>
  );
}

ResultItem.propTypes = {
  hit: PropTypes.object.isRequired,
};

export default ResultItem;
