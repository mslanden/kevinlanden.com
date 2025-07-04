import React, { useState } from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { FaEnvelope, FaPhoneAlt, FaMapMarkerAlt } from 'react-icons/fa';
import NewsletterModal from './NewsletterModal';

const FooterContainer = styled.footer`
  background-color: ${props => props.theme.colors.background.dark};
  border-top: 1px solid ${props => props.theme.colors.border};
  padding: 4rem 0 2rem;
  color: ${props => props.theme.colors.text.muted};
`;

const FooterContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1.5rem;
`;

const FooterTop = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  gap: 3rem;
  margin-bottom: 3rem;
  
  @media (max-width: ${props => props.theme.breakpoints.md}) {
    flex-direction: column;
    gap: 2rem;
  }
`;

const FooterColumn = styled.div`
  flex: 1;
  min-width: 200px;
  
  @media (max-width: ${props => props.theme.breakpoints.md}) {
    text-align: center;
  }
`;

const FooterLogo = styled.div`
  margin-bottom: 1.5rem;
  
  img {
    height: 50px;
    margin-bottom: 1rem;
  }
`;

const LogoText = styled.h3`
  font-family: ${props => props.theme.fonts.heading};
  font-size: 1.5rem;
  margin-bottom: 0.5rem;
  color: ${props => props.theme.colors.text.secondary};
`;

const FooterTagline = styled.p`
  color: ${props => props.theme.colors.text.muted};
  font-size: 0.9rem;
`;

const FooterHeading = styled.h4`
  color: ${props => props.theme.colors.text.secondary};
  font-size: 1.2rem;
  margin-bottom: 1.5rem;
  font-weight: 600;
  position: relative;
  display: inline-block;
  
  &:after {
    content: '';
    position: absolute;
    left: 0;
    bottom: -8px;
    width: 40px;
    height: 2px;
    background-color: ${props => props.theme.colors.primary};
    
    @media (max-width: ${props => props.theme.breakpoints.md}) {
      left: 50%;
      transform: translateX(-50%);
    }
  }
`;

const FooterLinks = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

const FooterLink = styled.li`
  margin-bottom: 0.8rem;
  
  a {
    color: ${props => props.theme.colors.text.muted};
    text-decoration: none;
    transition: color 0.3s ease;
    display: inline-block;
    
    &:hover {
      color: ${props => props.theme.colors.text.secondary};
      transform: translateX(5px);
    }
  }
`;

const ContactItem = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 1rem;
  color: ${props => props.theme.colors.text.muted};
  
  @media (max-width: ${props => props.theme.breakpoints.md}) {
    justify-content: center;
  }
  
  svg {
    margin-right: 0.8rem;
    color: ${props => props.theme.colors.text.secondary};
  }
  
  a {
    color: ${props => props.theme.colors.text.muted};
    text-decoration: none;
    
    &:hover {
      color: ${props => props.theme.colors.text.secondary};
    }
  }
`;

const FooterBottom = styled.div`
  text-align: center;
  padding-top: 2rem;
  border-top: 1px solid rgba(210, 180, 140, 0.2);
`;

const Copyright = styled.p`
  font-size: 0.9rem;
  color: ${props => props.theme.colors.text.muted};
`;

const NewsletterSection = styled.div`
  margin-top: 1.5rem;
`;

const NewsletterButton = styled.button`
  background-color: ${props => props.theme.colors.primary};
  color: white;
  border: none;
  padding: 0.8rem 1.5rem;
  border-radius: 4px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-top: 1rem;
  width: 100%;
  
  &:hover {
    background-color: ${props => props.theme.colors.tertiary};
    transform: translateY(-2px);
  }
`;

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const [isNewsletterModalOpen, setIsNewsletterModalOpen] = useState(false);
  
  const handleNewsletterClick = () => {
    setIsNewsletterModalOpen(true);
  };
  
  const handleModalClose = () => {
    setIsNewsletterModalOpen(false);
  };
  
  return (
    <FooterContainer>
      <FooterContent>
        <FooterTop>
          <FooterColumn>
            <FooterLogo>
              <LogoText>OUTRIDER</LogoText>
              <FooterTagline>Professionally navigating the market conditions</FooterTagline>
            </FooterLogo>
            <ContactItem>
              <FaMapMarkerAlt />
              <span>Serving Anza, Aguanga, Idyllwild, and Mountain Center</span>
            </ContactItem>
          </FooterColumn>
          
          <FooterColumn>
            <FooterHeading>Quick Links</FooterHeading>
            <FooterLinks>
              <FooterLink><Link to="/">Home</Link></FooterLink>
              <FooterLink><Link to="/sellers-guide">Sellers</Link></FooterLink>
              <FooterLink><Link to="/buyers-guide">Buyers</Link></FooterLink>
              <FooterLink><Link to="/best-in-show">Best In Show</Link></FooterLink>
              <FooterLink><Link to="/contact">Contact</Link></FooterLink>
            </FooterLinks>
          </FooterColumn>
          
          <FooterColumn>
            <FooterHeading>Contact Us</FooterHeading>
            <ContactItem>
              <FaEnvelope />
              <a href="mailto:kevin@outriderrealestate.com">kevin@outriderrealestate.com</a>
            </ContactItem>
            <ContactItem>
              <FaPhoneAlt />
              <a href="tel:+19514914890">(951) 491-4890</a>
            </ContactItem>
            
            <NewsletterSection>
              <FooterHeading>Monthly Newsletter</FooterHeading>
              <p>Subscribe to our Monthly Newsletter</p>
              <NewsletterButton onClick={handleNewsletterClick}>
                Subscribe to Newsletter
              </NewsletterButton>
            </NewsletterSection>
          </FooterColumn>
        </FooterTop>
        
        <FooterBottom>
          <Copyright>© {currentYear} Outrider Real Estate. All rights reserved.</Copyright>
        </FooterBottom>
      </FooterContent>
      
      <NewsletterModal 
        isOpen={isNewsletterModalOpen}
        onClose={handleModalClose}
        pdfFileName={null}
      />
    </FooterContainer>
  );
};

export default Footer;