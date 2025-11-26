import { DarkTheme } from '@react-navigation/native';

const darkTheme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    background: '#0D1B2A',
    card: '#1B263B',
    text: '#E0E6ED',
    border: '#415A77',
    primary: '#69A1FF',
    notification: '#FFB347',
  },
  fonts: {
    ...DarkTheme.fonts,
    regular: { fontFamily: 'System', fontWeight: '400' },
    medium: { fontFamily: 'System', fontWeight: '500' },
    bold: { fontFamily: 'System', fontWeight: '700' },
  },
};

export default darkTheme;

