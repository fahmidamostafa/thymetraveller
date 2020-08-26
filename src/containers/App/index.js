import React, { Component, Fragment } from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import firebase from '../../backend/firebase.js';
import zomato from '../../backend/zomato.js';
import Loader from '../../components/Loader';
import Header from '../../components/Header';
import Nav from '../../components/Nav';
import SearchBar from '../../components/SearchBar';
import SearchResults from '../../components/SearchResults';
import PassportList from '../../components/PassportList';
import Passport from '../../components/Passport';
import ChangePassportName from '../../components/ChangePassportName';
import ConfirmDelete from '../../components/ConfirmDelete';
import Notes from '../../components/Notes';
import Error from '../../components/Error/index.js';
import Credits from '../../components/Credits/index.js';

class App extends Component {
  constructor() {
    super();
    this.state = {
      allRestaurants: null,
      cities: null,
      cityInput: null,
      citySuggestions: null,
      currentCityId: null,
      currentPage: 1,
      currentResId: null,
      errorMessage: null,
      filteredRestaurants: null,
      isLoadingPage: false,
      isLoadingCitySuggestions: false,
      isModalOpen: {
        changePassportName: false,
        delete: false,
        error: false,
        notes: false,
        passport: false
      },
      newPassportName: null,
      notesInput: null,
      pages: null,
      passport: null,
      restaurants: null,
      scroll: null,
      searchSelection: null,
      searchSubmission: null,
      selectedRestaurant: null
    }
  }

  // used to scroll the top of SearchResults into view
  scrollToTop = () => document.querySelector('.user').scrollIntoView({ behavior: 'smooth' });

  // used to scroll the bottom of SearchResults into view
  scrollToBottom = () => document.querySelector('.pagination').scrollIntoView({ behavior: 'smooth' });

  // used on initial render to retrieve cities from BE
  getCities = async () => {
    try {
      const response = await firebase.get('/cities.json');
      const data = response.data;
      const cities = [];
      for (let id in data) {
        const original = data[id].name.original.value;
        const custom = data[id].name.custom ? data[id].name.custom.value : null;
        const restaurants = [];
        for (let item in data[id]) {
          if (!('original' in data[id][item])) {
            restaurants.push(data[id][item]);
          }
        }
        cities.push({ id, original, custom, restaurants });
      }
      this.setState({ cities });
      this.setLoading(false);
    } catch(error) {
      console.log(error);
      this.onOpenModal('error');
      this.setLoading(false);
    }
  }

  // used by SearchBar to retrieve city suggestions from API
  getCitySuggestions = async (query) => {
    this.setState({ isLoadingCitySuggestions: true });
    const params = {
      apikey: process.env.REACT_APP_ZKEY,
      q: query
    };

    try {
      const response = await zomato.get('cities', { params });
      const rawResults = response.data.location_suggestions;
      const canada = rawResults.filter(result => result.country_name === "Canada");
      const usa = rawResults.filter(result => result.country_name === "United States");
      const results = [ ...canada, ...usa ];
      const citySuggestions = [];
      if (!!results.length) {
        for (let suggestion in results) {
          const nameLC = results[suggestion].name.toLowerCase();
          const queryLC = query.toLowerCase();
          if (nameLC.includes(queryLC)) {
            const findIndex = nameLC.indexOf(queryLC);
            const splitSug = [
              results[suggestion].name.slice(0, findIndex),
              results[suggestion].name.slice(findIndex, findIndex + query.length),
              results[suggestion].name.slice(findIndex + query.length)
            ];
            const label = {
              leading: splitSug[0],
              bold: splitSug[1],
              trailing: splitSug[2],
              country: results[suggestion].country_name,
              id: results[suggestion].id
            };
            const value = results[suggestion].name;
            citySuggestions.push({ value, label });
          }
          citySuggestions.sort((a, b) =>
            (a.value > b.value) ? 1 : (
              (b.value > a.value) ? -1 : 0
            )
          );
        }
      }
      this.setState({
        citySuggestions,
        isLoadingCitySuggestions: false
      });
    } catch (error) {
      console.log(error);
      this.onOpenModal('error');
      this.setState({ isLoadingCitySuggestions: false });
    }
  }

