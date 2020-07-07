import './ResultList.css';

import { Hits, Pagination } from 'react-instantsearch-dom';

import React from 'react';
import ResultItem from '../ResultItem/ResultItem';

const ResultList = () => (
  <div className="search-panel-results center">
    <Hits hitComponent={ResultItem} />
    <div className="pagination">
      <Pagination />
    </div>
  </div>
);

export default ResultList;
