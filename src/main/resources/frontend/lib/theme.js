// lib/theme.js
import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#673AB7", // destaque 1
      contrast: "#1f081eff", // contraste main
    },
    secondary: {
      main: "#673AB7", // destaque 2
    },
    background: {
      default: "#121212", // layer 1
      paper: "#161616", // layer 2
    },
    card: {
      primary: "#1B1C30",
      secondary: "#303042ff", // divider
      dark: "#0B0C1C",
    },
  },
  typography: {
    fontFamily: "Inter, sans-serif",
  },
});

export default theme;
