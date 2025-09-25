import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { FaCookie, FaTimes, FaCog } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const CookieBanner = styled(motion.div)`
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: linear-gradient(135deg, rgba(20, 20, 20, 0.95) 0%, rgba(40, 40, 40, 0.95) 100%);
  border-top: 2px solid ${props => props.theme.colors.primary};
  padding: 1.5rem;
  z-index: 1000;
  backdrop-filter: blur(10px);
  box-shadow: 0 -4px 20px rgba(0, 0, 0, 0.3);

  @media (max-width: ${props => props.theme.breakpoints.md}) {
    padding: 1rem;
  }
`;

const CookieContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  gap: 2rem;

  @media (max-width: ${props => props.theme.breakpoints.md}) {
    flex-direction: column;
    gap: 1rem;
    text-align: center;
  }
`;

const CookieIcon = styled.div`
  color: ${props => props.theme.colors.primary};
  font-size: 2rem;
  flex-shrink: 0;

  @media (max-width: ${props => props.theme.breakpoints.md}) {
    font-size: 1.5rem;
  }
`;

const CookieText = styled.div`
  flex: 1;
  color: ${props => props.theme.colors.text.primary};

  h4 {
    color: ${props => props.theme.colors.text.secondary};
    margin-bottom: 0.5rem;
    font-size: 1.1rem;
  }

  p {
    margin-bottom: 0.5rem;
    line-height: 1.4;
    font-size: 0.95rem;
  }

  a {
    color: ${props => props.theme.colors.primary};
    text-decoration: none;
    font-weight: 500;

    &:hover {
      text-decoration: underline;
    }
  }
`;

const CookieActions = styled.div`
  display: flex;
  gap: 1rem;
  flex-shrink: 0;

  @media (max-width: ${props => props.theme.breakpoints.md}) {
    flex-direction: column;
    width: 100%;
  }
`;

const CookieButton = styled.button`
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: ${props => props.theme.borderRadius.small};
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.9rem;

  &.accept {
    background-color: ${props => props.theme.colors.primary};
    color: white;

    &:hover {
      background-color: ${props => props.theme.colors.tertiary};
      transform: translateY(-2px);
    }
  }

  &.customize {
    background-color: transparent;
    color: ${props => props.theme.colors.text.secondary};
    border: 1px solid ${props => props.theme.colors.border};

    &:hover {
      background-color: rgba(139, 69, 19, 0.1);
      border-color: ${props => props.theme.colors.primary};
    }
  }

  &.decline {
    background-color: rgba(244, 67, 54, 0.1);
    color: #f44336;
    border: 1px solid #f44336;

    &:hover {
      background-color: rgba(244, 67, 54, 0.2);
    }
  }
`;

const CloseButton = styled.button`
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: none;
  border: none;
  color: ${props => props.theme.colors.text.muted};
  cursor: pointer;
  font-size: 1.2rem;
  transition: color 0.3s ease;

  &:hover {
    color: ${props => props.theme.colors.text.secondary};
  }
`;

const PreferencesModal = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1001;
  padding: 2rem;
`;

const PreferencesContent = styled(motion.div)`
  background-color: rgba(20, 20, 20, 0.95);
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius.default};
  padding: 2rem;
  max-width: 600px;
  width: 100%;
  max-height: 80vh;
  overflow-y: auto;
  backdrop-filter: blur(10px);

  h3 {
    color: ${props => props.theme.colors.text.secondary};
    margin-bottom: 1.5rem;
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }
`;

const CookieCategory = styled.div`
  margin-bottom: 2rem;
  padding: 1.5rem;
  background-color: rgba(139, 69, 19, 0.1);
  border-radius: ${props => props.theme.borderRadius.small};

  h4 {
    color: ${props => props.theme.colors.primary};
    margin-bottom: 0.5rem;
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  p {
    color: ${props => props.theme.colors.text.primary};
    font-size: 0.95rem;
    line-height: 1.5;
    margin-bottom: 1rem;
  }

  label {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    color: ${props => props.theme.colors.text.secondary};
    cursor: pointer;

    input[type="checkbox"] {
      transform: scale(1.2);
    }
  }
`;

