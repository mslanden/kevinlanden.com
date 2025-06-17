import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';
import GlobalStyle from './styles/GlobalStyle';
import theme from './styles/theme';

// Pages
import Home from './pages/Home';
import BuyersGuide from './pages/BuyersGuide';
import SellersGuide from './pages/SellersGuide';
import BestInShow from './pages/BestInShow';
import Contact from './pages/Contact';
import Admin from './pages/Admin';

// Components
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import WelcomeModal from './components/WelcomeModal';

function AppContent() {
  const navigate = useNavigate();
  const [showWelcomeModal, setShowWelcomeModal] = useState(false);

  useEffect(() => {
    // Show modal after a short delay for better UX
    setTimeout(() => {
      setShowWelcomeModal(true);
    }, 1000);
  }, []);

  const handleCloseModal = () => {
    setShowWelcomeModal(false);
  };


  const handleContact = () => {
    handleCloseModal();
    navigate('/contact');
  };

  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/buyers-guide" element={<BuyersGuide />} />
        <Route path="/sellers-guide" element={<SellersGuide />} />
        <Route path="/best-in-show" element={<BestInShow />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/admin" element={<Admin />} />
      </Routes>
      <Footer />
      <WelcomeModal 
        isOpen={showWelcomeModal}
        onClose={handleCloseModal}
        onContact={handleContact}
      />
    </>
  );
}

function App() {
  return (
    <ThemeProvider theme={theme}>
      <GlobalStyle />
      <Router>
        <AppContent />
      </Router>
    </ThemeProvider>
  );
}

export default App;