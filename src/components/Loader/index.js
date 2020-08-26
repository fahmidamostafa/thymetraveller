import React from 'react';
import Backdrop from '../Backdrop';
import './index.css';

const Loader = (props) => props.isLoadingPage && (
  <Backdrop
    onClick={event => event.stopPropagation()}>
    <div className="loader-container">
      <div className="loader" />
      <div>Please wait...</div>
    </div>  
  </Backdrop>
);

export default Loader;