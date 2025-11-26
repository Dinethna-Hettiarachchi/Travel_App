/**
 * Custom hook to get theme-aware colors
 * Returns colors that automatically change based on dark/light mode
 */

import { useSelector } from 'react-redux';
import { getColors } from '../constants/colors';

export const useThemeColors = () => {
  const { mode } = useSelector((state) => state.theme);
  const isDark = mode === 'dark';
  return getColors(isDark);
};

export default useThemeColors;
