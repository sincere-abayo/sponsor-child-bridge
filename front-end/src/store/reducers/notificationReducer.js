import {
  GET_NOTIFICATIONS,
  GET_UNREAD_NOTIFICATIONS_COUNT,
  MARK_NOTIFICATION_READ,
  NOTIFICATION_ERROR,
  NOTIFICATION_LOADING
} from '../types';

const initialState = {
  notifications: [],
  unreadCount: 0,
  loading: false,
  error: null
};

function notificationReducer(state = initialState, action) {
  const { type, payload } = action;

  switch (type) {
    case NOTIFICATION_LOADING:
      return {
        ...state,
        loading: true,
        error: null
      };
    case GET_NOTIFICATIONS:
      return {
        ...state,
        notifications: payload,
        loading: false,
        error: null
      };
    case GET_UNREAD_NOTIFICATIONS_COUNT:
      return {
        ...state,
        unreadCount: payload,
        loading: false,
        error: null
      };
    case MARK_NOTIFICATION_READ:
      return {
        ...state,
        notifications: state.notifications.map(notification =>
          notification.id === payload.id ? { ...notification, is_read: true } : notification
        ),
        unreadCount: state.unreadCount > 0 ? state.unreadCount - 1 : 0,
        loading: false,
        error: null
      };
    case NOTIFICATION_ERROR:
      return {
        ...state,
        loading: false,
        error: payload
      };
    default:
      return state;
  }
}

export default notificationReducer;