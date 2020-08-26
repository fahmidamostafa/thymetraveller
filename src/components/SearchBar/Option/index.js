import React from 'react';
import { components } from 'react-select';

const Option = (props) => (
  <div>
    <components.Option {...props}>
      <span>{props.label.leading}</span>
      <span>
        <strong>{props.label.bold}</strong>
      </span>
      <span>{props.label.trailing}</span>
      <span className="country">{props.label.country}</span>
    </components.Option>
  </div>
);

export default Option;