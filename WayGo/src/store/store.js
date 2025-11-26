/**
 * Redux Store Configuration
 *
 * State Management Structure for Assignment Requirements:
 * - auth: User authentication state (login, register, session)
 * - transport: Bus stops, live departures, and favorites
 * - theme: Dark/light mode toggle (Bonus Feature)
 *
 * Middleware Configuration:
 * - serializableCheck disabled for handling AsyncStorage and navigation objects
 */

import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/redux/authSlice';
import transportReducer from '../features/transport/redux/transportSlice';
import themeReducer from './themeSlice';

const store = configureStore({
  reducer: {
    auth: authReducer,           // Authentication & user session management
    transport: transportReducer, // Bus stops, departures, favorites
    theme: themeReducer,         // Dark/Light mode (Bonus feature)
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // Required for AsyncStorage & navigation params
    }),
});

export default store;

