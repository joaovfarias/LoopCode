// lib/theme.js
import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#544AC4', // destaque 1
    },
    secondary: {
      main: '#F06D6C', // layer 2
    },
    background: {
      default: '#1B1C30', // layer 1
      paper: '#26273B', // layer 2
    },
  },
  typography: {
    fontFamily: 'Inter, sans-serif',
  },
});

export default theme;
