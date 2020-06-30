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

import Hit from '../Hit/Hit';
import React from 'react';
import { searchClient } from '../../constants/algolia_config';
import tardigrade from '../../images/tardigrade.png';

const Search = () => (
  <div className="search-container">
    <div className="container">
      <InstantSearch searchClient={searchClient} indexName="dev_ADS">
        <div className="search-panel__filters">
          <div className="filter-header">
            <h3>FILTERS</h3>
          </div>
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
            <NumericMenu attribute="data.impressionsMin" items={IMPRESSIONS} />
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

export default Search;
