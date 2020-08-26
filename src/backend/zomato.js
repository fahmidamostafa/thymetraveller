import axios from 'axios';

const instance = axios.create({
  baseURL: 'https://developers.zomato.com/api/v2.1/'
});

export default instance;