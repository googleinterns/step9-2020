import './App.css';

import React, { useState } from 'react';

import { PAGE_MAP } from './constants/header_constants';
import PageNav from './components/PageNav/PageNav';

const App = () => {
  const [currentPage, setCurrentPage] = useState('Sentiment Analysis');

  return (
    <div>
      <PageNav currentPage={currentPage} setCurrentPage={setCurrentPage} />
      {PAGE_MAP[currentPage]}
    </div>
  );
};

export default App;
