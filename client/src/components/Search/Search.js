import './Search.css';

import { COST, IMPRESSIONS } from '../../constants/filter_constant';
import {
  Hits,
  InstantSearch,
  NumericMenu,
  Pagination,
  RefinementList,
  SearchBox,
} from 'react-instantsearch-dom';
import React, { useState } from 'react';

import Hit from '../Hit/Hit';
import { searchClient } from '../../constants/algolia_config';
import tardigrade from '../../images/tardigrade1.png';

const Search = () => {
  const [showFilter, setShowFilter] = useState(false);

  return (
    <div className="search-container">
      <div className={showFilter ? 'container' : 'no-container'}>
        <InstantSearch searchClient={searchClient} indexName="dev_ADS">
          <div className="filter-container">
            <h3
              className="filter-header"
              onClick={() => setShowFilter(!showFilter)}
            >
              {`(${showFilter ? '-' : '+'}) FILTERS`}
            </h3>
            {showFilter && (
              <div className="search-panel__filters">
                <div className="filter-item">
                  <p className="filter-text">U.S States</p>
                  <RefinementList
                    attribute="data.geoTarget"
                    limit={5}
                    searchable
                    showMore
                  />
                </div>
                <div className="filter-item">
                  <p className="filter-text">Impressions</p>
                  <NumericMenu
                    attribute="data.impressionsMin"
                    items={IMPRESSIONS}
                  />
                </div>
                <div className="filter-item">
                  <p className="filter-text">USD Spent</p>
                  <NumericMenu attribute="data.spendMin" items={COST} />
                </div>
                <div className="filter-item">
                  <p className="filter-text">Gender</p>
                  <RefinementList attribute="data.genderTarget" />
                </div>
              </div>
            )}
          </div>
          <div className="search-panel__results center">
            <header className="header center">
              <img src={tardigrade} className="logo" />
            </header>
            <SearchBox
              className="searchbox"
              translations={{ placeholder: 'Search Ads...' }}
            />
            <Hits hitComponent={Hit} />

            <div className="pagination">
              <Pagination />
            </div>
          </div>
        </InstantSearch>
      </div>
    </div>
  );
};

export default Search;
