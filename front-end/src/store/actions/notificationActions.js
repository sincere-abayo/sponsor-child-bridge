import axios from 'axios';
import {
  GET_NOTIFICATIONS,
  GET_UNREAD_NOTIFICATIONS_COUNT,
  MARK_NOTIFICATION_READ,
  NOTIFICATION_ERROR,
  NOTIFICATION_LOADING
} from '../types';

// Get all notifications
export const getNotifications = () => async dispatch => {
  try {
    dispatch({ type: NOTIFICATION_LOADING });
    
    const res = await axios.get('/api/notifications');

    dispatch({
      type: GET_NOTIFICATIONS,
      payload: res.data
    });
  } catch (err) {
    dispatch({
      type: NOTIFICATION_ERROR,
      payload: err.response?.data?.message || 'Failed to load notifications'
    });
  }
};

// Get count of unread notifications
export const getUnreadNotificationsCount = () => async dispatch => {
  try {
    const res = await axios.get('/api/notifications/unread/count');

    dispatch({
      type: GET_UNREAD_NOTIFICATIONS_COUNT,
      payload: res.data.count
    });
  } catch (err) {
    dispatch({
      type: NOTIFICATION_ERROR,
      payload: err.response?.data?.message || 'Failed to get unread notifications count'
    });
  }
};

// Mark notification as read
export const markNotificationAsRead = (notificationId) => async dispatch => {
  try {
    const res = await axios.put(`/api/notifications/${notificationId}/read`);

    dispatch({
      type: MARK_NOTIFICATION_READ,
      payload: res.data
    });
  } catch (err) {
    dispatch({
      type: NOTIFICATION_ERROR,
      payload: err.response?.data?.message || 'Failed to mark notification as read'
    });
  }
};