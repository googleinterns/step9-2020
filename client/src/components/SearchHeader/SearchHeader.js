import './SearchHeader.css';

import React from 'react';
import { SearchBox } from 'react-instantsearch-dom';
import tardigrade from '../../images/tardigrade.png';

const SEARCHBOX_CONFIG = {
  placeholder: 'Search Ads...',
};

const SearchHeader = () => (
  <header className="search-header center">
    <img src={tardigrade} className="logo" alt="logo" />
    <SearchBox className="searchbox" translations={SEARCHBOX_CONFIG} />
  </header>
);

export default SearchHeader;
