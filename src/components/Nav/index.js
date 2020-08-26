import React from "react";
import { Link } from 'react-router-dom';
import './index.css';

const Nav = (props) => (
  <nav>
    <div className="nav-container">
      <ul>
        <li key="home">
          <Link to={`${process.env.PUBLIC_URL}`}>Home</Link>
        </li>
        <li key="passport-list">
          <Link to={`${process.env.PUBLIC_URL}/passport-list`}>Passports</Link>
        </li>
        <li key="credits">
          <Link to={`${process.env.PUBLIC_URL}/credits`}>Credits</Link>
        </li>
      </ul>
    </div>
    <div className="social-container">
      <ul className="social-links">
        <li key="code">
          <a href="https://github.com/fahmidamostafa/Thyme-Traveller">
            <i className="fas fa-code" />
          </a>
        </li>
        <li key="portfolio">
          <a href="http://www.fahmidamostafa.com/">
            <i className="fas fa-briefcase" />
          </a>
        </li>
        <li key="linkedin">
          <a href="https://www.linkedin.com/in/fahmida-mostafa-2a465789/">
            <i className="fab fa-linkedin" />
          </a>
        </li>
        <li key="email">
          <form action="mailto:fahmida.mostafa@gmail.com">
            <button>
              <i className="fas fa-envelope" />
            </button>
          </form>
        </li>
      </ul>
    </div>
  </nav>
);

export default Nav;
