import './ResultItem.css';

import { Highlight } from 'react-instantsearch-dom';
import PropTypes from 'prop-types';
import React from 'react';

/* Algolia's Hit: display a result item from search */
function ResultItem(props) {
  // a hit (result) object that contains all info about a result item
  const { hit } = props;

  // Open url in a new tab
  const handleLinkClicked = () => {
    const url = `https://www.${hit.data.link}`;
    const win = window.open(url, '_blank');
    win.focus();
  };
  return (
    <article>
      <h1 onClick={handleLinkClicked} className="highlight-header">
        <Highlight attribute="data.headline" hit={hit} />
      </h1>
      <p className="highlight-body">
        <Highlight attribute="data.content" hit={hit} />
      </p>
    </article>
  );
}

ResultItem.propTypes = {
  hit: PropTypes.object.isRequired,
};

export default ResultItem;
