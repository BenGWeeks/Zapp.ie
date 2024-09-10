import { unstable_createMuiStrictModeTheme as createMuiTheme } from "@mui/material/styles";
import { red } from "@mui/material/colors";

// Create a theme instance.
export const theme = createMuiTheme({
  palette: {
    primary: {
      main: '#686868',
    },
    secondary: {
      main: '#19857b',
    },
    error: {
      main: red.A400,
    },
    background: {
      default: '#1f1f1f',
    },
    text: {
      primary: '#fff',
    },
  },
});