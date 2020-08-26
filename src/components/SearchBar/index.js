import React, { useState } from 'react';
import ReactSelect from 'react-select';
import Button from '../Button';
import Option from './Option';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheck, faTimes, faCircleNotch } from '@fortawesome/free-solid-svg-icons'
import thymeIcon from "../../assets/thymeIcon.png";
import airplane from "../../assets/airplane.png";
import qrCode from "../../assets/qr-code.png";
import './index.css';

const SearchBar = (props) => {
  const [isInputInvalid, setIsInputInvalid] = useState(null);

  const selectStyles = {
    dropdownIndicator: () => ({ display: 'none' }),
    indicatorSeparator: () => ({ display: 'none' }),
    control: (provided, state) => ({ 
      ...provided,
      height: '2.5rem',
      width: '100%'
    }),
    input: () => ({
      minWidth: '100%',
      height: '100%',
      '& > div': {
        width: '100%',
        height: '100%',
        '& > input': {
          minWidth: '100%',
          height: '100%',
          opacity: '1 !important',
        }
      }
    }),
    menuList: (provided, state) => ({
      ...provided,
      maxHeight: '12.5rem'
    }),
    option: (provided, state) => ({
      ...provided,
      cursor: 'pointer'
    }),
    valueContainer: (provided, state) => ({
      ...provided,
      height: '100%',
      width: '100%',
    })
  };

  const renderIndicator = () => {
    if (props.isLoadingCitySuggestions) {
      return <FontAwesomeIcon icon={faCircleNotch} color="darkgrey" spin />;
    }
    if (isInputInvalid) {
      return <FontAwesomeIcon icon={faTimes} color="crimson" />;
    }
    if (isInputInvalid === false) {
      return <FontAwesomeIcon icon={faCheck} color="green" />;
    }
    return null;
  }

  const handleOnBlur = () => {
    if (!props.searchSelection && props.cityInput && props.cityInput.length > 2) {
      setIsInputInvalid(true);
      props.setErrorMessage('Please enter a valid location and make a selection in order to proceed.');  
      return;
    }
    if (props.searchSelection) {
      setIsInputInvalid(false);
      props.setErrorMessage(null);
      return;
    }
    if (!props.cityInput || (props.cityInput && props.cityInput.length < 3)) {
      setIsInputInvalid(null);
      props.setErrorMessage(null);
      return;
    }
  }

  return (
    <div className="search-bar">
      <div className="airline">
        <p>flight 21</p>
        <div className="logo">
          <p>tt air</p>
          <img src={thymeIcon} alt="" />
        </div>
      </div>
      <div className="ticket-top">
        <h2>HOME - AWAY</h2>
      </div>
      <form className="ticket">
        <label><strong>Enter Location</strong></label>
        <p className="hint">e.g. "Toronto, ON"</p>
        <div>
          {props.errorMessage && (
            <div className="error">
              <p className="error-text">{props.errorMessage}</p>
            </div>
          )}
          <div className="react-select-container">
            <ReactSelect
              placeholder=""
              styles={selectStyles}          
              inputValue={props.cityInput || ''}
              value={props.cityInput}
              options={props.citySuggestions || []}
              className="react-select"
              components={{Option}}
              onChange={props.onSelectCity}
              onInputChange={props.onChangeCity}
              noOptionsMessage={() => null}
              onFocus={() => setIsInputInvalid(null)}
              onBlur={handleOnBlur} />
            <div className="indicator-container">
              {renderIndicator()}
            </div>
          </div>
        </div>
        <Button
          onClick={props.onSubmitCitySearch}
          disabled={!props.searchSelection}>
          Search Cities
        </Button>
        <p>Enter your destination to begin your journey to foreign cuisines! Save your favourite restaurants no matter where you are in North America.</p>
      </form>
      <div className="user">
        <div className="plane" id="plane">
          <img src={airplane} alt="graphic of a airplane"/>
        </div>
        <img src={qrCode} alt="" className="qr"/>
      </div>
    </div>
  )
}
export default SearchBar;