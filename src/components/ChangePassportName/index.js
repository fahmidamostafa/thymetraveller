import React from 'react';
import Backdrop from '../Backdrop';
import Button from '../Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import './index.css';

const ChangePassportName = (props) => props.isModalOpen && (
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
      <form
        onSubmit={props.onSubmitPassportName}>
        <label>
          <strong>Enter New Passport Name</strong>
        </label>
        <input
          type="text"
          onChange={props.onChangePassportName} />
        <Button>Submit</Button>
      </form>
    </div>
  </Backdrop>
);

export default ChangePassportName;