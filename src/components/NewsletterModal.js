import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { FaTimes, FaEnvelope, FaCheck } from 'react-icons/fa';
// import { subscribeToNewsletter } from '../utils/api';

const ModalOverlay = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  padding: 1rem;
`;

const ModalContainer = styled(motion.div)`
  background-color: ${props => props.theme.colors.background.card};
  border-radius: ${props => props.theme.borderRadius.default};
  border: 1px solid ${props => props.theme.colors.border};
  max-width: 550px;
  width: 100%;
  padding: 2.5rem;
  position: relative;
  box-shadow: ${props => props.theme.shadows.large};
  overflow: hidden;
`;

const CloseButton = styled.button`
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: none;
  border: none;
  color: ${props => props.theme.colors.text.secondary};
  font-size: 1.3rem;
  cursor: pointer;
  transition: transform ${props => props.theme.transitions.fast};
  
  &:hover {
    transform: scale(1.1);
    color: ${props => props.theme.colors.text.primary};
  }
`;

const ModalTitle = styled.h2`
  font-family: ${props => props.theme.fonts.heading};
  font-size: 2rem;
  color: ${props => props.theme.colors.text.secondary};
  margin-bottom: 1.5rem;
  text-align: center;
`;

const ModalDescription = styled.p`
  font-size: 1.1rem;
  color: ${props => props.theme.colors.text.primary};
  margin-bottom: 2rem;
  text-align: center;
  line-height: 1.6;
`;

const NewsletterForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const Label = styled.label`
  color: ${props => props.theme.colors.text.secondary};
  font-size: 1rem;
  font-weight: 500;
`;

const Input = styled.input`
  padding: 0.75rem 1rem;
  background-color: rgba(25, 25, 25, 0.8);
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius.small};
  color: ${props => props.theme.colors.text.primary};
  font-size: 1rem;
  transition: border-color ${props => props.theme.transitions.fast};
  
  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.secondary};
  }
`;

const CheckboxGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  margin-top: 0.5rem;
`;

const CheckboxLabel = styled.label`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  cursor: pointer;
  color: ${props => props.theme.colors.text.primary};
  font-size: 0.95rem;
  
  input {
    width: 18px;
    height: 18px;
    cursor: pointer;
    accent-color: ${props => props.theme.colors.primary};
  }
`;

const SubscribeButton = styled(motion.button)`
  background-color: ${props => props.theme.colors.primary};
  color: white;
  border: none;
  padding: 1rem;
  font-size: 1.1rem;
  font-weight: 600;
  border-radius: ${props => props.theme.borderRadius.small};
  cursor: pointer;
  margin-top: 1rem;
  transition: background-color ${props => props.theme.transitions.default};
  
  &:hover {
    background-color: ${props => props.theme.colors.tertiary};
  }
  
  &:disabled {
    background-color: #5a5a5a;
    cursor: not-allowed;
  }
`;

const SkipButton = styled.button`
  background: none;
  border: none;
  color: ${props => props.theme.colors.text.muted};
  font-size: 0.9rem;
  margin-top: 1rem;
  cursor: pointer;
  text-decoration: underline;
  
  &:hover {
    color: ${props => props.theme.colors.text.primary};
  }
`;

const SuccessMessage = styled(motion.div)`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1.5rem;
  text-align: center;
  
  svg {
    font-size: 3rem;
    color: ${props => props.theme.colors.secondary};
  }
  
  h3 {
    font-family: ${props => props.theme.fonts.heading};
    font-size: 1.8rem;
    color: ${props => props.theme.colors.text.secondary};
  }
  
  p {
    color: ${props => props.theme.colors.text.primary};
    margin-bottom: 1.5rem;
  }
`;

const IconWrapper = styled.div`
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background-color: rgba(139, 69, 19, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid ${props => props.theme.colors.border};
`;

