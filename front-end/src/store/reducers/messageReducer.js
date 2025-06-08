import {
  GET_MESSAGES,
  GET_MESSAGE_THREAD,
  SEND_MESSAGE,
  MESSAGE_ERROR,
  MESSAGE_LOADING,
  GET_UNREAD_MESSAGES_COUNT,
  MARK_MESSAGE_READ
} from '../types';

const initialState = {
  messages: [],
  thread: [],
  unreadCount: 0,
  loading: false,
  error: null
};

function messageReducer(state = initialState, action) {
  const { type, payload } = action;

  switch (type) {
    case MESSAGE_LOADING:
      return {
        ...state,
        loading: true,
        error: null
      };
    case GET_MESSAGES:
      return {
        ...state,
        messages: payload,
        loading: false,
        error: null
      };
    case GET_MESSAGE_THREAD:
      return {
        ...state,
        thread: payload,
        loading: false,
        error: null
      };
    case SEND_MESSAGE:
      return {
        ...state,
        thread: [...state.thread, payload],
        loading: false,
        error: null
      };
    case GET_UNREAD_MESSAGES_COUNT:
      return {
        ...state,
        unreadCount: payload,
        loading: false,
        error: null
      };
    case MARK_MESSAGE_READ:
      return {
        ...state,
        thread: state.thread.map(message =>
          message.id === payload.id ? { ...message, is_read: true } : message
        ),
        unreadCount: state.unreadCount > 0 ? state.unreadCount - 1 : 0,
        loading: false,
        error: null
      };
    case MESSAGE_ERROR:
      return {
        ...state,
        loading: false,
        error: payload
      };
    default:
      return state;
  }
}

export default messageReducer;