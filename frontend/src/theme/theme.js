import { createTheme } from "@mui/material/styles";

// Palette:
// Ink       #12141F  (near-black, text)
// Paper     #FFFFFF
// Canvas    #F5F6FA  (app background)
// Pulse     #00C896  (primary - energy green)
// Ember     #FF6B4A  (secondary - calories/streak accent)
// Sky       #4C6FFF  (info/water accent)
// Mist      #E7E9F2  (borders/dividers)

const theme = createTheme({
  palette: {
    mode: "light",
    primary: { main: "#00C896", dark: "#00A67D", light: "#4FE0BC", contrastText: "#0A0F0D" },
    secondary: { main: "#FF6B4A", dark: "#E5502E", light: "#FF9478", contrastText: "#ffffff" },
    info: { main: "#4C6FFF" },
    background: { default: "#F5F6FA", paper: "#FFFFFF" },
    text: { primary: "#12141F", secondary: "#6B7080" },
    divider: "#E7E9F2",
    success: { main: "#00C896" },
    warning: { main: "#FFB020" },
    error: { main: "#FF5470" },
  },
  shape: { borderRadius: 16 },
  typography: {
    fontFamily: '"Inter", "Helvetica", "Arial", sans-serif',
    h1: { fontFamily: '"Space Grotesk", sans-serif', fontWeight: 700, letterSpacing: "-0.02em" },
    h2: { fontFamily: '"Space Grotesk", sans-serif', fontWeight: 700, letterSpacing: "-0.02em" },
    h3: { fontFamily: '"Space Grotesk", sans-serif', fontWeight: 700, letterSpacing: "-0.01em" },
    h4: { fontFamily: '"Space Grotesk", sans-serif', fontWeight: 700 },
    h5: { fontFamily: '"Space Grotesk", sans-serif', fontWeight: 600 },
    h6: { fontFamily: '"Space Grotesk", sans-serif', fontWeight: 600 },
    button: { fontWeight: 600, textTransform: "none" },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: { borderRadius: 12, padding: "10px 20px" },
        contained: { boxShadow: "none", "&:hover": { boxShadow: "none" } },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: { backgroundImage: "none" },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 20,
          border: "1px solid #E7E9F2",
          boxShadow: "0 1px 2px rgba(18,20,31,0.04)",
        },
      },
    },
    MuiTextField: {
      defaultProps: { variant: "outlined" },
    },
    MuiOutlinedInput: {
      styleOverrides: { root: { borderRadius: 12 } },
    },
    MuiChip: {
      styleOverrides: { root: { borderRadius: 8, fontWeight: 600 } },
    },
  },
});

export default theme;
