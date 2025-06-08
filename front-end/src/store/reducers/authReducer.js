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
  
  const initialState = {
    token: localStorage.getItem('token'),
    isAuthenticated: null,
    loading: false,
    user: null,
    error: null,
    success: false
  };
  
  function authReducer(state = initialState, action) {
    const { type, payload } = action;
  
    switch (type) {
      case AUTH_LOADING:
        return {
          ...state,
          loading: true,
          error: null
        };
      case USER_LOADED:
        return {
          ...state,
          isAuthenticated: true,
          loading: false,
          user: payload,
          error: null
        };
      case REGISTER_SUCCESS:
      case LOGIN_SUCCESS:
        localStorage.setItem('token', payload.token);
        return {
          ...state,
          ...payload,
          isAuthenticated: true,
          loading: false,
          error: null
        };
      case FORGOT_PASSWORD_SUCCESS:
        return {
          ...state,
          loading: false,
          success: true,
          error: null
        };
      case RESET_PASSWORD_SUCCESS:
        return {
          ...state,
          loading: false,
          success: true,
          error: null
        };
      case REGISTER_FAIL:
      case LOGIN_FAIL:
      case AUTH_ERROR:
      case FORGOT_PASSWORD_FAIL:
      case RESET_PASSWORD_FAIL:
        localStorage.removeItem('token');
        return {
          ...state,
          token: null,
          isAuthenticated: false,
          loading: false,
          user: null,
          error: payload,
          success: false
        };
      case LOGOUT:
        localStorage.removeItem('token');
        return {
          ...state,
          token: null,
          isAuthenticated: false,
          loading: false,
          user: null,
          error: null,
          success: false
        };
      default:
        return state;
    }
  }
  
  export default authReducer;
  