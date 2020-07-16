import './App.css';

import React, { useState } from 'react';

import { PAGE_MAP } from './constants/header_constant';
import PageNav from './components/PageNav/PageNav';

const App = () => {
  const [currentPage, setCurrentPage] = useState('Ads Search');

  return (
    <div>
      <PageNav currentPage={currentPage} setCurrentPage={setCurrentPage} />
      {PAGE_MAP[currentPage]}
    </div>
  );
};

export default App;
