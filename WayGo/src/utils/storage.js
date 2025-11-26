import AsyncStorage from '@react-native-async-storage/async-storage';

const AUTH_KEY = '@waygo/auth';
const FAVORITES_KEY = '@waygo/favorites';
const THEME_KEY = '@waygo/theme';

export const saveAuthData = async ({ user, token }) => {
  const payload = JSON.stringify({ user, token });
  await AsyncStorage.setItem(AUTH_KEY, payload);
};

export const getAuthData = async () => {
  const stored = await AsyncStorage.getItem(AUTH_KEY);
  return stored ? JSON.parse(stored) : null;
};

export const clearAuthData = async () => {
  await AsyncStorage.removeItem(AUTH_KEY);
};

export const saveFavorites = async (favorites) => {
  await AsyncStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
};

export const getFavorites = async () => {
  const stored = await AsyncStorage.getItem(FAVORITES_KEY);
  return stored ? JSON.parse(stored) : [];
};

export const saveThemeMode = async (mode) => {
  await AsyncStorage.setItem(THEME_KEY, mode);
};

export const getThemeMode = async () => AsyncStorage.getItem(THEME_KEY);

