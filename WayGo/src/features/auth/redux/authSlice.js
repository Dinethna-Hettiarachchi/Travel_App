import { createSlice } from '@reduxjs/toolkit';
import { loginUser, registerUser } from '../../../api/authApi';
import { saveAuthData, clearAuthData } from '../../../utils/storage';
import { clearTransportState } from '../../transport/redux/transportSlice';

const initialState = {
  user: null,
  token: null,
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginStart(state) {
      state.loading = true;
      state.error = null;
    },
    loginSuccess(state, action) {
      state.loading = false;
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.error = null;
    },
    loginFailure(state, action) {
      state.loading = false;
      state.error = action.payload;
    },
    logout(state) {
      state.user = null;
      state.token = null;
      state.loading = false;
      state.error = null;
    },
    restoreSession(state, action) {
      state.user = action.payload?.user || null;
      state.token = action.payload?.token || null;
    },
  },
});

export const { loginStart, loginSuccess, loginFailure, logout, restoreSession } = authSlice.actions;

const mapAuthPayload = (data) => ({
  user: {
    id: data.id,
    username: data.username,
    email: data.email,
    firstName: data.firstName,
    lastName: data.lastName,
    image: data.image,
  },
  token: data.token,
});

export const login = (credentials) => async (dispatch) => {
  try {
    dispatch(loginStart());
    const response = await loginUser(credentials);
    const payload = mapAuthPayload(response);
    await saveAuthData(payload);
    dispatch(loginSuccess(payload));
  } catch (error) {
    dispatch(loginFailure(error.message));
  }
};

const buildFallbackPayload = (userData, defaults) => ({
  user: {
    id: userData?.id || Date.now(),
    username: userData?.username || defaults.username,
    email: userData?.email || defaults.email,
    firstName: userData?.firstName || defaults.firstName,
    lastName: userData?.lastName || defaults.lastName,
    image: userData?.image || null,
  },
  token: `mock-${Date.now()}`,
});

export const register = (data) => async (dispatch) => {
  try {
    dispatch(loginStart());
    const sanitizedPayload = {
      username: data.username.trim(),
      password: data.password,
      firstName: data.firstName || data.username,
      lastName: data.lastName || 'Traveler',
      email: data.email || `${data.username}@example.com`,
    };

    const createdUser = await registerUser(sanitizedPayload);

    try {
      const response = await loginUser({
        username: sanitizedPayload.username,
        password: sanitizedPayload.password,
      });
      const payload = mapAuthPayload(response);
      await saveAuthData(payload);
      dispatch(loginSuccess(payload));
    } catch (loginError) {
      const fallbackPayload = buildFallbackPayload(createdUser, sanitizedPayload);
      await saveAuthData(fallbackPayload);
      dispatch(loginSuccess(fallbackPayload));
    }
  } catch (error) {
    dispatch(loginFailure(error.message));
  }
};

export const performLogout = () => async (dispatch) => {
  await clearAuthData();
  dispatch(clearTransportState());
  dispatch(logout());
};

export default authSlice.reducer;

