import { configureStore } from '@reduxjs/toolkit';

// Reducers
import authReducer from './reducers/authReducer';
import alertReducer from './reducers/alertReducer';
import profileReducer from './reducers/profileReducer';
import sponsorshipReducer from './reducers/sponsorshipReducer';
import messageReducer from './reducers/messageReducer';
import notificationReducer from './reducers/notificationReducer';
import reportReducer from './reducers/reportReducer';

const store = configureStore({
  reducer: {
    auth: authReducer,
    alert: alertReducer,
    profile: profileReducer,
    sponsorships: sponsorshipReducer,
    messages: messageReducer,
    notifications: notificationReducer,
    reports: reportReducer
  },
  // Redux Toolkit includes thunk middleware by default
  // and sets up the Redux DevTools extension automatically
});

export default store;
