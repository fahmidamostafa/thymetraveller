import axios from 'axios';

const instance = axios.create({
  baseURL: 'https://thymetravellernew.firebaseio.com/'
});

export default instance;