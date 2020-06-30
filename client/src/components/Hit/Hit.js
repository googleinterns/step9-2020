import { Highlight } from 'react-instantsearch-dom';
import PropTypes from 'prop-types';
import React from 'react';

function Hit(props) {
  const { hit } = props;
  return (
    <article>
      <h1 className="highlight-header">
        <Highlight attribute="data.headline" hit={hit} />
      </h1>
      <p>
        <Highlight attribute="data.content" hit={hit} />
      </p>
    </article>
  );
}

Hit.propTypes = {
  hit: PropTypes.object.isRequired,
};

export default Hit;