  // used by SearchBar and pagination to retrieve restaurants for currently searched city from API
  getRestaurants = async () => {
    const allRestaurants = []; const pages = [];
    let firstFlag = false; let secondFlag = false;

    const params = {
      apikey: process.env.REACT_APP_ZKEY,
      entity_id: this.state.searchSelection.value,
      entity_type: 'city',
      start: 0,
      count: 20
    };

    try {
      const response = await zomato.get('search', { params });
      allRestaurants.push(...response.data.restaurants);
      let noPages = response.data.results_found / 100;
      const noPagesRounded = noPages - Math.floor(noPages);
      noPages = (noPagesRounded > 0) ? (Math.floor(noPages) + 1) : Math.floor(noPages);
      noPages = (noPages > 5) ? 5 : noPages;
      for (let i = 0; i < noPages; i += 1) pages.push(i + 1);
      const searchSubmission = { ...this.state.searchSelection };
      firstFlag = true;
      this.setState({
        currentPage: 1,
        pages,
        searchSubmission
      });
    } catch (error) {
      console.log(error);
      this.onOpenModal('error');
      this.setLoading(false);
    }

    if (firstFlag) {
      if (pages.length === 1) {
        secondFlag = true;
      } else {
        for (let i = 1; i < pages.length; i += 1) {
          try {
            params.start = i * 20;
            const response = await zomato.get('search', { params });
            allRestaurants.push(...response.data.restaurants);
            if (i === pages.length - 1) secondFlag = true;
          } catch (error) {
            console.log(error);
            this.onOpenModal('error');
            this.setLoading(false);
          }
        }
      }
    }

    if (secondFlag) {
      const restaurants = allRestaurants.slice(0, 20);
      const city = this.state.cities.find(city => city.id === `${this.state.searchSelection.value}`);
      if (city) {
        const restaurantsBE = city.restaurants;
        for (let i = 0; i < restaurantsBE.length; i += 1) {
          for (let j = 0; j < restaurants.length; j += 1) {
            if (restaurants[j].restaurant.id === restaurantsBE[i].id) {
              restaurants[j].restaurant.isAdded = true;
            }
          }
        }
      }

      this.setState({
        allRestaurants,
        filteredRestaurants: null,
        restaurants,
        scroll: true
      });
    }
  }

  // used by SearchBar to set error message
  setErrorMessage = errorMessage => this.setState({ errorMessage });

  // used by SearchBar to temporarily store user input: cityInput
  onChangeCity = (query, { action }) => {
    if (action === 'menu-close') return;
    if (
      (action !== 'set-value') &&
      (action !== 'input-blur') &&
      (action !== 'menu-close')
    ) {
      const cityInput = !query.length ? null : query;
      this.setState({
        cityInput,
        searchSelection: null
      });
      if (cityInput && cityInput.length > 2) {
        this.getCitySuggestions(cityInput);
      } else {
        this.setState({ citySuggestions: null });
      }
    }
  }

  // used by SearchBar to select a city from the dropdown suggestions
  onSelectCity = selection => {
    this.setState({
      cityInput: selection.value,
      searchSelection: {
        value: selection.label.id,
        label: selection.value
      }
    });
  }

  // used by SearchBar to submit city query and retrieve restaurants
  onSubmitCitySearch = event => {
    event.preventDefault();
    const {
      filteredRestaurants,
      searchSelection,
      searchSubmission
    } = this.state;

    this.setLoading(true);
    if (
      searchSelection &&
      searchSubmission &&
      (searchSelection.label === searchSubmission.label) &&
      !filteredRestaurants
    ) {
      this.setLoading(false);
      this.scrollToTop();
    } else {
      this.getRestaurants();
    }
  }

  // used by SearchResults pagination to retrieve restaurants for designated page
  onChangePage = (event, index) => {
    event.preventDefault();
    this.setLoading(true);
    let restaurants;

    if (this.state.filteredRestaurants) {
      restaurants = this.state.filteredRestaurants.slice(index * 20, (index * 20) + 20);
    } else {
      restaurants = this.state.allRestaurants.slice(index * 20, (index * 20) + 20);
    }

    const city = this.state.cities.find(city => city.id === `${this.state.searchSelection.value}`);
    if (city) {
      const restaurantsBE = city.restaurants;
      for (let i = 0; i < restaurantsBE.length; i += 1) {
        for (let j = 0; j < restaurants.length; j += 1) {
          if (restaurants[j].restaurant.id === restaurantsBE[i].id) {
            restaurants[j].restaurant.isAdded = true;
          }
        }
      }
    }

    this.setState({
      currentPage: index + 1,
      restaurants,
      scroll: true
    });
    this.setLoading(false);
  }

