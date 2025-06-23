import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { FaTimes, FaDollarSign } from 'react-icons/fa';
import api from '../utils/api';

const ModalOverlay = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 1rem;
  overflow-y: auto;
  
  @media (max-width: ${props => props.theme.breakpoints.sm}) {
    padding: 0.5rem;
  }
`;

const ModalContainer = styled(motion.div)`
  background: rgba(20, 20, 20, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 12px;
  padding: 2rem;
  max-width: 650px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  position: relative;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
  border: 1px solid rgba(255, 255, 255, 0.1);
  
  @media (max-width: ${props => props.theme.breakpoints.md}) {
    padding: 1.5rem;
    max-height: 85vh;
    max-width: calc(100% - 2rem);
  }
  
  @media (max-width: ${props => props.theme.breakpoints.sm}) {
    padding: 1.25rem;
    max-height: 80vh;
    border-radius: 8px;
  }
`;

const CloseButton = styled.button`
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: none;
  border: none;
  color: #ffffff;
  cursor: pointer;
  font-size: 1.5rem;
  z-index: 10;
  transition: opacity 0.2s;
  padding: 0.25rem;
  
  &:hover {
    opacity: 0.7;
  }
  
  @media (max-width: ${props => props.theme.breakpoints.sm}) {
    top: 0.75rem;
    right: 0.75rem;
    font-size: 1.25rem;
  }
`;

const Title = styled.h2`
  font-family: ${props => props.theme.fonts.heading};
  font-size: 2rem;
  color: #ffffff;
  margin-bottom: 0.5rem;
  margin-top: 1rem;
  text-align: center;
  text-shadow: 2px 2px 8px rgba(0,0,0,0.5);
  
  @media (max-width: ${props => props.theme.breakpoints.md}) {
    font-size: 1.75rem;
    margin-top: 0.75rem;
  }
  
  @media (max-width: ${props => props.theme.breakpoints.sm}) {
    font-size: 1.4rem;
    margin-top: 0.5rem;
  }
`;

const Subtitle = styled.p`
  font-size: 1rem;
  color: rgba(255, 255, 255, 0.9);
  margin-bottom: 1.5rem;
  text-align: center;
  line-height: 1.4;
  font-weight: 400;
  text-shadow: 1px 1px 4px rgba(0,0,0,0.5);
  
  @media (max-width: ${props => props.theme.breakpoints.sm}) {
    font-size: 0.9rem;
    margin-bottom: 1rem;
  }
`;

const SpotsText = styled.p`
  color: #ffffff;
  text-align: center;
  font-size: 1.1rem;
  font-weight: 600;
  margin: 0 0 1.5rem 0;
  text-shadow: 1px 1px 4px rgba(0,0,0,0.5);
  
  span {
    font-size: 1.5rem;
    font-weight: 700;
    color: ${props => props.theme.colors.secondary};
  }
  
  @media (max-width: ${props => props.theme.breakpoints.sm}) {
    font-size: 1rem;
    margin-bottom: 1rem;
    
    span {
      font-size: 1.3rem;
    }
  }
`;

const PricingGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.25rem;
  margin-bottom: 1.5rem;
  
  @media (max-width: ${props => props.theme.breakpoints.sm}) {
    grid-template-columns: 1fr;
    gap: 0.75rem;
    margin-bottom: 1rem;
  }
`;

const PricingCard = styled.div`
  background: rgba(30, 30, 30, 0.8);
  border: 1px solid rgba(210, 180, 140, 0.3);
  border-radius: ${props => props.theme.borderRadius.large};
  padding: 1.5rem;
  text-align: center;
  box-shadow: ${props => props.theme.shadows.medium};
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: ${props => props.theme.shadows.large};
    border-color: ${props => props.theme.colors.secondary};
  }
  
  @media (max-width: ${props => props.theme.breakpoints.sm}) {
    padding: 1rem;
  }
`;

const PriceRange = styled.h3`
  font-size: 0.9rem;
  color: ${props => props.theme.colors.text.secondary};
  margin-bottom: 0.5rem;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  
  @media (max-width: ${props => props.theme.breakpoints.sm}) {
    font-size: 0.8rem;
    margin-bottom: 0.25rem;
  }
`;

const Price = styled.div`
  font-size: 2.2rem;
  color: ${props => props.theme.colors.text.primary};
  font-weight: 700;
  font-family: ${props => props.theme.fonts.heading};
  margin-bottom: 0.5rem;
  
  small {
    font-size: 1.4rem;
  }
  
  @media (max-width: ${props => props.theme.breakpoints.sm}) {
    font-size: 1.8rem;
    margin-bottom: 0.25rem;
    
    small {
      font-size: 1.2rem;
    }
  }
`;


const CTAButton = styled(motion.button)`
  background: ${props => props.theme.colors.primary};
  color: white;
  border: none;
  padding: 1.25rem 2.5rem;
  font-size: 1.25rem;
  font-weight: 700;
  border-radius: 8px;
  cursor: pointer;
  width: 100%;
  transition: all 0.3s ease;
  font-family: ${props => props.theme.fonts.body};
  text-transform: uppercase;
  letter-spacing: 1px;
  box-shadow: 0 4px 15px rgba(0,0,0,0.2);
  white-space: normal;
  word-wrap: break-word;
  
  &:hover {
    background: ${props => props.theme.colors.tertiary};
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(0,0,0,0.3);
  }
  
  .button-text-desktop {
    display: inline;
  }
  
  .button-text-mobile {
    display: none;
  }
  
  @media (max-width: ${props => props.theme.breakpoints.sm}) {
    padding: 1rem 1.5rem;
    font-size: 1rem;
    letter-spacing: 0.5px;
    
    .button-text-desktop {
      display: none;
    }
    
    .button-text-mobile {
      display: inline;
    }
  }
`;

const Disclaimer = styled.p`
  font-size: 0.75rem;
  color: rgba(255, 255, 255, 0.7);
  text-align: center;
  margin-top: 1rem;
  font-style: italic;
  line-height: 1.4;
  
  @media (max-width: ${props => props.theme.breakpoints.sm}) {
    font-size: 0.7rem;
    margin-top: 0.75rem;
  }
`;


const WelcomeModal = ({ isOpen, onClose, onContact }) => {
  const [spotsRemaining, setSpotsRemaining] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isOpen) {
      fetchBlowoutSaleStatus();
    }
  }, [isOpen]);

  const fetchBlowoutSaleStatus = async () => {
    try {
      const response = await api.get('/blowout-sale/status');
      setSpotsRemaining(response.data.spotsRemaining);
    } catch (error) {
      console.error('Error fetching blowout sale status:', error);
      setSpotsRemaining(25); // Fallback to default
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = () => {
    onClose();
    onContact();
  };

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
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            onClick={(e) => e.stopPropagation()}
          >
            <CloseButton onClick={onClose}>
              <FaTimes size={24} />
            </CloseButton>
            
            <Title>Looking to sell in 2025?</Title>
            <Subtitle>Limited time discount pricing on your listing</Subtitle>
            
            <SpotsText>
              Only <span>{loading ? '...' : spotsRemaining}</span> Spots Left!
            </SpotsText>
            
            <PricingGrid>
              <PricingCard>
                <PriceRange>Under $1 Million</PriceRange>
                <Price>
                  <small>$</small>5,000
                </Price>
              </PricingCard>
              
              <PricingCard>
                <PriceRange>$1M - $1.5M</PriceRange>
                <Price>
                  <small>$</small>7,500
                </Price>
              </PricingCard>
            </PricingGrid>
            
            <CTAButton
              onClick={handleRegister}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <span className="button-text-desktop">Register Now!</span>
              <span className="button-text-mobile">Register Now!</span>
            </CTAButton>
            
            <Disclaimer>
              * First come, first serve. Home needs to be listed by 12/31/2025. Standard commission rates apply after promotional spots are filled or home does not go on market in 2025.
            </Disclaimer>
          </ModalContainer>
        </ModalOverlay>
      )}
    </AnimatePresence>
  );
};

export default WelcomeModal;