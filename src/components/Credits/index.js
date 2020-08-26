import React from 'react';
import './index.css';

const Credits = (props) => {
  const links = [
    { name: 'Jeremy Dryden', url: 'https://www.itsmejeremyd.com/' },
    { name: 'Ruby Bantock', url: 'http://www.rubybantock.com/' },
    { name: 'Braeden Craig', url: 'http://braedencraig.com/' }
  ];

  return (
    <div className="credits">
      © 2020 Fahmida Mostafa. Made using the&nbsp;
      <a
        href="https://developers.zomato.com/api"
        target="_blank"
        rel="noopener noreferrer">
        Zomato API
      </a>. Original&nbsp;
      <a
        href="https://thymetraveller-37bc8.firebaseapp.com/"
        target="_blank"
        rel="noopener noreferrer">
        website
      </a>
      &nbsp;built alongside:
      <ul>
        {links.map((item, index) => (
          <li key={index}>
            <a
              href={item.url}
              target="_blank"
              rel="noopener noreferrer">
              {item.name}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Credits;