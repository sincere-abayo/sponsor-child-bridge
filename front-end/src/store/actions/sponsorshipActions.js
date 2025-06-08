import axios from 'axios';
import { setAlert } from './alertActions';
import {
  GET_SPONSORSHIPS,
  GET_SPONSORSHIP,
  CREATE_SPONSORSHIP,
  UPDATE_SPONSORSHIP,
  DELETE_SPONSORSHIP,
  SPONSORSHIP_ERROR,
  SPONSORSHIP_LOADING,
  CONFIRM_SPONSORSHIP,
  UPLOAD_PROOF
} from '../types';

// Get all sponsorships
export const getSponshorships = () => async dispatch => {
  try {
    dispatch({ type: SPONSORSHIP_LOADING });
    
    const res = await axios.get('/api/sponsorships');

    dispatch({
      type: GET_SPONSORSHIPS,
      payload: res.data
    });
  } catch (err) {
    dispatch({
      type: SPONSORSHIP_ERROR,
      payload: err.response?.data?.message || 'Failed to load sponsorships'
    });
  }
};

// Get sponsorship by ID
export const getSponsorshipById = (id) => async dispatch => {
  try {
    dispatch({ type: SPONSORSHIP_LOADING });
    
    const res = await axios.get(`/api/sponsorships/${id}`);

    dispatch({
      type: GET_SPONSORSHIP,
      payload: res.data
    });
  } catch (err) {
    dispatch({
      type: SPONSORSHIP_ERROR,
      payload: err.response?.data?.message || 'Failed to load sponsorship'
    });
  }
};

// Create new sponsorship
export const createSponsorship = (sponsorshipData) => async dispatch => {
  try {
    dispatch({ type: SPONSORSHIP_LOADING });
    
    const res = await axios.post('/api/sponsorships', sponsorshipData);

    dispatch({
      type: CREATE_SPONSORSHIP,
      payload: res.data
    });

    dispatch(setAlert('Sponsorship created successfully', 'success'));
    return res.data;
  } catch (err) {
    dispatch({
      type: SPONSORSHIP_ERROR,
      payload: err.response?.data?.message || 'Failed to create sponsorship'
    });
    throw err;
  }
};

// Update sponsorship
export const updateSponsorship = (id, sponsorshipData) => async dispatch => {
  try {
    dispatch({ type: SPONSORSHIP_LOADING });
    
    const res = await axios.put(`/api/sponsorships/${id}`, sponsorshipData);

    dispatch({
      type: UPDATE_SPONSORSHIP,
      payload: res.data
    });

    dispatch(setAlert('Sponsorship updated successfully', 'success'));
  } catch (err) {
    dispatch({
      type: SPONSORSHIP_ERROR,
      payload: err.response?.data?.message || 'Failed to update sponsorship'
    });
  }
};

// Delete sponsorship
export const deleteSponsorship = (id) => async dispatch => {
  try {
    dispatch({ type: SPONSORSHIP_LOADING });
    
    await axios.delete(`/api/sponsorships/${id}`);

    dispatch({
      type: DELETE_SPONSORSHIP,
      payload: id
    });

    dispatch(setAlert('Sponsorship deleted successfully', 'success'));
  } catch (err) {
    dispatch({
      type: SPONSORSHIP_ERROR,
      payload: err.response?.data?.message || 'Failed to delete sponsorship'
    });
  }
};

// Confirm sponsorship
export const confirmSponsorship = (id) => async dispatch => {
  try {
    dispatch({ type: SPONSORSHIP_LOADING });
    
    const res = await axios.put(`/api/sponsorships/${id}/confirm`);

    dispatch({
      type: CONFIRM_SPONSORSHIP,
      payload: res.data
    });

    dispatch(setAlert('Sponsorship confirmed successfully', 'success'));
  } catch (err) {
    dispatch({
      type: SPONSORSHIP_ERROR,
      payload: err.response?.data?.message || 'Failed to confirm sponsorship'
    });
  }
};

// Upload proof of payment
export const uploadProof = (id, formData) => async dispatch => {
  try {
    dispatch({ type: SPONSORSHIP_LOADING });
    
    const config = {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    };
    
    const res = await axios.post(`/api/sponsorships/${id}/upload-proof`, formData, config);

    dispatch({
      type: UPLOAD_PROOF,
      payload: res.data
    });

    dispatch(setAlert('Proof uploaded successfully', 'success'));
  } catch (err) {
    dispatch({
      type: SPONSORSHIP_ERROR,
      payload: err.response?.data?.message || 'Failed to upload proof'
    });
  }
};