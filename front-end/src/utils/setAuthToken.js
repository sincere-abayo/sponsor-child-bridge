import axios from 'axios';
import api from '../utils/api';

const setAuthToken = token => {
  if (token) {
    // Set for both axios and your custom api instance
    axios.defaults.headers.common['x-auth-token'] = token;
    api.defaults.headers.common['x-auth-token'] = token;
  } else {
    // Remove from both
    delete axios.defaults.headers.common['x-auth-token'];
    delete api.defaults.headers.common['x-auth-token'];
  }
};

export default setAuthToken;
