import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#eebbc3",
      contrastText: "#232946",
    },
    background: {
      default: "#232946",
      paper: "#232946",
    },
    text: {
      primary: "#fffffe",
      secondary: "#b8c1ec",
    },
  },
  typography: {
    fontFamily: "Nunito, sans-serif",
    button: {
      fontWeight: 700,
    },
    body1: {
      fontSize: "1.25rem",
    },
    body2: {
      fontSize: "1rem",
    },
  },
});

export default theme;
