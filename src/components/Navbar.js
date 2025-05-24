import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { FiMenu, FiX } from 'react-icons/fi';

const Nav = styled.nav`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  padding: 1rem 0;
  background-color: ${({ scrolled }) => 
    scrolled ? 'rgba(18, 18, 18, 0.95)' : 'transparent'};
  z-index: 1000;
  transition: background-color 0.3s ease, box-shadow 0.3s ease;
  box-shadow: ${({ scrolled }) => 
    scrolled ? '0 2px 10px rgba(0, 0, 0, 0.2)' : 'none'};
  backdrop-filter: ${({ scrolled }) => 
    scrolled ? 'blur(5px)' : 'none'};
`;

const NavContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1.5rem;
  
  @media (max-width: ${props => props.theme.breakpoints.sm}) {
    padding: 0 1rem;
  }
`;

const Logo = styled(Link)`
  display: flex;
  align-items: center;
  text-decoration: none;
  color: #d2b48c;
  z-index: 1001;
`;

const LogoImage = styled.img`
  height: 40px;
  margin-right: 0.8rem;
`;

const LogoText = styled.span`
  font-family: ${props => props.theme.fonts.heading};
  font-size: 1.5rem;
  font-weight: 600;
  letter-spacing: 1px;
  
  @media (max-width: ${props => props.theme.breakpoints.md}) {
    font-size: 1.2rem;
  }
  
  @media (max-width: ${props => props.theme.breakpoints.sm}) {
    font-size: 1rem;
  }
`;

const MenuButton = styled.button`
  background: none;
  border: none;
  color: #d2b48c;
  font-size: 1.5rem;
  cursor: pointer;
  z-index: 1001;
  display: none;
  padding: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  
  @media (max-width: ${props => props.theme.breakpoints.md}) {
    display: flex;
  }
  
  @media (max-width: ${props => props.theme.breakpoints.sm}) {
    font-size: 1.3rem;
    padding: 0.3rem;
  }
`;

const NavLinks = styled.div`
  display: flex;
  gap: 2rem;
  
  @media (max-width: ${props => props.theme.breakpoints.md}) {
    display: none;
  }
`;

const NavLink = styled(Link)`
  color: #f5f5f5;
  text-decoration: none;
  font-weight: 500;
  letter-spacing: 0.5px;
  transition: color 0.3s ease;
  position: relative;
  padding: 0.3rem 0;
  
  &:after {
    content: '';
    position: absolute;
    width: 0;
    height: 2px;
    bottom: 0;
    left: 0;
    background-color: #d2b48c;
    transition: width 0.3s ease;
  }
  
  &:hover {
    color: #d2b48c;
    
    &:after {
      width: 100%;
    }
  }
  
  &.active {
    color: #d2b48c;
    
    &:after {
      width: 100%;
    }
  }
`;

const MobileMenu = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(18, 18, 18, 0.98);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  padding: 4rem 1.5rem 2rem 1.5rem;
  overflow-y: auto; /* Allow scrolling if needed */
`;

const MobileNavLinks = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
  text-align: center;
  width: 100%;
  padding: 1rem;
  
  @media (max-width: ${props => props.theme.breakpoints.sm}) {
    gap: 1.5rem;
  }
`;

const MobileNavLink = styled(Link)`
  color: #f5f5f5;
  text-decoration: none;
  font-size: 1.5rem;
  font-weight: 500;
  letter-spacing: 1px;
  transition: color 0.3s ease;
  font-family: ${props => props.theme.fonts.heading};
  padding: 0.5rem 0;
  
  @media (max-width: ${props => props.theme.breakpoints.sm}) {
    font-size: 1.2rem;
  }
  
  &:hover {
    color: #d2b48c;
  }
`;

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  
  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 50;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [scrolled]);
  
  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };
  
  const closeMenu = () => {
    setMenuOpen(false);
  };
  
  return (
    <Nav scrolled={scrolled || menuOpen}>
      <NavContainer>
        <Logo to="/" onClick={closeMenu}>
          <LogoText>OUTRIDER</LogoText>
        </Logo>
        
        <NavLinks>
          <NavLink to="/">Home</NavLink>
          <NavLink to="/buyers-guide">Buyers Guide</NavLink>
          <NavLink to="/sellers-guide">Sellers Guide</NavLink>
          <NavLink to="/marketing-plan">Marketing Plan</NavLink>
          <NavLink to="/testimonials">Testimonials</NavLink>
          <NavLink to="/affiliate">Affiliate Program</NavLink>
        </NavLinks>
        
        <MenuButton onClick={toggleMenu}>
          {menuOpen ? <FiX /> : <FiMenu />}
        </MenuButton>
        
        <AnimatePresence>
          {menuOpen && (
            <MobileMenu
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <MobileNavLinks>
                <MobileNavLink to="/" onClick={closeMenu}>Home</MobileNavLink>
                <MobileNavLink to="/buyers-guide" onClick={closeMenu}>Buyers Guide</MobileNavLink>
                <MobileNavLink to="/sellers-guide" onClick={closeMenu}>Sellers Guide</MobileNavLink>
                <MobileNavLink to="/marketing-plan" onClick={closeMenu}>Marketing Plan</MobileNavLink>
                <MobileNavLink to="/testimonials" onClick={closeMenu}>Testimonials</MobileNavLink>
                <MobileNavLink to="/affiliate" onClick={closeMenu}>Affiliate Program</MobileNavLink>
              </MobileNavLinks>
            </MobileMenu>
          )}
        </AnimatePresence>
      </NavContainer>
    </Nav>
  );
};

export default Navbar;