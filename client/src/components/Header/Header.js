import './Header.css';

import React from 'react';
import { SearchBox } from 'react-instantsearch-dom';
import tardigrade from '../../images/tardigrade.png';

const SEARCHBOX_CONFIG = {
  placeholder: 'Search Ads...',
};

const Header = () => (
  <header className="header center">
    <img src={tardigrade} className="logo" alt="Logo" />
    <SearchBox className="searchbox" translations={SEARCHBOX_CONFIG} />
  </header>
);

export default Header;
