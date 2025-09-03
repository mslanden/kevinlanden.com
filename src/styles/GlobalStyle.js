import { createGlobalStyle } from 'styled-components';

const GlobalStyle = createGlobalStyle`
  @import url('https://fonts.googleapis.com/css2?family=Bodoni+Moda:wght@400;500;600;700&display=swap');
  @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap');

  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  html {
    scroll-behavior: smooth;
  }

  body {
    font-family: 'Poppins', sans-serif;
    background-color: #121212;
    color: #f5f5f5;
    line-height: 1.6;
    overflow-x: hidden;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  h1, h2, h3, h4, h5, h6 {
    font-family: 'Bodoni Moda', serif;
    font-weight: 600;
    margin-bottom: 1rem;
    color: #d2b48c; /* Tan/Gold color for headings */
  }

  p {
    margin-bottom: 1rem;
  }

  a {
    text-decoration: none;
    color: #d2b48c;
    transition: color 0.3s ease;
    
    &:hover {
      color: #a0522d; /* Darker brown on hover */
    }
  }

  button {
    cursor: pointer;
    font-family: 'Poppins', sans-serif;
  }

  img {
    max-width: 100%;
    height: auto;
  }

  section {
    padding: 5rem 0;
  }

  .container {
    width: 100%;
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 1.5rem;
  }

  /* Custom scrollbar */
  ::-webkit-scrollbar {
    width: 8px;
  }

  ::-webkit-scrollbar-track {
    background: #232323;
  }

  ::-webkit-scrollbar-thumb {
    background: #a0522d;
    border-radius: 4px;
  }

  ::-webkit-scrollbar-thumb:hover {
    background: #8b4513;
  }
`;

export default GlobalStyle;