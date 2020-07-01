import './ResultList.css';

import { Hits, Pagination } from 'react-instantsearch-dom';

import React from 'react';
import ResultItem from '../ResultItem/ResultItem';

const ResultList = () => (
  <div className="search-panel__results center">
    <Hits hitComponent={ResultItem} /> {/* display a list of results. */}
    <div className="pagination">
      <Pagination />
    </div>
  </div>
);

export default ResultList;
