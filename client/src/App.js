import './App.css';

import React, { useState } from 'react';

import { HEADERS, PAGE_MAP } from './constants/header_constants';
import PageNav from './components/PageNav/PageNav';

const App = () => {
  const [currentPage, setCurrentPage] = useState(HEADERS[0]);

  return (
    <div>
      <PageNav currentPage={currentPage} setCurrentPage={setCurrentPage} />
      {PAGE_MAP[currentPage]}
    </div>
  );
};

export default App;