  // used by SearchResults to add restaurants to city passport
  onAddResToPassport = async (selection) => {
    const {
      cities,
      restaurants,
      searchSubmission
    } = this.state;
    let restaurant; let name; let restaurantsUpdate; let citiesUpdate;

    try {
      restaurant = await firebase.put(`/cities/${searchSubmission.value}/${selection.id}.json`, selection);
    } catch (error) {
      console.log(error);
      this.onOpenModal('error');
      this.setLoading(false);
    }
    try {
      const payload = { value: searchSubmission.label };
      name = await firebase.put(`/cities/${searchSubmission.value}/name/original.json`, payload);
    } catch (error) {
      console.log(error);
      this.onOpenModal('error');
      this.setLoading(false);
    }

    if (restaurant && name) {
      const cityIndex = cities.findIndex(city => city.id === `${searchSubmission.value}`);
      const resIndex = restaurants.findIndex(res => res.restaurant.id === selection.id);
      restaurantsUpdate = [
        ...restaurants.slice(0, resIndex),
        { restaurant: { ...restaurants[resIndex].restaurant, isAdded: true } },
        ...restaurants.slice(resIndex + 1),
      ];

      if (cityIndex > -1) {
        citiesUpdate = [
          ...cities.slice(0, cityIndex),
          {
            ...cities[cityIndex],
            restaurants: [
              ...cities[cityIndex].restaurants,
              { ...selection, isAdded: true }
            ]
          },
          ...cities.slice(cityIndex + 1)
        ];
      } else {
        const newCity = {
          id: `${searchSubmission.value}`,
          original: searchSubmission.label,
          custom: null,
          restaurants: [{ ...selection, isAdded: true }]
        };
        citiesUpdate = [ ...cities, newCity ];
      }

      this.setState({
        cities: citiesUpdate,
        restaurants: restaurantsUpdate,
        selectedRestaurant: selection.name,
        scroll: false
      });
      setTimeout(() => {
        this.setState({ selectedRestaurant: null });
      }, 2500);
    }
  }

  // used by ChangePassport to temporarily store user input: newPassportName
  onChangePassportName = event => this.setState({ newPassportName: event.target.value });

  // used by ChangePassportName to submit newPassportName to BE
  onSubmitPassportName = async (event) => {
    event.preventDefault();
    this.setLoading(true);

    const {
      currentCityId,
      newPassportName
    } = this.state;
    const payload = { value: newPassportName };

    try {
      await firebase.put(`/cities/${currentCityId}/name/custom.json`, payload);
      await this.getCities();
      this.onCloseModal('changePassportName');
    } catch(error) {
      console.log(error);
      this.onOpenModal('error');
      this.setLoading(false);
    }
  }

  // helper function used by ConfirmDeleteModal to determine what to delete
  // delete types: passport, restaurant
  onDelete = () => {
    if (this.state.currentResId) {
      this.handleDeleteRestaurant();
    } else {
      this.handleDeletePassport();
    }
  }

  // accessed through onDelete - used by PassportList to delete a passport
  handleDeletePassport = async () => {
    this.setLoading(true);
    const {
      cities,
      currentCityId
    } = this.state;

    try {
      await firebase.delete(`/cities/${currentCityId}.json`);
      const cityIndex = cities.findIndex(city => city.id === currentCityId);
      const citiesUpdate = [
        ...cities.slice(0, cityIndex),
        ...cities.slice(cityIndex + 1)
      ];

      this.setState({ cities: citiesUpdate });
      this.onCloseModal('delete');
      this.setLoading(false);
    } catch (error) {
      console.log(error);
      this.onOpenModal('error');
      this.setLoading(false);
    }
  }

