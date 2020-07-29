import Modal from 'react-modal';
import React, { useState } from 'react';
import ReactWordcloud from 'react-wordcloud';

import { generateWordCloudValues } from './GenerateWordCloudValues';
import { WORD_CLOUD_OPTIONS } from '../../constants/word_cloud_constants'

Modal.setAppElement('#root');

const WordCloudModal = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);

  return (
    <div>
      <h3
        className="filter-header position-right"
        onClick={handleOpenModal}
      >
        WORD CLOUD
      </h3>
      <Modal 
        isOpen={isModalOpen} 
        onRequestClose={handleCloseModal}
      >
        <h3
          className="filter-header position-right black-text"
          onClick={handleCloseModal}
        >
          Close
        </h3>
        <ReactWordcloud 
          options={WORD_CLOUD_OPTIONS} 
          words={generateWordCloudValues()} 
        />
      </Modal>
    </div>
  );
};

export default WordCloudModal;
