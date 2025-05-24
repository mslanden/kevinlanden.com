import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';
import GlobalStyle from './styles/GlobalStyle';
import theme from './styles/theme';

// Pages
import Home from './pages/Home';
import BuyersGuide from './pages/BuyersGuide';
import SellersGuide from './pages/SellersGuide';
import MarketingPlan from './pages/MarketingPlan';
import Testimonials from './pages/Testimonials';
import Affiliate from './pages/Affiliate';

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
          <Route path="/marketing-plan" element={<MarketingPlan />} />
          <Route path="/testimonials" element={<Testimonials />} />
          <Route path="/affiliate" element={<Affiliate />} />
        </Routes>
        <Footer />
      </Router>
    </ThemeProvider>
  );
}

export default App;