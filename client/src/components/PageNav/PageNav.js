import './PageNav.css';

import { useHistory, useLocation } from 'react-router-dom';

import { HEADERS } from '../../constants/header_constants';
import React from 'react';

const PageNav = () => {
  const history = useHistory();
  const location = useLocation();
  const { pathname } = location;

  return (
    <div className="header">
      <h2 className="logo-text" onClick={() => history.push('/')}>
        Tardigrade
      </h2>
      <div className="search-body">
        {HEADERS.map((page, index) => (
          <p
            className={pathname === page.route ? 'selected-header' : ''}
            key={index}
            onClick={() => history.push(page.route)}
          >
            {page.text}
          </p>
        ))}
      </div>
    </div>
  );
};

export default PageNav;
