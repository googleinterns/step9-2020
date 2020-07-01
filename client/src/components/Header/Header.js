import './Header.css';

import React from 'react';
import { SEARCHBOX_CONFIG } from '../../constants/searchbox_constant';
import { SearchBox } from 'react-instantsearch-dom';
import tardigrade from '../../images/tardigrade.png';

const Header = () => (
  <header className="header center">
    <img src={tardigrade} className="logo" />
    <SearchBox className="searchbox" translations={SEARCHBOX_CONFIG} />
  </header>
);

export default Header;
