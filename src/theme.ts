import { createTheme } from '@mui/material/styles';

// Theme with both light and dark mode settings
const theme = createTheme({
  cssVariables: true,
  components: {
    MuiButton: {
      defaultProps: {
        size: 'small'
      }
    }
  },
  palette: {
    mode: 'dark',
    primary: {
      main: '#2f7781',
      light: '#1976d2',
      dark: '#06636f',
    },
    secondary: {
      main: '#b57105',
      light: '#dc004e',
      dark: '#0376ce',
      contrastText: 'rgba(255,255,255,0.87)',
    },
    error: {
      main: '#d32f2f',
      light: '#ef5350',
      dark: '#c62828',
    },
    warning: {
      main: '#ed6c02',
      light: '#ff9800',
      dark: '#e65100',
    },
    info: {
      main: '#0288d1',
      light: '#03a9f4',
      dark: '#01579b',
    },
    success: {
      main: '#2e7d32',
      light: '#4caf50',
      dark: '#1b5e20',
    },
    background: {
      default: '#1c1a23',
      paper: '#100f1a',
    },
    text: {
      primary: '#ffffff',
      secondary: 'rgba(255, 255, 255, 0.7)',
      disabled: 'rgba(255, 255, 255, 0.5)',
    },
    divider: 'rgba(255, 255, 255, 0.12)',
    action: {
      active: 'rgba(255, 255, 255, 0.7)',
      hover: 'rgba(255, 255, 255, 0.08)',
      selected: 'rgba(255, 255, 255, 0.16)',
      disabled: 'rgba(255, 255, 255, 0.3)',
      disabledBackground: 'rgba(255, 255, 255, 0.12)',
      focus: 'rgba(0, 0, 0, 0.12)',
    },
  },
  typography: {
    fontFamily: '"PT Sans"',
  },
});

export default theme;