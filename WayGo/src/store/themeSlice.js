import { createSlice } from '@reduxjs/toolkit';
import lightTheme from '../theme/light';
import darkTheme from '../theme/dark';
import { saveThemeMode, getThemeMode } from '../utils/storage';

const initialState = {
  mode: 'light',
  theme: lightTheme,
  isReady: false,
};

const themeSlice = createSlice({
  name: 'theme',
  initialState,
  reducers: {
    setThemeMode(state, action) {
      const mode = action.payload;
      state.mode = mode;
      state.theme = mode === 'dark' ? darkTheme : lightTheme;
    },
    markThemeReady(state) {
      state.isReady = true;
    },
  },
});

export const { setThemeMode, markThemeReady } = themeSlice.actions;

export const hydrateTheme = () => async (dispatch) => {
  const storedMode = await getThemeMode();
  if (storedMode) {
    dispatch(setThemeMode(storedMode));
  }
  dispatch(markThemeReady());
};

export const toggleTheme = () => async (dispatch, getState) => {
  const currentMode = getState().theme.mode;
  const nextMode = currentMode === 'light' ? 'dark' : 'light';
  dispatch(setThemeMode(nextMode));
  await saveThemeMode(nextMode);
};

export default themeSlice.reducer;