  // accessed through onDelete - used by Passport to delete a restaurant
  handleDeleteRestaurant = async () => {
    this.setLoading(true);
    const {
      cities,
      currentResId,
      currentCityId
    } = this.state;

    try {
      await firebase.delete(`/cities/${currentCityId}/${currentResId}.json`);
      const cityIndex = cities.findIndex(city => city.id === currentCityId);
      const resIndex = cities[cityIndex].restaurants.findIndex(res => res.id === currentResId);
      const citiesUpdate = [
        ...cities.slice(0, cityIndex),
        {
          ...cities[cityIndex],
          restaurants: [
            ...cities[cityIndex].restaurants.slice(0, resIndex),
            ...cities[cityIndex].restaurants.slice(resIndex + 1),
          ]
        },
        ...cities.slice(cityIndex + 1)
      ];
      const passport = citiesUpdate[cityIndex];

      this.setState({
        cities: citiesUpdate,
        passport
      });
      this.onCloseModal('delete');
      this.setLoading(false);
    } catch (error) {
      console.log(error);
      this.onOpenModal('error');
      this.setLoading(false);
    }
  }

  // helper function used to close a modal
  // modal types: delete, changePassportName, passport, notes
  onToggleModal = type => {
    this.setState((prevState) => ({
      isModalOpen: {
        ...prevState.isModalOpen,
        [type]: !prevState.isModalOpen[type]
      }
    }));
  }

  // used to open a modal
  // modal types: delete (res or city), changePassportName, passport, notes
  onOpenModal = (type, id, event) => {
    let keyword = type;
    if (event) event.stopPropagation();
    if (keyword !== 'res' && keyword !== 'notes' && keyword !== 'error') {
      this.setState({ currentCityId: id });
    }
    if (keyword === 'res' && keyword === 'notes') {
      this.setState({ currentResId: id });
    }
    if (keyword === 'passport') {
      const city = this.state.cities.find(city => city.id === id);
      const restaurants = city.restaurants.map(res => {
        if (res.notes) {
          const notes = [];
          for (let i in res.notes) {
            notes.push({ ...res.notes[i], key: i });
          }
          res.notes = notes;
        }
        return res;
      })
      const passport = { ...city, restaurants };
      this.setState({ passport });
    }
    if (keyword === 'res' || keyword === 'city') {
      keyword = 'delete';
    }
    this.onToggleModal(keyword);
  }

  // used to close a modal
  // modal types: delete, changePassportName, passport, notes
  onCloseModal = type => {
    if (type === 'changePassportName') {
      this.setState({
        currentCityId: null,
        newPassportName: null
      });
    }
    if (type === 'passport') {
      this.setState({ passport: null });
    }
    if (type === 'notes') {
      this.setState({ notesInput: null });
    }
    this.onToggleModal(type);
  }

  // used to set state of isLoadingPage
  setLoading = isLoadingPage => this.setState({ isLoadingPage });

  // used by SearchResults to sort restaurants by category selected by user
  onSort = index => {
    this.setLoading(true);
    let restList;
    if (this.state.filteredRestaurants) {
      restList = this.state.filteredRestaurants.slice();
    } else {
      restList = this.state.allRestaurants.slice();
    }

    const highestToLowest = (property, subProperty) => {
      return subProperty ? restList.sort((a, b) =>
        (a.restaurant[property][subProperty] < b.restaurant[property][subProperty]) ? 1 : (
          (b.restaurant[property][subProperty] < a.restaurant[property][subProperty]) ? -1 : 0
        )
      ) : restList.sort((a, b) =>
        (a.restaurant[property] < b.restaurant[property]) ? 1 : (
          (b.restaurant[property] < a.restaurant[property]) ? -1 : 0
        )
      );
    }
    const lowestToHighest = (property, subProperty) => {
      return subProperty ? restList.sort((a, b) =>
        (a.restaurant[property][subProperty] > b.restaurant[property][subProperty]) ? 1 : (
          (b.restaurant[property][subProperty] > a.restaurant[property][subProperty]) ? -1 : 0
        )
      ) : restList.sort((a, b) =>
        (a.restaurant[property] > b.restaurant[property]) ? 1 : (
          (b.restaurant[property] > a.restaurant[property]) ? -1 : 0
        )
      );
    }

    const isOdd = index % 2 !== 0;
    const catIndex = Math.floor(index / 2);
    const categories = [
      { property: 'user_rating', subProperty: 'aggregate_rating' },
      { property: 'average_cost_for_two' },
      { property: 'price_range' }
    ];

    if (isOdd) {
      lowestToHighest(categories[catIndex].property, categories[catIndex].subProperty);
    } else {
      highestToLowest(categories[catIndex].property, categories[catIndex].subProperty);
    }

    if (this.state.filteredRestaurants) {
      this.setState({ filteredRestaurants: restList });
    } else {
      this.setState({ allRestaurants: restList });
    }

    const restaurants = restList.slice(0, 20);
    const city = this.state.cities.find(city => city.id === `${this.state.searchSelection.value}`);
    if (city) {
      const restaurantsBE = city.restaurants;
      for (let i = 0; i < restaurantsBE.length; i += 1) {
        for (let j = 0; j < restaurants.length; j += 1) {
          if (restaurants[j].restaurant.id === restaurantsBE[i].id) {
            restaurants[j].restaurant.isAdded = true;
          }
        }
      }
    }

    this.setState({
      currentPage: 1,
      restaurants,
      scroll: true
    });
  }

