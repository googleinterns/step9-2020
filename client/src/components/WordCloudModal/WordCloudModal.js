import React from 'react';
import ReactWordcloud from 'react-wordcloud';
import Modal from 'react-modal';
import PropTypes from 'prop-types';

import generateWordCloudValues from './GenerateWordCloudValues';

Modal.setAppElement('#root');

const wordCloudOptions = {
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
  scale: 'linear',
  spiral: 'archimedean',
  transitionDuration: 1000,
};

const WordCloudModal = props => {
  const { isModalOpen, setIsModalOpen } = props;

  const handleCloseModal = () => setIsModalOpen(false);

  return (
    <Modal 
      isOpen={isModalOpen} 
      onRequestClose={handleCloseModal}
    >
      <h3
        className="filter-header button-right black-text"
        onClick={() => setIsModalOpen(false)}
      >
        Close
      </h3>
      <ReactWordcloud 
        options={wordCloudOptions} 
        words={generateWordCloudValues()} 
      />
    </Modal>
  );
};

WordCloudModal.propTypes = {
  isModalOpen: PropTypes.bool,
  setIsModalOpen: PropTypes.func
};

export default WordCloudModal;
