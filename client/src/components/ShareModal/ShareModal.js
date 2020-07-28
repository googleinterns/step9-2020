import './ShareModal.css';

import {
  EmailIcon,
  EmailShareButton,
  FacebookIcon,
  FacebookShareButton,
  TwitterIcon,
  TwitterShareButton,
} from 'react-share';

import { CopyToClipboard } from 'react-copy-to-clipboard';
import Modal from 'react-modal';
import PropTypes from 'prop-types';
import React from 'react';

const customStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    transform: 'translate(-50%, -50%)',
    borderRadius: '4px',
    padding: '20px',
    border: '3px dashed gray',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
  },
};

const ICON_SIZE = 40;

const ShareModal = props => {
  const {
    shareLink,
    isModalOpen,
    setIsModalOpen,
    copyContent,
    setCopyContent,
  } = props;

  const handleCopyContent = () => setCopyContent('Copied!');

  const handleCloseModal = () => setIsModalOpen(false);

  return (
    <Modal
      isOpen={isModalOpen}
      onRequestClose={handleCloseModal}
      style={customStyles}
    >
      <div>
        <input className="share-url-input" disabled defaultValue={shareLink} />
        <CopyToClipboard text={shareLink} onCopy={handleCopyContent}>
          <button className="analysis-button item-analysis">
            {copyContent}
          </button>
        </CopyToClipboard>
      </div>
      <div className="icon-container">
        <FacebookShareButton url={shareLink}>
          <FacebookIcon size={ICON_SIZE} round />
        </FacebookShareButton>
        <TwitterShareButton url={shareLink}>
          <TwitterIcon size={ICON_SIZE} round />
        </TwitterShareButton>
        <EmailShareButton url={shareLink}>
          <EmailIcon size={ICON_SIZE} round />
        </EmailShareButton>
      </div>
    </Modal>
  );
};

ShareModal.propTypes = {
  shareLink: PropTypes.string,
  isModalOpen: PropTypes.bool,
  setIsModalOpen: PropTypes.func,
  copyContent: PropTypes.string,
  setCopyContent: PropTypes.func,
};

export default ShareModal;
