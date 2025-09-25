import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';
import GlobalStyle from './styles/GlobalStyle';
import theme from './styles/theme';
import api from './utils/api';

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
  const location = useLocation();
  const [showWelcomeModal, setShowWelcomeModal] = useState(false);

  useEffect(() => {
    // Check if blowout sale is active before showing modal
    const checkBlowoutSaleStatus = async () => {
      try {
        const response = await api.get('/blowout-sale/status');
        // Only show modal if the sale is active
        if (response.data.isActive) {
          setTimeout(() => {
            setShowWelcomeModal(true);
          }, 1000);
        }
      } catch (error) {
        console.error('Error checking blowout sale status:', error);
        // Don't show modal if there's an error
      }
    };
    
    checkBlowoutSaleStatus();
  }, []);

  const handleCloseModal = () => {
    setShowWelcomeModal(false);
  };


  const handleContact = () => {
    handleCloseModal();
    navigate('/contact');
  };

  // Check if we're on the admin page
  const isAdminPage = location.pathname.startsWith('/admin');

  return (
    <>
      {!isAdminPage && <Navbar />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/buyers-guide" element={<BuyersGuide />} />
        <Route path="/sellers-guide" element={<SellersGuide />} />
        <Route path="/best-in-show" element={<BestInShow />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/admin" element={<Admin />} />
      </Routes>
      {!isAdminPage && <Footer />}
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