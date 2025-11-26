import { DefaultTheme } from '@react-navigation/native';

const lightTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: '#F7F9FC',
    card: '#FFFFFF',
    text: '#0D1B2A',
    border: '#E0E6ED',
    primary: '#0F52BA',
    notification: '#FF8C42',
  },
  fonts: {
    ...DefaultTheme.fonts,
    regular: { fontFamily: 'System', fontWeight: '400' },
    medium: { fontFamily: 'System', fontWeight: '500' },
    bold: { fontFamily: 'System', fontWeight: '700' },
  },
};

export default lightTheme;

