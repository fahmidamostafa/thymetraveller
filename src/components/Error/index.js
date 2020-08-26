import React from 'react';
import Backdrop from '../Backdrop';
import './index.css';

const Error = (props) => props.isModalOpen && (
  <Backdrop>
    <div
      className="modal"
      onClick={event => event.stopPropagation()}>
      <div className="f-modal-icon f-modal-error animate">
        <span className="f-modal-x-mark">
          <span className="f-modal-line f-modal-left animateXLeft"></span>
          <span className="f-modal-line f-modal-right animateXRight"></span>
        </span>
        <div className="f-modal-placeholder"></div>
        <div className="f-modal-fix left"></div>
        <div className="f-modal-fix right"></div>
      </div>
      <p className="alert-message">Whoops! Looks like we encountered again. Please try again at another time.</p>
    </div>
  </Backdrop>
);

export default Error;