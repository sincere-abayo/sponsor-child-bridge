import { setAlert } from './alertActions';
import api from '../../utils/api';
import {
  REGISTER_SUCCESS,
  REGISTER_FAIL,
  LOGIN_SUCCESS,
  LOGIN_FAIL,
  LOGOUT,
  USER_LOADED,
  AUTH_ERROR,
  FORGOT_PASSWORD_SUCCESS,
  FORGOT_PASSWORD_FAIL,
  RESET_PASSWORD_SUCCESS,
  RESET_PASSWORD_FAIL,
  AUTH_LOADING
} from '../types';
import setAuthToken from '../../utils/setAuthToken';

// Load User
export const loadUser = () => async dispatch => {
  if (localStorage.token) {
    setAuthToken(localStorage.token);
  }

  try {
    dispatch({ type: AUTH_LOADING });
    console.log('Loading user data...');
    
    const res = await api.get('/api/auth/user');
    console.log('User data loaded:', res.data);

    dispatch({
      type: USER_LOADED,
      payload: res.data
    });
  } catch (err) {
    console.error('Error loading user:', err);
    dispatch({
      type: AUTH_ERROR
    });
  }
};



// Register User
export const register = (userData, navigate) => async dispatch => {
  console.log('Register action called with:', userData);

  try {
    dispatch({ type: AUTH_LOADING });
    console.log('Making API request to register user');
    
    const res = await api.post('/api/auth/register', userData);
    console.log('Registration API response:', res.data);

    // Store token in localStorage first
    localStorage.setItem('token', res.data.token);
    
    // Set auth token in headers
    setAuthToken(res.data.token);

    dispatch({
      type: REGISTER_SUCCESS,
      payload: res.data
    });

    // Navigate to dashboard immediately after successful registration
    // This ensures navigation happens even if loadUser fails
    if (navigate) {
      console.log('Navigating to dashboard after registration');
      navigate('/dashboard');
    }

    // Load user data after navigation
    console.log('Dispatched REGISTER_SUCCESS, now loading user...');
    dispatch(loadUser());
    console.log('User loading dispatched');
    
    dispatch(setAlert('Registration successful! Welcome to Sponsor Bridge.', 'success'));
  } catch (err) {
    console.error('Registration error:', err);
    const errors = err.response?.data?.errors;

    if (errors) {
      errors.forEach(error => dispatch(setAlert(error.msg, 'error')));
    }

    dispatch({
      type: REGISTER_FAIL,
      payload: err.response?.data?.message || 'Registration failed. Please try again.'
    });
  }
};




// Login User
export const login = (email, password, navigate) => async dispatch => {
  const config = {
    headers: {
      'Content-Type': 'application/json'
    }
  };

  const body = JSON.stringify({ email, password });

  try {
    dispatch({ type: AUTH_LOADING });
    
    console.log('Making login request...');
    const res = await api.post('/api/auth/login', body, config);
    console.log('Login response:', res.data);

    // Store token in localStorage first
    localStorage.setItem('token', res.data.token);
    
    // Set auth token in headers
    setAuthToken(res.data.token);

    dispatch({
      type: LOGIN_SUCCESS,
      payload: res.data
    });

    // Navigate to dashboard immediately after successful login
    // This ensures navigation happens even if loadUser fails
    if (navigate) {
      console.log('Navigating to dashboard');
      navigate('/dashboard');
    }

    // Load user data after navigation
    console.log('Dispatched LOGIN_SUCCESS, now loading user...');
    dispatch(loadUser());
    console.log('User loading dispatched');
    
    dispatch(setAlert('Login successful! Welcome back.', 'success'));
  } catch (err) {
    console.error('Login error:', err);
    const errors = err.response?.data?.errors;

    if (errors) {
      errors.forEach(error => dispatch(setAlert(error.msg, 'error')));
    }

    dispatch({
      type: LOGIN_FAIL,
      payload: err.response?.data?.message || 'Invalid credentials. Please try again.'
    });
  }
};



// Logout
export const logout = () => dispatch => {
    dispatch({ type: LOGOUT });
    dispatch(setAlert('You have been logged out.', 'info'));
  };
  
  // Forgot Password
  export const forgotPassword = (email) => async dispatch => {
    const config = {
      headers: {
        'Content-Type': 'application/json'
      }
    };
  
    const body = JSON.stringify({ email });
  
    try {
      dispatch({ type: AUTH_LOADING });
      
      const res = await api.post('/api/auth/forgot-password', body, config);
  
      dispatch({
        type: FORGOT_PASSWORD_SUCCESS,
        payload: res.data
      });
  
      dispatch(setAlert('Password reset link sent to your email.', 'success'));
      return Promise.resolve();
    } catch (err) {
      const errors = err.response.data.errors;
  
      if (errors) {
        errors.forEach(error => dispatch(setAlert(error.msg, 'error')));
      }
  
      dispatch({
        type: FORGOT_PASSWORD_FAIL,
        payload: err.response.data.message || 'Failed to send reset link. Please try again.'
      });
      
      return Promise.reject();
    }
  };
  
  // Reset Password
  export const resetPassword = (token, password) => async dispatch => {
    const config = {
      headers: {
        'Content-Type': 'application/json'
      }
    };
  
    const body = JSON.stringify({ token, password });
  
    try {
      dispatch({ type: AUTH_LOADING });
      
      const res = await api.post('/api/auth/reset-password', body, config);
  
      dispatch({
        type: RESET_PASSWORD_SUCCESS,
        payload: res.data
      });
  
      dispatch(setAlert('Password has been reset successfully.', 'success'));
      return Promise.resolve();
    } catch (err) {
      const errors = err.response.data.errors;
  
      if (errors) {
        errors.forEach(error => dispatch(setAlert(error.msg, 'error')));
      }
  
      dispatch({
        type: RESET_PASSWORD_FAIL,
        payload: err.response.data.message || 'Failed to reset password. Please try again.'
      });
      
      return Promise.reject();
    }
  };