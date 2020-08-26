import React from 'react';
import Backdrop from '../Backdrop';
import Button from '../Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import './index.css';

const ConfirmDelete = (props) => props.isModalOpen && (
  <Backdrop
    onClick={props.onCloseModal}>
    <div
      className="modal"
      onClick={event => event.stopPropagation()}>
      <button
        className="close-button"
        onClick={props.onCloseModal}>
        <FontAwesomeIcon
          icon={faTimes}
          color="black" />
      </button>
      <p>
        <strong>Are you sure you want to delete this {props.keyword}?</strong>
      </p>
      <div className="button-container">
        <Button
          onClick={props.onDelete}>
          Yes
        </Button>
        <Button
          type="danger"
          onClick={props.onCloseModal}>
          No
        </Button>
      </div>
    </div>
  </Backdrop>
);

export default ConfirmDelete;