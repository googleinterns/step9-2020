import './App.css';

import React, { useState } from 'react';

import PageNav from './components/PageNav/PageNav';
import Search from './components/Search/Search';
import Visualization from './components/Visualization/Visualization';

const App = () => {
  const [currentPage, setCurrentPage] = useState('Ads Search');

  const pageMap = {
    'Ads Search': <Search />,
    'Data Visualization': <Visualization />,
  };

  return (
    <div>
      <PageNav currentPage={currentPage} setCurrentPage={setCurrentPage} />
      {pageMap[currentPage]}
    </div>
  );
};

export default App;
