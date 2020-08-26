import React from "react";
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTimes } from '@fortawesome/free-solid-svg-icons'
import thymeIcon from "../../assets/thymeIcon.png";
import './index.css'

const Header = (props) => (
  <header className="header">
    <a
      href="#main-content"
      className="skip-link">
      Skip to main content
    </a>
    <Link to={`${process.env.PUBLIC_URL}/`}>
      <img src={thymeIcon} alt="An icon of the herb thyme." />
      <h1>
        Thyme Traveller
      
      </h1>
    </Link>
    {props.selectedRestaurant && (
      <div className="post-notification">
        <button
          className="close-button"
          onClick={props.onCloseNotification}>
        <FontAwesomeIcon icon={faTimes} />
        </button>
        <strong>"{props.selectedRestaurant}"</strong> saved
      </div>
    )}
  </header>
);

export default Header;