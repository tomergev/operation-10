import { createTheme, ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";

export const lightTheme = createTheme({
  palette: {
    mode: "light",
    primary: { main: "#6c5ce7" },
    secondary: { main: "#00b894" },
    background: { default: "#f0f2f5", paper: "#ffffff" },
  },
  typography: {
    fontFamily: "'Inter', 'Roboto', 'Helvetica', sans-serif",
  },
  shape: { borderRadius: 12 },
});

export const darkTheme = createTheme({
  palette: {
    mode: "dark",
    primary: { main: "#a29bfe" },
    secondary: { main: "#55efc4" },
    background: { default: "#0f0f23", paper: "#1a1a2e" },
  },
  typography: {
    fontFamily: "'Inter', 'Roboto', 'Helvetica', sans-serif",
  },
  shape: { borderRadius: 12 },
});

export function AppProviders({ theme, children }) {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  );
}
