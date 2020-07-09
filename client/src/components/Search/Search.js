import './Search.css';

import React, { useState } from 'react';

import FilterList from '../FilterList/FilterList';
import Header from '../Header/Header';
import { InstantSearch } from 'react-instantsearch-dom';
import ResultList from '../ResultList/ResultList';
import { searchClient } from '../../constants/algolia_config';

const Search = () => {
  const [showFilter, setShowFilter] = useState(false);

  const handleFilterToggle = () => {
    setShowFilter(!showFilter);
  };

  return (
    <div className="search-container">
      <div className="container">
        <InstantSearch searchClient={searchClient} indexName="dev_ADS">
          <h3 className="filter-header" onClick={handleFilterToggle}>
            {`(${showFilter ? '-' : '+'}) FILTERS`}
          </h3>
          <Header />
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
