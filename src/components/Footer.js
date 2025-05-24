import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { FaFacebookF, FaInstagram, FaLinkedinIn, FaEnvelope, FaPhoneAlt, FaMapMarkerAlt } from 'react-icons/fa';

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

const SocialLinks = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 1.5rem;
  
  @media (max-width: ${props => props.theme.breakpoints.md}) {
    justify-content: center;
  }
`;

const SocialLink = styled.a`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: rgba(139, 69, 19, 0.2);
  color: ${props => props.theme.colors.text.secondary};
  transition: all 0.3s ease;
  border: 1px solid ${props => props.theme.colors.border};
  
  &:hover {
    background-color: ${props => props.theme.colors.primary};
    color: white;
    transform: translateY(-3px);
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

const NewsletterForm = styled.form`
  display: flex;
  margin-top: 1rem;
  
  @media (max-width: ${props => props.theme.breakpoints.md}) {
    flex-direction: column;
    align-items: center;
    gap: 1rem;
  }
`;

const NewsletterInput = styled.input`
  flex: 1;
  padding: 0.8rem 1rem;
  border: 1px solid ${props => props.theme.colors.border};
  background-color: rgba(255, 255, 255, 0.1);
  color: white;
  border-radius: 4px 0 0 4px;
  outline: none;
  
  &:focus {
    border-color: ${props => props.theme.colors.text.secondary};
  }
  
  @media (max-width: ${props => props.theme.breakpoints.md}) {
    width: 100%;
    border-radius: 4px;
  }
`;

const NewsletterButton = styled.button`
  background-color: ${props => props.theme.colors.primary};
  color: white;
  border: none;
  padding: 0.8rem 1.5rem;
  border-radius: 0 4px 4px 0;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    background-color: ${props => props.theme.colors.tertiary};
  }
  
  @media (max-width: ${props => props.theme.breakpoints.md}) {
    width: 100%;
    border-radius: 4px;
  }
`;

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
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
            <SocialLinks>
              <SocialLink href="#" aria-label="Facebook">
                <FaFacebookF />
              </SocialLink>
              <SocialLink href="#" aria-label="Instagram">
                <FaInstagram />
              </SocialLink>
              <SocialLink href="#" aria-label="LinkedIn">
                <FaLinkedinIn />
              </SocialLink>
            </SocialLinks>
          </FooterColumn>
          
          <FooterColumn>
            <FooterHeading>Quick Links</FooterHeading>
            <FooterLinks>
              <FooterLink><Link to="/">Home</Link></FooterLink>
              <FooterLink><Link to="/buyers-guide">Buyers Guide</Link></FooterLink>
              <FooterLink><Link to="/sellers-guide">Sellers Guide</Link></FooterLink>
              <FooterLink><Link to="/marketing-plan">Marketing Plan</Link></FooterLink>
              <FooterLink><Link to="/testimonials">Testimonials</Link></FooterLink>
              <FooterLink><Link to="/affiliate">Affiliate Program</Link></FooterLink>
            </FooterLinks>
          </FooterColumn>
          
          <FooterColumn>
            <FooterHeading>Contact Us</FooterHeading>
            <ContactItem>
              <FaEnvelope />
              <a href="mailto:info@outriderrealestate.com">info@outriderrealestate.com</a>
            </ContactItem>
            <ContactItem>
              <FaPhoneAlt />
              <a href="tel:+15551234567">(555) 123-4567</a>
            </ContactItem>
            
            <NewsletterSection>
              <FooterHeading>Monthly Newsletter</FooterHeading>
              <p>Subscribe to our western-themed newsletter</p>
              <NewsletterForm>
                <NewsletterInput type="email" placeholder="Your email" />
                <NewsletterButton type="submit">Subscribe</NewsletterButton>
              </NewsletterForm>
            </NewsletterSection>
          </FooterColumn>
        </FooterTop>
        
        <FooterBottom>
          <Copyright>© {currentYear} Outrider Real Estate. All rights reserved.</Copyright>
        </FooterBottom>
      </FooterContent>
    </FooterContainer>
  );
};

export default Footer;