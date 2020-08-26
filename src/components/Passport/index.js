import React, { useState, useEffect, Fragment } from "react";
import Backdrop from "../Backdrop";
import Button from "../Button";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import thymeImage from "../../assets/thymeImage.png";
import './index.css';

const Passport = (props) => {
  const [restaurants, setRestaurants] = useState(null);

  useEffect(() => {
    if (props.passport) {
      setRestaurants(props.passport.restaurants);
    }
  }, [props.passport]);

  return props.isModalOpen && restaurants && (
    <Backdrop
      onClick={props.onCloseModal}>
      <div
        className="passport-body"
        onClick={e => e.stopPropagation()}>
        <div className="details">
          <button
            className="close-button"
            onClick={props.onCloseModal}>
            <FontAwesomeIcon icon={faTimes} color="black" />
          </button>
          {props.passport.custom ? (
            <Fragment>
              <h1>{props.passport.custom}</h1>
              <h2>({props.passport.original})</h2>
            </Fragment>
          ) : (
            <h2>{props.passport.original}</h2>
          )}
          <div className="restaurants">
            {restaurants.map(restaurant => {
              const {
                average_cost_for_two,
                cuisines,
                featured_image,
                id,
                location,
                name,
                price_range,
                url,
                user_rating,
              } = restaurant;
              const priceRange = '$'.repeat(price_range);
              const cuisineList = cuisines.split(', ');

              return (
                <div className="result" key={id}>
                  <div className="inner-container">
                    <div className="img-container">
                      <img src={featured_image || thymeImage} alt={name} />
                    </div>
                    <div className="text-outer-container">
                      <div>
                        <h3>
                          <a href={url}>{name}</a>
                        </h3>
                        <p className="address">{location.address}</p>
                        <table>
                          <tbody>
                            <tr>
                              <td className="label">Cuisine:</td>
                              <td className="value">
                                <ul className={`cuisine-list ${cuisineList.length === 1 ? "item-count-one" : ""}`}>
                                  {cuisineList.map(cuisine => (
                                    <li key={cuisine}>{cuisine}</li>
                                  ))}
                                </ul>
                              </td>
                            </tr>
                            <tr>
                              <td className="label">Rating:</td>
                              <td className="value">{user_rating.aggregate_rating} /5</td>
                            </tr>
                            <tr>
                              <td className="label">Price Range:</td>
                              <td className="value">{priceRange}</td>
                            </tr>
                            <tr>
                              <td className="label">Average Cost for Two:</td>
                              <td className="value">${average_cost_for_two}</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                      <Button
                        className="result-cta-button"
                        onClick={() => props.onOpenModal('notes', id)}>Notes</Button>
                      <Button
                        className="result-cta-button"
                        onClick={() => props.onOpenModal('res', id)}>Delete</Button>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </Backdrop>
  );
}

export default Passport;