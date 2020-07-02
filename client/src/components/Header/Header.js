import './Header.css';

import { HEADERS } from '../../constants/header_constant';
import PropTypes from 'prop-types';
import React from 'react';

const Header = props => {
  const { setCurrentPage } = props;

  return (
    <div className="header">
      <h2 className="logo-text" onClick={() => setCurrentPage(HEADERS[0])}>
        Tardigrade
      </h2>
      <div className="search-body">
        {HEADERS.map((item, index) => (
          <p key={index} onClick={() => setCurrentPage(item)}>
            {item}
          </p>
        ))}
      </div>
    </div>
  );
};

Header.propTypes = {
  setCurrentPage: PropTypes.func,
};

export default Header;
