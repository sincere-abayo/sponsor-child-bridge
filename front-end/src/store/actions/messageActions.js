import axios from 'axios';
import { setAlert } from './alertActions';
import {
  GET_MESSAGES,
  GET_MESSAGE_THREAD,
  SEND_MESSAGE,
  MESSAGE_ERROR,
  MESSAGE_LOADING,
  GET_UNREAD_MESSAGES_COUNT,
  MARK_MESSAGE_READ
} from '../types';

// Get all messages
export const getMessages = () => async dispatch => {
  try {
    dispatch({ type: MESSAGE_LOADING });
    
    const res = await axios.get('/api/messages');

    dispatch({
      type: GET_MESSAGES,
      payload: res.data
    });
  } catch (err) {
    dispatch({
      type: MESSAGE_ERROR,
      payload: err.response?.data?.message || 'Failed to load messages'
    });
  }
};

// Get message thread with a specific user
export const getMessageThread = (userId) => async dispatch => {
  try {
    dispatch({ type: MESSAGE_LOADING });
    
    const res = await axios.get(`/api/messages/thread/${userId}`);

    dispatch({
      type: GET_MESSAGE_THREAD,
      payload: res.data
    });
  } catch (err) {
    dispatch({
      type: MESSAGE_ERROR,
      payload: err.response?.data?.message || 'Failed to load message thread'
    });
  }
};

// Send a message
export const sendMessage = (receiverId, content) => async dispatch => {
  try {
    dispatch({ type: MESSAGE_LOADING });
    
    const config = {
      headers: {
        'Content-Type': 'application/json'
      }
    };
    
    const body = JSON.stringify({ receiver_id: receiverId, content });
    
    const res = await axios.post('/api/messages', body, config);

    dispatch({
      type: SEND_MESSAGE,
      payload: res.data
    });
  } catch (err) {
    dispatch({
      type: MESSAGE_ERROR,
      payload: err.response?.data?.message || 'Failed to send message'
    });
    
    dispatch(setAlert('Failed to send message', 'error'));
  }
};

// Get count of unread messages
export const getUnreadMessagesCount = () => async dispatch => {
  try {
    const res = await axios.get('/api/messages/unread/count');

    dispatch({
      type: GET_UNREAD_MESSAGES_COUNT,
      payload: res.data.count
    });
  } catch (err) {
    dispatch({
      type: MESSAGE_ERROR,
      payload: err.response?.data?.message || 'Failed to get unread messages count'
    });
  }
};

// Mark message as read
export const markMessageAsRead = (messageId) => async dispatch => {
  try {
    const res = await axios.put(`/api/messages/${messageId}/read`);

    dispatch({
      type: MARK_MESSAGE_READ,
      payload: res.data
    });
  } catch (err) {
    dispatch({
      type: MESSAGE_ERROR,
      payload: err.response?.data?.message || 'Failed to mark message as read'
    });
  }
};
