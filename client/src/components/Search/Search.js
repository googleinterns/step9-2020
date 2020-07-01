import './Search.css';

import {
  Hits,
  InstantSearch,
  Pagination,
  SearchBox,
} from 'react-instantsearch-dom';
import React, { useState } from 'react';

import { FILTER_LIST } from '../../constants/filter_constant';
import Hit from '../Hit/Hit';
import { SEARCHBOX_CONFIG } from '../../constants/searchbox_constant';
import { searchClient } from '../../constants/algolia_config';
import tardigrade from '../../images/tardigrade.png';

const Search = () => {
  const [showFilter, setShowFilter] = useState(false);

  const handleFilterToggle = () => {
    setShowFilter(!showFilter);
  };

  return (
    <div className="search-container">
      <div className="container">
        <InstantSearch searchClient={searchClient} indexName="dev_ADS">
          <header className="header center">
            <h3 className="filter-header" onClick={handleFilterToggle}>
              {`(${showFilter ? '-' : '+'}) FILTERS`}
            </h3>
            <img src={tardigrade} className="logo" />
            <SearchBox className="searchbox" translations={SEARCHBOX_CONFIG} />
          </header>

          <div className="search-body">
            {showFilter && (
              <div className="search-panel__filters">{FILTER_LIST}</div>
            )}
            <div className="search-panel__results center">
              <Hits hitComponent={Hit} /> {/* display a list of results. */}
              <div className="pagination">
                <Pagination />
              </div>
            </div>
          </div>
        </InstantSearch>
      </div>
    </div>
  );
};

export default Search;
