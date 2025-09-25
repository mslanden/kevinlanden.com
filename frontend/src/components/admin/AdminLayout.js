import React, { useState } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FaTachometerAlt,
  FaUsers,
  FaEnvelope,
  FaTag,
  FaChartLine,
  FaNewspaper,
  FaSignOutAlt,
  FaBars,
  FaTimes,
  FaUserCircle,
  FaHome,
  FaBuilding
} from 'react-icons/fa';

const LayoutContainer = styled.div`
  display: flex;
  min-height: 100vh;
  background-color: ${props => props.theme.colors.background.dark};
`;

const Sidebar = styled(motion.aside)`
  width: 280px;
  background: linear-gradient(135deg, rgba(20, 20, 20, 0.95) 0%, rgba(10, 10, 10, 0.95) 100%);
  border-right: 1px solid ${props => props.theme.colors.border};
  position: fixed;
  top: 0;
  left: 0;
  height: 100vh;
  overflow-y: auto;
  z-index: 100;
  backdrop-filter: blur(10px);
  box-shadow: 4px 0 15px rgba(0, 0, 0, 0.3);

  @media (max-width: ${props => props.theme.breakpoints.lg}) {
    width: 250px;
  }

  @media (max-width: ${props => props.theme.breakpoints.md}) {
    width: 100%;
    max-width: 300px;
  }
`;

const SidebarHeader = styled.div`
  padding: 2rem 1.5rem;
  border-bottom: 1px solid ${props => props.theme.colors.border};
  background: rgba(139, 69, 19, 0.1);
  position: relative;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 2px;
    background: linear-gradient(90deg, transparent, ${props => props.theme.colors.primary}, transparent);
  }
`;

const UserInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
  
  svg {
    font-size: 2.5rem;
    color: ${props => props.theme.colors.primary};
  }
`;

const UserDetails = styled.div`
  flex: 1;
  
  h3 {
    color: ${props => props.theme.colors.text.secondary};
    font-size: 1.1rem;
    margin-bottom: 0.25rem;
  }
  
  p {
    color: ${props => props.theme.colors.text.muted};
    font-size: 0.9rem;
  }
`;

const NavMenu = styled.nav`
  padding: 1rem 0;
`;

const NavItem = styled.button`
  width: 100%;
  padding: 1rem 1.5rem;
  background: ${props => props.active ? 'rgba(139, 69, 19, 0.2)' : 'transparent'};
  border: none;
  border-left: 3px solid ${props => props.active ? props.theme.colors.primary : 'transparent'};
  color: ${props => props.active ? props.theme.colors.primary : props.theme.colors.text.primary};
  display: flex;
  align-items: center;
  gap: 1rem;
  font-size: 1rem;
  font-weight: ${props => props.active ? '600' : '400'};
  cursor: pointer;
  transition: all 0.3s ease;
  text-align: left;

  &:hover {
    background: rgba(139, 69, 19, 0.1);
    color: ${props => props.theme.colors.primary};
  }

  svg {
    font-size: 1.2rem;
  }
`;

const LogoutButton = styled(NavItem)`
  margin-top: auto;
  border-top: 1px solid ${props => props.theme.colors.border};
  color: ${props => props.theme.colors.text.muted};

  &:hover {
    color: #ff6b6b;
    background: rgba(255, 107, 107, 0.1);
  }
`;

const MainContent = styled.main`
  flex: 1;
  margin-left: 280px;
  padding: 2rem;
  
  @media (max-width: ${props => props.theme.breakpoints.lg}) {
    margin-left: 250px;
  }
  
  @media (max-width: ${props => props.theme.breakpoints.md}) {
    margin-left: 0;
    padding: 1rem;
  }
`;

const MobileMenuButton = styled.button`
  display: none;
  position: fixed;
  top: 1rem;
  left: 1rem;
  background-color: ${props => props.theme.colors.primary};
  color: white;
  border: none;
  padding: 0.75rem;
  border-radius: ${props => props.theme.borderRadius.small};
  cursor: pointer;
  z-index: 101;

  @media (max-width: ${props => props.theme.breakpoints.md}) {
    display: flex;
    align-items: center;
    justify-content: center;
  }
`;

const Overlay = styled(motion.div)`
  display: none;
  
  @media (max-width: ${props => props.theme.breakpoints.md}) {
    display: block;
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.5);
    z-index: 99;
  }
`;

const ContentHeader = styled(motion.div)`
  margin-bottom: 2rem;
  padding-bottom: 1rem;
  border-bottom: 2px solid ${props => props.theme.colors.border};

  h1 {
    font-family: ${props => props.theme.fonts.heading};
    font-size: 2.5rem;
    color: ${props => props.theme.colors.text.secondary};
    margin-bottom: 0.5rem;
    display: flex;
    align-items: center;
    gap: 1rem;
  }

  p {
    color: ${props => props.theme.colors.text.muted};
    font-size: 1.1rem;
  }
`;

const AdminLayout = ({ children, activeTab, onTabChange, user, onLogout }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: FaTachometerAlt, color: '#4CAF50' },
    { id: 'subscribers', label: 'Newsletter Subscribers', icon: FaUsers, color: '#2196F3' },
    { id: 'contacts', label: 'Contact Messages', icon: FaEnvelope, color: '#ff9800' },
    { id: 'listings', label: 'Listings', icon: FaBuilding, color: '#FF5722' },
    { id: 'blowout', label: 'Blowout Sale', icon: FaTag, color: '#f44336' },
    { id: 'market', label: 'Market Data', icon: FaChartLine, color: '#9C27B0' },
    { id: 'newsletter', label: 'Newsletter Generator', icon: FaNewspaper, color: '#00BCD4' },
  ];

  const handleTabChange = (tabId) => {
    onTabChange(tabId);
    setIsMobileMenuOpen(false);
  };

  const getPageTitle = () => {
    const item = menuItems.find(item => item.id === activeTab);
    return item ? item.label : 'Dashboard';
  };

  return (
    <LayoutContainer>
      <MobileMenuButton onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
        {isMobileMenuOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
      </MobileMenuButton>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <Overlay
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsMobileMenuOpen(false)}
          />
        )}
      </AnimatePresence>

      <Sidebar
        initial={{ x: -280 }}
        animate={{ x: isMobileMenuOpen || window.innerWidth > 768 ? 0 : -280 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      >
        <SidebarHeader>
          <UserInfo>
            <FaUserCircle />
            <UserDetails>
              <h3>{user?.name || 'Admin User'}</h3>
              <p>{user?.email || 'admin@outrider.com'}</p>
            </UserDetails>
          </UserInfo>
        </SidebarHeader>

        <NavMenu>
          {menuItems.map((item) => (
            <NavItem
              key={item.id}
              active={activeTab === item.id}
              onClick={() => handleTabChange(item.id)}
            >
              <item.icon style={{ color: activeTab === item.id ? item.color : 'inherit' }} />
              {item.label}
            </NavItem>
          ))}
          
          <LogoutButton onClick={onLogout}>
            <FaSignOutAlt />
            Logout
          </LogoutButton>
        </NavMenu>
      </Sidebar>

      <MainContent>
        <ContentHeader
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1>{getPageTitle()}</h1>
        </ContentHeader>
        {children}
      </MainContent>
    </LayoutContainer>
  );
};

export default AdminLayout;