const PreferencesActions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 2rem;
`;

const CookieConsent = () => {
  const [showBanner, setShowBanner] = useState(false);
  const [showPreferences, setShowPreferences] = useState(false);
  const [preferences, setPreferences] = useState({
    essential: true, // Always required
    analytics: false,
    marketing: false,
    functional: false
  });

  useEffect(() => {
    // Check if user has already made a choice
    const consent = localStorage.getItem('cookie-consent');
    if (!consent) {
      // Show banner after a short delay
      const timer = setTimeout(() => {
        setShowBanner(true);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAcceptAll = () => {
    const consentData = {
      essential: true,
      analytics: true,
      marketing: true,
      functional: true,
      timestamp: new Date().toISOString()
    };

    localStorage.setItem('cookie-consent', JSON.stringify(consentData));
    setShowBanner(false);

    // Initialize analytics and other services here
    initializeServices(consentData);
  };

  const handleDeclineAll = () => {
    const consentData = {
      essential: true, // Essential cookies cannot be declined
      analytics: false,
      marketing: false,
      functional: false,
      timestamp: new Date().toISOString()
    };

    localStorage.setItem('cookie-consent', JSON.stringify(consentData));
    setShowBanner(false);
  };

  const handleCustomize = () => {
    setShowPreferences(true);
  };

  const handleSavePreferences = () => {
    const consentData = {
      ...preferences,
      essential: true, // Always true
      timestamp: new Date().toISOString()
    };

    localStorage.setItem('cookie-consent', JSON.stringify(consentData));
    setShowPreferences(false);
    setShowBanner(false);

    initializeServices(consentData);
  };

  const handlePreferenceChange = (category, value) => {
    if (category === 'essential') return; // Essential cannot be changed

    setPreferences(prev => ({
      ...prev,
      [category]: value
    }));
  };

  const initializeServices = (consent) => {
    // Initialize services based on consent
    if (consent.analytics) {
      // Initialize Google Analytics, etc.
      console.log('Analytics services initialized');
    }

    if (consent.marketing) {
      // Initialize marketing pixels, etc.
      console.log('Marketing services initialized');
    }

    if (consent.functional) {
      // Initialize functional features
      console.log('Functional services initialized');
    }
  };

  return (
    <>
      <AnimatePresence>
        {showBanner && (
          <CookieBanner
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          >
            <CloseButton onClick={() => setShowBanner(false)}>
              <FaTimes />
            </CloseButton>

            <CookieContent>
              <CookieIcon>
                <FaCookie />
              </CookieIcon>

              <CookieText>
                <h4>Cookie Consent</h4>
                <p>
                  We use cookies to enhance your browsing experience, provide personalized content,
                  and analyze our traffic. By clicking "Accept All", you consent to our use of cookies.
                </p>
                <p>
                  Read our <Link to="/privacy-policy">Privacy Policy</Link> for more information.
                </p>
              </CookieText>

              <CookieActions>
                <CookieButton className="accept" onClick={handleAcceptAll}>
                  Accept All
                </CookieButton>
                <CookieButton className="customize" onClick={handleCustomize}>
                  <FaCog />
                  Customize
                </CookieButton>
                <CookieButton className="decline" onClick={handleDeclineAll}>
                  Decline Optional
                </CookieButton>
              </CookieActions>
            </CookieContent>
          </CookieBanner>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showPreferences && (
          <PreferencesModal
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={(e) => e.target === e.currentTarget && setShowPreferences(false)}
          >
            <PreferencesContent
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <h3>
                <FaCog />
                Cookie Preferences
              </h3>

              <CookieCategory>
                <h4>Essential Cookies</h4>
                <p>
                  These cookies are necessary for the website to function and cannot be disabled.
                  They include security, accessibility, and basic functionality features.
                </p>
                <label>
                  <input
                    type="checkbox"
                    checked={true}
                    disabled
                  />
                  Always Active
                </label>
              </CookieCategory>

              <CookieCategory>
                <h4>Analytics Cookies</h4>
                <p>
                  These cookies help us understand how visitors interact with our website by
                  collecting information about pages visited and user behavior patterns.
                </p>
                <label>
                  <input
                    type="checkbox"
                    checked={preferences.analytics}
                    onChange={(e) => handlePreferenceChange('analytics', e.target.checked)}
                  />
                  Allow Analytics
                </label>
              </CookieCategory>

              <CookieCategory>
                <h4>Marketing Cookies</h4>
                <p>
                  These cookies are used to deliver personalized advertisements and track
                  advertising campaign effectiveness across different websites.
                </p>
                <label>
                  <input
                    type="checkbox"
                    checked={preferences.marketing}
                    onChange={(e) => handlePreferenceChange('marketing', e.target.checked)}
                  />
                  Allow Marketing
                </label>
              </CookieCategory>

              <CookieCategory>
                <h4>Functional Cookies</h4>
                <p>
                  These cookies enable enhanced functionality like remembering your preferences,
                  language settings, and personalized content.
                </p>
                <label>
                  <input
                    type="checkbox"
                    checked={preferences.functional}
                    onChange={(e) => handlePreferenceChange('functional', e.target.checked)}
                  />
                  Allow Functional
                </label>
              </CookieCategory>

              <PreferencesActions>
                <CookieButton className="customize" onClick={() => setShowPreferences(false)}>
                  Cancel
                </CookieButton>
                <CookieButton className="accept" onClick={handleSavePreferences}>
                  Save Preferences
                </CookieButton>
              </PreferencesActions>
            </PreferencesContent>
          </PreferencesModal>
        )}
      </AnimatePresence>
    </>
  );
};

export default CookieConsent;