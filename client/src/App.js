import './App.css';

import React, { useState } from 'react';

import Header from './components/Header/Header';
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
      <Header setCurrentPage={setCurrentPage} />
      {pageMap[currentPage]}
    </div>
  );
};

export default App;
