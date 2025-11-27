import { createTheme } from '@mui/material/styles';

// Theme with both light and dark mode settings
const theme = createTheme({
  cssVariables: true,
  components: {
    MuiButton: {
      defaultProps: {
        size: 'small'
      }
    },
    MuiTextField: {
      defaultProps: {
        size: 'small'
      }
    },
    MuiAutocomplete: {
      defaultProps: {
        size: 'small'
      }
    }
  },
  palette: {
    mode: 'dark',
    primary: {
      main: '#2f7781',
    },
    secondary: {
      main: '#b57105',
    },
    error: {
      main: '#d32f2f',
    },
    warning: {
      main: '#ed6c02',
    },
    info: {
      main: '#0288d1',
    },
    success: {
      main: '#2e7d32',
    },
    background: {
      default: '#1c1a23',
      paper: '#100f1a',
    },
    text: {
      primary: '#ffffff',
    },
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