const NewsletterModal = ({ isOpen, onClose, onDownloadComplete, pdfFileName }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    newsletters: {
      anza: false,
      aguanga: false,
      mountainCenter: false,
      idyllwild: false
    }
  });
  
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  
  // Reset form when modal closes
  useEffect(() => {
    if (!isOpen) {
      setTimeout(() => {
        setFormData({
          name: '',
          email: '',
          newsletters: {
            anza: false,
            aguanga: false,
            mountainCenter: false,
            idyllwild: false
          }
        });
        setIsSubmitted(false);
        setIsDownloading(false);
      }, 300);
    }
  }, [isOpen]);
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };
  
  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    setFormData({
      ...formData,
      newsletters: {
        ...formData.newsletters,
        [name]: checked
      }
    });
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      // Prepare data for API
      const communities = Object.entries(formData.newsletters)
        .filter(([key, value]) => value)
        .map(([key]) => {
          // Convert camelCase to kebab-case for mountain-center
          if (key === 'mountainCenter') return 'mountain-center';
          return key;
        });
      
      // Send subscription data to backend (mock for now)
      // await subscribeToNewsletter({
      //   name: formData.name,
      //   email: formData.email,
      //   communities: communities,
      //   source: pdfFileName ? pdfFileName.replace(/\.(pdf|html)$/, '') : 'website'
      // });
      
      // Mock success for now
      console.log('Newsletter subscription:', {
        name: formData.name,
        email: formData.email,
        communities: communities,
        source: pdfFileName ? pdfFileName.replace(/\.(pdf|html)$/, '') : 'website'
      });
      
      setIsSubmitted(true);
      
      // Only download if there's a file to download
      if (pdfFileName) {
        setTimeout(() => {
          downloadFile();
        }, 1500);
      } else {
        // For newsletter-only signups, close modal after showing success
        setTimeout(() => {
          onClose();
        }, 2000);
      }
    } catch (error) {
      console.error('Error subscribing to newsletter:', error);
      alert('There was an error subscribing to the newsletter. Please try again.');
    }
  };
  
  const downloadFile = () => {
    setIsDownloading(true);
    
    // Simulate loading time before opening the guide
    setTimeout(() => {
      setIsDownloading(false);
      
      // Close modal and trigger completion callback
      setTimeout(() => {
        onClose();
        if (onDownloadComplete) {
          onDownloadComplete();
        }
      }, 1000);
    }, 1500);
  };
  
  const handleSkip = () => {
    // Skip newsletter signup and download directly
    downloadFile();
  };
  
  const atLeastOneNewsletterSelected = Object.values(formData.newsletters).some(value => value);
  const isFormValid = formData.name.trim() !== '' && 
                     formData.email.trim() !== '' && 
                     /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email) &&
                     atLeastOneNewsletterSelected;
  
  return (
    <AnimatePresence>
      {isOpen && (
        <ModalOverlay
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <ModalContainer
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 50, opacity: 0 }}
            transition={{ type: 'spring', damping: 25 }}
            onClick={(e) => e.stopPropagation()}
          >
            <CloseButton onClick={onClose}>
              <FaTimes />
            </CloseButton>
            
            {!isSubmitted ? (
              <>
                <ModalTitle>Subscribe to Our Newsletter</ModalTitle>
                <ModalDescription>
                  {pdfFileName 
                    ? "Stay updated with the latest properties and market insights in your area of interest. Subscribe to our newsletter to get exclusive content delivered to your inbox."
                    : "Choose which community newsletters you'd like to receive to stay updated with the latest properties and market insights in your areas of interest."
                  }
                </ModalDescription>
                
                <NewsletterForm onSubmit={handleSubmit}>
                  <InputGroup>
                    <Label htmlFor="name">Name</Label>
                    <Input 
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="Your name"
                      required
                    />
                  </InputGroup>
                  
                  <InputGroup>
                    <Label htmlFor="email">Email</Label>
                    <Input 
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="Your email address"
                      required
                    />
                  </InputGroup>
                  
                  <InputGroup>
                    <Label>Select Newsletters (at least one)</Label>
                    <CheckboxGroup>
                      <CheckboxLabel>
                        <input
                          type="checkbox"
                          name="anza"
                          checked={formData.newsletters.anza}
                          onChange={handleCheckboxChange}
                        />
                        Anza, CA Market Updates
                      </CheckboxLabel>
                      
                      <CheckboxLabel>
                        <input
                          type="checkbox"
                          name="aguanga"
                          checked={formData.newsletters.aguanga}
                          onChange={handleCheckboxChange}
                        />
                        Aguanga, CA Market Updates
                      </CheckboxLabel>
                      
                      <CheckboxLabel>
                        <input
                          type="checkbox"
                          name="mountainCenter"
                          checked={formData.newsletters.mountainCenter}
                          onChange={handleCheckboxChange}
                        />
                        Mountain Center, CA Market Updates
                      </CheckboxLabel>
                      
                      <CheckboxLabel>
                        <input
                          type="checkbox"
                          name="idyllwild"
                          checked={formData.newsletters.idyllwild}
                          onChange={handleCheckboxChange}
                        />
                        Idyllwild, CA Market Updates
                      </CheckboxLabel>
                    </CheckboxGroup>
                  </InputGroup>
                  
                  <SubscribeButton 
                    type="submit"
                    disabled={!isFormValid}
                    whileHover={isFormValid ? { scale: 1.03 } : {}}
                    whileTap={isFormValid ? { scale: 0.98 } : {}}
                  >
                    {pdfFileName ? 'Subscribe & Download' : 'Subscribe'}
                  </SubscribeButton>
                </NewsletterForm>
                
                {pdfFileName && (
                  <div style={{ textAlign: 'center' }}>
                    <SkipButton type="button" onClick={handleSkip}>
                      Skip and download directly
                    </SkipButton>
                  </div>
                )}
              </>
            ) : (
              <SuccessMessage
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                <IconWrapper>
                  {isDownloading ? (
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    >
                      <FaEnvelope />
                    </motion.div>
                  ) : (
                    <FaCheck />
                  )}
                </IconWrapper>
                
                <h3>{isDownloading ? 'Opening Guide...' : 'Thank You!'}</h3>
                <p>
                  {isDownloading 
                    ? `Opening your guide...` 
                    : pdfFileName 
                      ? `You've been subscribed! Your guide will open shortly.`
                      : "You've been successfully subscribed to our newsletter! We'll keep you updated with the latest market insights in your selected communities."}
                </p>
              </SuccessMessage>
            )}
          </ModalContainer>
        </ModalOverlay>
      )}
    </AnimatePresence>
  );
};

export default NewsletterModal;
