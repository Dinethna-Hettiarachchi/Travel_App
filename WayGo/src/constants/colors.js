// Light theme colors (default)
const lightColors = {
  primary: '#0F52BA',
  secondary: '#FF8C42',
  background: '#F7F9FC',
  card: '#FFFFFF',
  border: '#E0E6ED',
  textPrimary: '#0D1B2A',
  textSecondary: '#415A77',
  textOnPrimary: '#FFFFFF',
  muted: '#9AA5B1',
  error: '#D90429',
  success: '#2D6A4F',
  shadow: 'rgba(13, 27, 42, 0.08)',
};

// Dark theme colors
const darkColors = {
  primary: '#69A1FF',
  secondary: '#FFB347',
  background: '#0D1B2A',
  card: '#1B263B',
  border: '#415A77',
  textPrimary: '#E0E6ED',
  textSecondary: '#9AA5B1',
  textOnPrimary: '#FFFFFF',
  muted: '#6B7B8C',
  error: '#FF6B6B',
  success: '#51CF66',
  shadow: 'rgba(0, 0, 0, 0.3)',
};

// Export function to get colors based on theme mode
export const getColors = (isDark) => (isDark ? darkColors : lightColors);

// Export default light colors for backward compatibility
export default lightColors;

