import './PageNav.css';

import { HEADERS } from '../../constants/header_constants';
import PropTypes from 'prop-types';
import React from 'react';

const PageNav = props => {
  const { currentPage, setCurrentPage } = props;

  return (
    <div className="header">
      <h2 className="logo-text" onClick={() => setCurrentPage(HEADERS[0])}>
        Tardigrade
      </h2>
      <div className="search-body">
        {HEADERS.map((item, index) => (
          <p
            className={currentPage === item ? 'selected-header' : ''}
            key={index}
            onClick={() => setCurrentPage(item)}
          >
            {item}
          </p>
        ))}
      </div>
    </div>
  );
};

PageNav.propTypes = {
  currentPage: PropTypes.string,
  setCurrentPage: PropTypes.func,
};

export default PageNav;
