import './ResultList.css';

import { Hits, Pagination } from 'react-instantsearch-dom';

import Hit from '../Hit/Hit';
import React from 'react';

const ResultList = () => (
  <div className="search-panel__results center">
    <Hits hitComponent={Hit} /> {/* display a list of results. */}
    <div className="pagination">
      <Pagination />
    </div>
  </div>
);

export default ResultList;
