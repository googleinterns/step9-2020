import './Search.css';

import React, { useState } from 'react';
import Modal from 'react-modal';
import { algoliaIndex, searchClient } from '../../constants/algolia_config';

import FilterList from '../FilterList/FilterList';
import { InstantSearch } from 'react-instantsearch-dom';
import ResultList from '../ResultList/ResultList';
import SearchBar from '../SearchBar/SearchBar';

const Search = () => {
  const [showFilter, setShowFilter] = useState(true);
  const [modalIsOpen, setModalIsOpen] = useState(false);

  const handleFilterToggle = () => {
    setShowFilter(!showFilter);
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
          <h2>{'Modal title'}</h2>
          <p>{'Modal Body'}</p>
        </Modal>
      </div>
    </div>
  );
};

export default Search;
