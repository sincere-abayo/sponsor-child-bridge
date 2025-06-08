import api from '../../utils/api';
import { setAlert } from './alertActions';
import {
  GET_PROFILE,
  UPDATE_PROFILE,
  PROFILE_ERROR,
  PROFILE_LOADING,
  UPLOAD_PROFILE_IMAGE_SUCCESS,
  UPLOAD_PROFILE_IMAGE_FAIL
} from '../types';
;

// Get current user's profile
export const getProfile = () => async dispatch => {
  try {
    dispatch({ type: PROFILE_LOADING });
    
    const res = await api.get('/api/profile');

    dispatch({
      type: GET_PROFILE,
      payload: res.data
    });
  } catch (err) {
    dispatch({
      type: PROFILE_ERROR,
      payload: err.response?.data?.message || 'Failed to load profile'
    });
  }
};

// Update profile
export const updateProfile = (profileData) => async dispatch => {
  try {
    dispatch({ type: PROFILE_LOADING });
    
    const res = await api.put('/api/profile', profileData);

    dispatch({
      type: UPDATE_PROFILE,
      payload: res.data
    });

    dispatch(setAlert('Profile updated successfully', 'success'));
  } catch (err) {
    const errors = err.response?.data?.errors;

    if (errors) {
      errors.forEach(error => dispatch(setAlert(error.msg, 'error')));
    }

    dispatch({
      type: PROFILE_ERROR,
      payload: err.response?.data?.message || 'Failed to update profile'
    });
  }
};

// Upload profile image
export const uploadProfileImage = (formData) => async (dispatch, getState) => {
  try {
    dispatch({ type: PROFILE_LOADING });
    
    // Get the user's role from the state
    const { role } = getState().auth.user;
    
    // Determine the correct endpoint based on the user's role
    const endpoint = role === 'sponsor' 
      ? '/api/sponsors/profile/image' 
      : '/api/receivers/profile/image';
    
    // Don't manually set Content-Type header for FormData
    // The browser will automatically set the correct multipart/form-data boundary
    const res = await api.post(endpoint, formData);
    
    dispatch({
      type: UPLOAD_PROFILE_IMAGE_SUCCESS,
      payload: res.data
    });
    
    dispatch(setAlert('Profile image uploaded successfully', 'success'));
    return Promise.resolve(res.data);
  } catch (err) {
    console.error('Upload error:', err);
    
    const errors = err.response?.data?.errors;
    
    if (errors) {
      errors.forEach(error => dispatch(setAlert(error.msg, 'error')));
    }
    
    dispatch({
      type: UPLOAD_PROFILE_IMAGE_FAIL,
      payload: err.response?.data?.message || 'Failed to upload profile image'
    });
    
    dispatch(setAlert('Failed to upload profile image', 'error'));
    return Promise.reject(err);
  }
};

