const theme = {
  colors: {
    primary: '#8b4513', // Saddle Brown - main brand color
    secondary: '#d2b48c', // Tan - accent color
    tertiary: '#a0522d', // Sienna - another brown tone
    background: {
      dark: '#121212', // Dark background
      light: '#2a2a2a', // Slightly lighter dark background
      card: 'rgba(30, 30, 30, 0.8)', // Card background
      warmDark: '#1a1613', // Warm dark with brown undertones
      coolDark: '#101112', // Cool dark, deeper black-gray undertone
      richDark: '#0d0d0d', // Even darker background
    },
    text: {
      primary: '#f5f5f5', // Light text
      secondary: '#d2b48c', // Tan text
      dark: '#333333', // Dark text for light backgrounds
      muted: '#a0a0a0', // Muted text
    },
    border: 'rgba(210, 180, 140, 0.3)', // Tan with opacity for borders
  },
  fonts: {
    heading: '"Bodoni Moda", serif',
    body: '"Poppins", sans-serif',
  },
  breakpoints: {
    sm: '576px',
    md: '768px',
    lg: '992px',
    xl: '1200px',
  },
  spacing: {
    xs: '0.5rem',
    sm: '1rem',
    md: '1.5rem',
    lg: '2rem',
    xl: '3rem',
    xxl: '5rem',
  },
  shadows: {
    small: '0 2px 5px rgba(0, 0, 0, 0.2)',
    medium: '0 5px 15px rgba(0, 0, 0, 0.3)',
    large: '0 10px 25px rgba(0, 0, 0, 0.4)',
  },
  transitions: {
    fast: '0.2s ease',
    default: '0.3s ease',
    slow: '0.5s ease',
  },
  borderRadius: {
    small: '4px',
    default: '8px',
    large: '12px',
    round: '50%',
  },
};

export default theme;