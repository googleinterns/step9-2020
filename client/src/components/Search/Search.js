import './Search.css';

import React, { useState } from 'react';
import ReactWordcloud from 'react-wordcloud';
import Modal from 'react-modal';
import { algoliaIndex, searchClient } from '../../constants/algolia_config';

import FilterList from '../FilterList/FilterList';
import { InstantSearch } from 'react-instantsearch-dom';
import ResultList from '../ResultList/ResultList';
import SearchBar from '../SearchBar/SearchBar';

import things from './words';
import generateWordCloudValues from './words_v2';

const Search = () => {
  const [showFilter, setShowFilter] = useState(true);
  const [modalIsOpen, setModalIsOpen] = useState(false);

  const handleFilterToggle = () => {
    setShowFilter(!showFilter);
  };

  const options = {
    colors: ['#1f77b4', '#ff7f0e', '#2ca02c', '#d62728', '#9467bd', '#8c564b'],
    enableTooltip: true,
    deterministic: false,
    fontFamily: 'impact',
    fontSizes: [10, 60],
    fontStyle: 'normal',
    fontWeight: 'normal',
    padding: 1,
    rotations: 3,
    rotationAngles: [0, 90],
    scale: 'log',
    spiral: 'archimedean',
    transitionDuration: 1000,
  };

  return (
    <div className="search-container">
      <div className="container">
        <InstantSearch searchClient={searchClient} indexName={algoliaIndex}>
          <h3
             className="filter-header"
             id="button-left"
             onClick={handleFilterToggle}
          >
            {`(${showFilter ? '-' : '+'}) FILTERS`}
          </h3>
          <SearchBar />
          <div className="search-body">
            {showFilter && <FilterList />}
            <ResultList />
          </div>
          <h3
             className="filter-header button-right"
             onClick={() => setModalIsOpen(true)}
          >
            {'SEARCH RESULTS WORD CLOUD'}
          </h3>
        </InstantSearch>
        <Modal isOpen={modalIsOpen} onRequestClose={() => setModalIsOpen(false)}>
          <h3
            className="filter-header button-right black-text"
            onClick={() => setModalIsOpen(false)}
          >
            Close
          </h3>
          <ReactWordcloud options={options} words={generateWordCloudValues()} />
        </Modal>
      </div>
    </div>
  );
};

export default Search;
