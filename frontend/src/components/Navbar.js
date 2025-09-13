import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { FiMenu, FiX } from 'react-icons/fi';

const Nav = styled.nav`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  padding: 1rem 0;
  background-color: ${({ scrolled }) => 
    scrolled ? 'rgba(18, 18, 18, 0.95)' : 'transparent'};
  z-index: 8000;
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

// Logo link
const Logo = styled(Link)`
  display: flex;
  align-items: center;
  text-decoration: none;
  color: #d2b48c;
  z-index: 10000;
`;



const LogoImage = styled.img`
  height: 40px;
  width: auto;
  
  @media (max-width: ${props => props.theme.breakpoints.md}) {
    height: 35px;
  }
  
  @media (max-width: ${props => props.theme.breakpoints.sm}) {
    height: 30px;
  }
`;

// Hamburger menu button
const MenuButton = styled.button`
  background: none;
  border: none;
  color: #d2b48c;
  font-size: 24px;
  cursor: pointer;
  z-index: 10000;
  display: none;
  padding: 8px;
  
  @media (max-width: ${props => props.theme.breakpoints.lg}) {
    display: block;
  }
`;

const NavLinks = styled.div`
  display: flex;
  gap: 2rem;
  
  @media (max-width: ${props => props.theme.breakpoints.lg}) {
    display: none;
  }
`;

const NavLink = styled(Link)`
  color: #f5f5f5;
  text-decoration: none;
  font-weight: 500;
  letter-spacing: 0.5px;
  transition: all 0.3s ease;
  position: relative;
  padding: 0.5rem 0.8rem;
  margin: 0 0.2rem;
  border-radius: 4px;
  
  &:after {
    content: '';
    position: absolute;
    width: 0;
    height: 2px;
    bottom: 0;
    left: 50%;
    transform: translateX(-50%);
    background-color: #d2b48c;
    transition: width 0.3s ease;
  }
  
  &:hover {
    color: #d2b48c;
    background-color: rgba(210, 180, 140, 0.05);
    
    &:after {
      width: 80%;
    }
  }
  
  &.active {
    color: #d2b48c;
    
    &:after {
      width: 80%;
    }
  }
`;



// Fullscreen mobile menu overlay
const MobileMenu = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  background-color: #000;
  z-index: 9000;
  display: ${props => props.isOpen ? 'flex' : 'none'};
  flex-direction: column;
  justify-content: center;
  align-items: center;
  overflow: hidden;
`;

// Mobile links container
const MobileNavLinks = styled.div`
  display: flex;
  flex-direction: column;
  gap: 30px;
  text-align: center;
  width: 90%;
  max-width: 300px;
  margin: 0 auto;
  
  @media (min-width: ${props => props.theme.breakpoints.md}) and (max-width: ${props => props.theme.breakpoints.lg}) {
    max-width: 350px;
    gap: 35px;
  }
`;

// Mobile menu link
const MobileNavLink = styled(Link)`
  color: white;
  text-decoration: none;
  font-size: 24px;
  font-weight: 500;
  font-family: ${props => props.theme.fonts.heading};
  padding: 12px 0;
  display: block;
  text-align: center;
  letter-spacing: 1px;
  
  @media (min-width: ${props => props.theme.breakpoints.md}) and (max-width: ${props => props.theme.breakpoints.lg}) {
    font-size: 22px;
  }
  
  @media (max-width: ${props => props.theme.breakpoints.sm}) {
    font-size: 20px;
  }
  
  &:hover, &.active {
    color: #d2b48c;
  }
`;

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  
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
  
  // Close menu when changing routes
  useEffect(() => {
    setMenuOpen(false);
  }, [location]);
  
  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };
  
  const closeMenu = () => {
    setMenuOpen(false);
  };
  
  // Check if a link is active
  const isActive = (path) => {
    if (path === '/' && location.pathname === '/') return true;
    if (path !== '/' && location.pathname.startsWith(path)) return true;
    return false;
  };
  
  return (
    <Nav scrolled={scrolled || menuOpen}>
      <NavContainer>
        <Logo to="/" onClick={closeMenu} style={{position: 'relative'}}>
          <LogoImage src="/logo/text-logo.svg" alt="Outrider Real Estate" />
        </Logo>
        
        <NavLinks>
          <NavLink to="/" className={isActive('/') ? 'active' : ''}>Home</NavLink>
          <NavLink to="/sellers-guide" className={isActive('/sellers-guide') ? 'active' : ''}>Sellers</NavLink>
          <NavLink to="/buyers-guide" className={isActive('/buyers-guide') ? 'active' : ''}>Buyers</NavLink>
          <NavLink to="/best-in-show" className={isActive('/best-in-show') ? 'active' : ''}>Best In Show</NavLink>
          <NavLink to="/contact" className={isActive('/contact') ? 'active' : ''}>Contact</NavLink>
        </NavLinks>
        
        <MenuButton onClick={toggleMenu} aria-label="Toggle navigation menu">
          {menuOpen ? <FiX /> : <FiMenu />}
        </MenuButton>
        
        {/* Full-screen mobile menu */}
        <MobileMenu isOpen={menuOpen}>
          <MobileNavLinks>
            <MobileNavLink to="/" onClick={closeMenu}>Home</MobileNavLink>
            <MobileNavLink to="/sellers-guide" onClick={closeMenu}>Sellers</MobileNavLink>
            <MobileNavLink to="/buyers-guide" onClick={closeMenu}>Buyers</MobileNavLink>
            <MobileNavLink to="/best-in-show" onClick={closeMenu}>Best In Show</MobileNavLink>
            <MobileNavLink to="/contact" onClick={closeMenu}>Contact</MobileNavLink>
          </MobileNavLinks>
        </MobileMenu>
      </NavContainer>
    </Nav>
  );
};

export default Navbar;