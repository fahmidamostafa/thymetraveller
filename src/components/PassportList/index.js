import React, { useEffect, useState } from "react";
import Button from "../Button";
import globeImage from '../../assets/passport.png';
import './index.css';

const PassportList = (props) => {
  const [cities, setCities] = useState(null);

  useEffect(() => {
    props.setLoading(true);
    if (props.cities) {
      setCities(props.cities);
      props.setLoading(false);
    }
  }, [props.cities]);

  return (
    <div className="passport-list">
      {cities && cities.map((city) => (
        <div
          key={city.id}
          className="passport"
          onClick={() => props.onOpenModal('passport', city.id)}>
          <img
            src={globeImage}
            alt="A globe" />
          <div className="inner-container">
            <h2>{city.custom || city.original}</h2>
            <div className="form-container">
              <Button
                onClick={event => props.onOpenModal('changePassportName', city.id, event)}>
                Change Passport Name
              </Button>
              <Button
                onClick={event => props.onOpenModal('city', city.id, event)}>
                Delete Passport
              </Button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default PassportList;