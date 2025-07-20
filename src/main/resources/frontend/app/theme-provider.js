// app/theme-provider.js
'use client';

import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import theme from '@/lib/theme'; // ajuste o caminho conforme seu projeto

export default function MuiThemeProvider({ children }) {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline /> {/* reseta os estilos para um visual consistente */}
      {children}
    </ThemeProvider>
  );
}
