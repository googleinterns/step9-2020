import './Search.css';

import { PROD_INDEX, SEARCH_CLIENT } from '../../constants/algolia_config';
import React, { useState } from 'react';

import FilterList from '../FilterList/FilterList';
import { InstantSearch } from 'react-instantsearch-dom';
import ResultList from '../ResultList/ResultList';
import SearchBar from '../SearchBar/SearchBar';

const Search = () => {
  const [showFilter, setShowFilter] = useState(true);

  const handleFilterToggle = () => {
    setShowFilter(!showFilter);
  };

  return (
    <div className="search-container">
      <div className="container">
        <InstantSearch searchClient={SEARCH_CLIENT} indexName={PROD_INDEX}>
          <h3 className="filter-header" onClick={handleFilterToggle}>
            {`(${showFilter ? '-' : '+'}) FILTERS`}
          </h3>
          <SearchBar />
          <div className="search-body">
            {showFilter && <FilterList />}
            <ResultList />
          </div>
        </InstantSearch>
      </div>
    </div>
  );
};

export default Search;
