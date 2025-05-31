import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';
import GlobalStyle from './styles/GlobalStyle';
import theme from './styles/theme';

// Pages
import Home from './pages/Home';
import BuyersGuide from './pages/BuyersGuide';
import SellersGuide from './pages/SellersGuide';
import BestInShow from './pages/BestInShow';
import Contact from './pages/Contact';

// Components
import Navbar from './components/Navbar';
import Footer from './components/Footer';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <GlobalStyle />
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/buyers-guide" element={<BuyersGuide />} />
          <Route path="/sellers-guide" element={<SellersGuide />} />
          <Route path="/best-in-show" element={<BestInShow />} />
          <Route path="/contact" element={<Contact />} />
        </Routes>
        <Footer />
      </Router>
    </ThemeProvider>
  );
}

export default App;