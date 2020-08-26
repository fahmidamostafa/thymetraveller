import React, { useEffect, useState } from "react";
import Button from "../Button";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faAngleDoubleUp, faAngleDoubleDown } from '@fortawesome/free-solid-svg-icons'
import thymeImage from "../../assets/thymeImage.png";
import './index.css';

const SearchResults = (props) => {
  const [restaurants, setRestaurants] = useState(null);
  const sort = [
    'User Rating (highest to lowest)',
    'User Rating (lowest to highest)',
    'Average Cost for Two (highest to lowest)',
    'Average Cost for Two (lowest to highest)',
    'Price Range (highest to lowest)',
    'Price Range (lowest to highest)'
  ];
  const filter = [
    'User Rating > 4.5',
    'Average Cost for Two < 60',
    'Price Range < $$$'
  ];

  useEffect(() => {
    if (props.restaurants) {
      setRestaurants(props.restaurants);
      props.setLoading(false);
    }
  }, [props.restaurants]);

  useEffect(() => {
    if (props.scroll) {
      props.scrollToTop();
    }
  }, [restaurants, props.scroll]);

  if (restaurants) {
    if (!!restaurants.length) {
      return (
        <div className="search-results">
          <div className="wrapper">
            <ul className="sort-and-filter">
              <li className="dropdown">
                Sort Results By:
              <ul className="sort">
                  {sort.map((item, index) =>
                    <li key={index}>
                      <button
                        onClick={() => props.onSort(index)}>
                        {item}
                      </button>
                    </li>
                  )}
                </ul>
              </li>
              <li className="dropdown">
                Filter results by:
                <ul className="filter">
                  {filter.map((item, index) =>
                    <li key={index}>
                      <button
                        onClick={() => props.onFilter(index)}>
                        {item}
                      </button>
                    </li>
                  )}
                </ul>
              </li>
            </ul>
          </div>
          <div>
            <div className="search-title">
              <div className="spacer" />
              <h2>{props.searchSubmission.label}</h2>
              <button
                className="arrow-button down"
                onClick={props.scrollToBottom}>
                <FontAwesomeIcon
                  icon={faAngleDoubleDown}
                  color="white" />
              </button>
            </div>
            {restaurants.map(result => {
              const {
                average_cost_for_two,
                cuisines,
                featured_image,
                id,
                isAdded,
                location,
                name,
                price_range,
                url,
                user_rating,
              } = result.restaurant;
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
                                <ul className={`cuisine-list ${cuisineList.length === 1 && "item-count-one"}`}>
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
                        disabled={isAdded}
                        onClick={() => props.onAddResToPassport(result.restaurant)}>
                        Add to Passport
                      </Button>
                    </div>
                  </div>
                </div>
              )
            })}
            <div className="cta-bottom">
              <form>
                <ul className="pagination">
                  {props.pages && props.pages.map((page) => (
                    <li key={page}>
                      <Button
                        className="page-button"
                        disabled={page === props.currentPage}
                        onClick={event => props.onChangePage(event, page - 1)}>
                        {page}
                      </Button>
                    </li>
                  ))}
                </ul>
              </form>
              <button
                className="arrow-button up"
                onClick={props.scrollToTop}>
                <FontAwesomeIcon
                  icon={faAngleDoubleUp}
                  color="white"
                  className="arrow-up" />
              </button>
            </div>
          </div>
        </div>
      );
    }
    return (
      <div className="search-results no-results-found">
        <div className="search-title">
          <h2>... No results found ...</h2>
        </div>      
      </div>
    );
  }
  return null;
}

export default SearchResults;