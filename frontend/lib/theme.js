// lib/theme.js
import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#673AB7", // Destaque (roxo)
      secondary: "#5E35B1", // Secundária (roxo mais escuro)
    },
    background: {
      default: "#121212", // Background
    },
    card: {
      primary: "#1A1A1A", // Cor primária do card
    },
    difficulty: {
      easy: "#4CAF50", // verde
      medium: "#FF9800", // laranja
      hard: "#F44336", // vermelho
    },
  },
  typography: {
    fontFamily: "Inter, sans-serif",
  },
});

export default theme;