  // used by SearchResults to filter restaurants by category selected by user
  onFilter = index => {
    this.setLoading(true);
    const allRestaurants = this.state.allRestaurants.slice();
    let filter;

    if (index === 0) {
      filter = allRestaurants.filter(res => res.restaurant.user_rating.aggregate_rating > 4.5);
    }
    if (index === 1) {
      filter = allRestaurants.filter(res => res.restaurant.average_cost_for_two < 60);
    }
    if (index === 2) {
      filter = allRestaurants.filter(res => res.restaurant.price_range < 3);
    }

    const pages = [];
    let noPages = filter.length / 20;
    const noPagesRounded = noPages - Math.floor(noPages);
    noPages = (noPagesRounded > 0) ? (Math.floor(noPages) + 1) : Math.floor(noPages);
    noPages = (noPages > 5) ? 5 : noPages;
    for (let i = 0; i < noPages; i += 1) {
      pages.push(i + 1);
    }

    const restaurants = filter.slice(0, 20);
    const city = this.state.cities.find(city => city.id === `${this.state.searchSelection.value}`);
    if (city) {
      const restaurantsBE = city.restaurants;
      for (let i = 0; i < restaurantsBE.length; i += 1) {
        for (let j = 0; j < restaurants.length; j += 1) {
          if (restaurants[j].restaurant.id === restaurantsBE[i].id) {
            restaurants[j].restaurant.isAdded = true;
          }
        }
      }
    }

    this.setState({
      currentPage: 1,
      filteredRestaurants: filter,
      pages,
      restaurants,
      scroll: true
    });
  }

  // used by Notes to store user input for note
  onChangeNotes = (event) => {
    const notesInput = !event.target.value.length ? null : event.target.value;
    this.setState({ notesInput });
  }

  // used by Notes to store new note in BE
  onAddNote = async (event) => {
    event.preventDefault();
    this.setLoading(true);
    const date = new Date();
    const formattedDate = `${date.getMonth()}/${date.getDate()}/${date.getFullYear()}`;
    let key = date.toISOString();
    key = key.replace(/:|\./g, '-');
    const payload = {
      date: formattedDate,
      text: this.state.notesInput
    }

    try {
      await firebase.put(
        `/cities/${this.state.currentCityId}/${this.state.currentResId}/notes/${key}.json`,
        payload);

      const {
        passport,
        currentResId
      } = this.state;

      const resIndex = passport.restaurants.findIndex(res => res.id === currentResId);
      let notes = passport.restaurants[resIndex].notes;
      if (notes && !!notes.length) {
        notes.push({ ...payload, key });
      } else {
        notes = [ payload ];
      }

      const passportUpdate = {
        ...passport,
        restaurants: [
          ...passport.restaurants.slice(0, resIndex),
          { ...passport.restaurants[resIndex], notes },
          ...passport.restaurants.slice(resIndex + 1)
        ]
      }

      this.setState({ passport: passportUpdate });
      this.setLoading(false);
    } catch (error) {
      console.log(error);
      this.onOpenModal('error');
      this.setLoading(false);
    }
  }

