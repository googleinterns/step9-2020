import './Search.css';

import React, { useState } from 'react';
import { algoliaIndex, searchClient } from '../../constants/algolia_config';

import FilterList from '../FilterList/FilterList';
import { InstantSearch } from 'react-instantsearch-dom';
import ResultList from '../ResultList/ResultList';
import SearchBar from '../SearchBar/SearchBar';
import WordCloudModal from '../WordCloudModal/WordCloudModal';

const Search = () => {
  const [showFilter, setShowFilter] = useState(true);

  const handleFilterToggle = () => {
    setShowFilter(!showFilter);
  };

  return (
    <div className="search-container">
      <div className="container">
        <InstantSearch searchClient={searchClient} indexName={algoliaIndex}>
          <h3
             className="filter-header button-left"
             onClick={handleFilterToggle}
          >
            {`(${showFilter ? '-' : '+'}) FILTERS`}
          </h3>
          <SearchBar />
          <div className="search-body">
            {showFilter && <FilterList />}
            <ResultList />
          </div>
        </InstantSearch>
        <WordCloudModal />
      </div>
    </div>
  );
};

export default Search;
