// lib/theme.js
import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#673AB7', // destaque 1
    },
    secondary: {
      main: '#673AB7', // destaque 2
    },
    background: {
      default: '#121212', // layer 1
      paper: '#161616', // layer 2
    },
  },
  typography: {
    fontFamily: 'Inter, sans-serif',
  },
});

export default theme;