  onDeleteNote = async (key) => {
    this.setLoading(true);

    try {
      await firebase.delete(
        `/cities/${this.state.currentCityId}/${this.state.currentResId}/notes/${key}.json`);

      const {
        passport,
        currentResId
      } = this.state;

      const resIndex = passport.restaurants.findIndex(res => res.id === currentResId);
      const notesIndex = passport.restaurants[resIndex].notes.findIndex(note => note.key === key);
      let notes = [
        ...passport.restaurants[resIndex].notes.slice(0, notesIndex),
        ...passport.restaurants[resIndex].notes.slice(notesIndex + 1),
      ];

      if (!notes.length) {
        notes = null;
      }
      
      const passportUpdate = {
        ...passport,
        restaurants: [
          ...passport.restaurants.slice(0, resIndex),
          { ...passport.restaurants[resIndex], notes },
          ...passport.restaurants.slice(resIndex + 1)
        ]
      }

      this.setState({ passport: passportUpdate });
      this.setLoading(false);
    } catch(error) {
      console.log(error);
      this.onOpenModal('error');
      this.setLoading(false);
    }
  }

  onCloseNotification = () => this.setState({ selectedRestaurant: null });

  componentDidMount() {
    this.getCities();
  }

  render() {
    const {
      cities,
      citySuggestions,
      currentPage,
      currentResId,
      errorMessage,
      isLoadingPage,
      isLoadingCitySuggestions,
      isModalOpen,
      notesInput,
      pages,
      passport,
      restaurants,
      scroll,
      searchSelection,
      searchSubmission,
      selectedRestaurant,
      cityInput
    } = this.state;

    return (
      <Router>
        <div className="App">
          <div className="window">
            <Header
              onCloseNotification={this.onCloseNotification}
              selectedRestaurant={selectedRestaurant} />
            <Nav />
            <main>
              <Route path={`${process.env.PUBLIC_URL}`} exact render={() => (
                <Fragment>
                  <SearchBar
                    citySuggestions={citySuggestions}
                    errorMessage={errorMessage}
                    isLoadingCitySuggestions={isLoadingCitySuggestions}
                    onChangeCity={this.onChangeCity}
                    onSelectCity={this.onSelectCity}
                    onSubmitCitySearch={this.onSubmitCitySearch}
                    searchSelection={searchSelection}
                    setErrorMessage={this.setErrorMessage}
                    cityInput={cityInput} />
                  <SearchResults
                    currentPage={currentPage}
                    onChangePage={this.onChangePage}
                    onFilter={this.onFilter}
                    onSort={this.onSort}
                    pages={pages}
                    restaurants={restaurants}
                    scroll={scroll}
                    scrollToBottom={this.scrollToBottom}
                    scrollToTop={this.scrollToTop}
                    searchSubmission={searchSubmission}
                    setLoading={this.setLoading}
                    onAddResToPassport={this.onAddResToPassport} />
                </Fragment>
              )} />
              <Route path={`${process.env.PUBLIC_URL}/passport-list`} exact render={() =>
                <PassportList
                  cities={cities}
                  onOpenModal={this.onOpenModal}
                  setLoading={this.setLoading} />
              } />
              <Route path={`${process.env.PUBLIC_URL}/credits`} exact render={() =>
                <Credits />
              } />
            </main>
          </div>
          <ChangePassportName
            onChangePassportName={this.onChangePassportName}
            onSubmitPassportName={this.onSubmitPassportName}
            isModalOpen={isModalOpen.changePassportName}
            onCloseModal={() => this.onCloseModal('changePassportName')} />
          <Passport
            isModalOpen={isModalOpen.passport}
            onCloseModal={() => this.onCloseModal('passport')}
            onOpenModal={this.onOpenModal}
            passport={passport} />
          <Notes
            currentResId={currentResId}
            isModalOpen={isModalOpen.notes}
            notesInput={notesInput}
            onAddNote={this.onAddNote}
            onChangeNotes={this.onChangeNotes}
            onCloseModal={() => this.onCloseModal('notes')}
            onDeleteNote={this.onDeleteNote}
            passport={passport}
            setLoading={this.setLoading} />
          <ConfirmDelete
            onCloseModal={() => this.onCloseModal('delete')}
            onDelete={this.onDelete}
            isModalOpen={isModalOpen.delete}
            keyword={currentResId ? 'restaurant' : 'passport'} />
          <Error
            isModalOpen={isModalOpen.error} />
          <Loader
            isLoadingPage={isLoadingPage} />
        </div> 
      </Router>
    );
  }
}

export default App;