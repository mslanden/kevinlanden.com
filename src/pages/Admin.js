import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { FaUsers, FaCopy, FaTag, FaRedo, FaSignOutAlt, FaEnvelope, FaTrash, FaCheckCircle } from 'react-icons/fa';
import { getNewsletterSubscribers } from '../utils/api';
import api from '../utils/api';
import AdminLogin from '../components/AdminLogin';

const PageContainer = styled.div`
  padding-top: 80px; /* Account for navbar */
  min-height: 100vh;
  background-color: ${props => props.theme.colors.background.dark};
`;

const PageHeader = styled.div`
  background-color: ${props => props.theme.colors.background.richDark};
  padding: 3rem 0;
  text-align: center;
  border-bottom: 1px solid ${props => props.theme.colors.border};
`;

const HeaderContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1.5rem;
`;

const PageTitle = styled(motion.h1)`
  font-family: ${props => props.theme.fonts.heading};
  font-size: 3rem;
  color: ${props => props.theme.colors.text.secondary};
  margin-bottom: 1rem;
  
  @media (max-width: ${props => props.theme.breakpoints.md}) {
    font-size: 2.5rem;
  }
`;

const PageDescription = styled(motion.p)`
  font-size: 1.1rem;
  color: ${props => props.theme.colors.text.primary};
  max-width: 600px;
  margin: 0 auto;
`;

const ContentSection = styled.section`
  padding: 3rem 0;
`;

const ContentContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1.5rem;
`;

const StatsContainer = styled(motion.div)`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
  margin-bottom: 3rem;
`;

const StatCard = styled(motion.div)`
  background-color: rgba(20, 20, 20, 0.85);
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius.default};
  padding: 2rem;
  text-align: center;
  
  h3 {
    font-size: 2.5rem;
    color: ${props => props.theme.colors.primary};
    margin-bottom: 0.5rem;
  }
  
  p {
    color: ${props => props.theme.colors.text.secondary};
    font-size: 1.1rem;
  }
`;

const CommunitySection = styled(motion.div)`
  margin-bottom: 3rem;
  background-color: rgba(20, 20, 20, 0.85);
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius.default};
  overflow: hidden;
`;

const CommunityHeader = styled.div`
  background-color: rgba(139, 69, 19, 0.2);
  padding: 1.5rem 2rem;
  border-bottom: 1px solid ${props => props.theme.colors.border};
  display: flex;
  justify-content: space-between;
  align-items: center;
  
  h2 {
    font-family: ${props => props.theme.fonts.heading};
    font-size: 1.8rem;
    color: ${props => props.theme.colors.text.secondary};
    margin: 0;
    text-transform: capitalize;
    display: flex;
    align-items: center;
    gap: 1rem;
    
    svg {
      color: ${props => props.theme.colors.primary};
    }
  }
`;

const SubscriberCount = styled.span`
  background-color: ${props => props.theme.colors.primary};
  color: white;
  padding: 0.25rem 1rem;
  border-radius: ${props => props.theme.borderRadius.small};
  font-weight: 600;
`;

const CopyButton = styled.button`
  background-color: ${props => props.theme.colors.primary};
  color: white;
  border: none;
  padding: 0.5rem 1.5rem;
  border-radius: ${props => props.theme.borderRadius.small};
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 600;
  transition: all 0.3s ease;
  
  &:hover {
    background-color: ${props => props.theme.colors.tertiary};
    transform: translateY(-2px);
  }
  
  &:active {
    transform: translateY(0);
  }
`;

const SubscriberList = styled.div`
  padding: 2rem;
`;

const SubscriberTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  
  thead {
    tr {
      border-bottom: 2px solid ${props => props.theme.colors.border};
    }
    
    th {
      text-align: left;
      padding: 1rem;
      color: ${props => props.theme.colors.text.secondary};
      font-weight: 600;
    }
  }
  
  tbody {
    tr {
      border-bottom: 1px solid rgba(255, 255, 255, 0.1);
      
      &:hover {
        background-color: rgba(255, 255, 255, 0.05);
      }
      
      &:last-child {
        border-bottom: none;
      }
    }
    
    td {
      padding: 1rem;
      color: ${props => props.theme.colors.text.primary};
    }
  }
`;


const LoadingMessage = styled.div`
  text-align: center;
  padding: 4rem;
  color: ${props => props.theme.colors.text.primary};
  font-size: 1.2rem;
`;

const ErrorMessage = styled.div`
  text-align: center;
  padding: 2rem;
  color: #ff6b6b;
  background-color: rgba(255, 107, 107, 0.1);
  border: 1px solid rgba(255, 107, 107, 0.3);
  border-radius: ${props => props.theme.borderRadius.default};
  margin: 2rem auto;
  max-width: 600px;
`;

const BlowoutSaleSection = styled(motion.div)`
  margin-bottom: 3rem;
  background-color: rgba(20, 20, 20, 0.85);
  border: 2px solid ${props => props.theme.colors.primary};
  border-radius: ${props => props.theme.borderRadius.default};
  overflow: hidden;
`;

const BlowoutHeader = styled.div`
  background: linear-gradient(135deg, rgba(139, 69, 19, 0.3) 0%, rgba(184, 134, 11, 0.3) 100%);
  padding: 1.5rem 2rem;
  border-bottom: 1px solid ${props => props.theme.colors.border};
  
  h2 {
    font-family: ${props => props.theme.fonts.heading};
    font-size: 2rem;
    color: ${props => props.theme.colors.text.secondary};
    margin: 0;
    display: flex;
    align-items: center;
    gap: 1rem;
    
    svg {
      color: ${props => props.theme.colors.accent};
    }
  }
`;

const BlowoutContent = styled.div`
  padding: 2rem;
`;

const BlowoutStats = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 2rem;
  margin-bottom: 2rem;
`;

const BlowoutStatCard = styled.div`
  text-align: center;
  
  h3 {
    font-size: 3rem;
    color: ${props => props.theme.colors.accent};
    margin: 0;
    font-weight: 700;
  }
  
  p {
    color: ${props => props.theme.colors.text.secondary};
    margin-top: 0.5rem;
    font-size: 1.1rem;
  }
`;

const BlowoutControls = styled.div`
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
  justify-content: center;
  margin-top: 2rem;
`;

const InputGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  
  label {
    color: ${props => props.theme.colors.text.secondary};
    font-weight: 600;
  }
  
  input {
    background-color: rgba(255, 255, 255, 0.1);
    border: 1px solid ${props => props.theme.colors.border};
    color: ${props => props.theme.colors.text.primary};
    padding: 0.5rem 1rem;
    border-radius: ${props => props.theme.borderRadius.small};
    width: 80px;
    text-align: center;
    font-size: 1.1rem;
    
    &:focus {
      outline: none;
      border-color: ${props => props.theme.colors.primary};
    }
  }
`;

const ActionButton = styled.button`
  background-color: ${props => props.variant === 'danger' ? '#ff6b6b' : props.theme.colors.primary};
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: ${props => props.theme.borderRadius.small};
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 600;
  transition: all 0.3s ease;
  font-size: 1rem;
  
  &:hover {
    background-color: ${props => props.variant === 'danger' ? '#ff5252' : props.theme.colors.tertiary};
    transform: translateY(-2px);
  }
  
  &:active {
    transform: translateY(0);
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const SuccessMessage = styled.div`
  text-align: center;
  padding: 1rem;
  color: #51cf66;
  background-color: rgba(81, 207, 102, 0.1);
  border: 1px solid rgba(81, 207, 102, 0.3);
  border-radius: ${props => props.theme.borderRadius.small};
  margin-top: 1rem;
`;

// Contact Submissions Styles
const ContactSubmissionsSection = styled(motion.div)`
  margin-bottom: 3rem;
  background-color: rgba(20, 20, 20, 0.85);
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius.default};
  overflow: hidden;
`;

const ContactMessage = styled.div`
  padding: 1.5rem;
  border-bottom: 1px solid ${props => props.theme.colors.border};
  
  &:last-child {
    border-bottom: none;
  }
  
  &.unread {
    background-color: rgba(139, 69, 19, 0.1);
  }
`;

const MessageHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1rem;
`;

const MessageInfo = styled.div`
  flex: 1;
  
  h4 {
    color: ${props => props.theme.colors.text.secondary};
    margin-bottom: 0.5rem;
    font-size: 1.2rem;
  }
  
  p {
    color: ${props => props.theme.colors.text.muted};
    font-size: 0.9rem;
    margin-bottom: 0.25rem;
  }
`;

const MessageActions = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const ActionButton = styled.button`
  background: ${props => props.variant === 'danger' ? '#ff4444' : '#4CAF50'};
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: ${props => props.theme.borderRadius.small};
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.9rem;
  transition: all 0.3s ease;
  
  &:hover {
    opacity: 0.8;
    transform: translateY(-1px);
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const MessageContent = styled.div`
  color: ${props => props.theme.colors.text.primary};
  line-height: 1.6;
  white-space: pre-wrap;
`;

const LogoutButton = styled.button`
  position: fixed;
  top: 100px;
  right: 2rem;
  background-color: ${props => props.theme.colors.primary};
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: ${props => props.theme.borderRadius.small};
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 600;
  transition: all 0.3s ease;
  z-index: 1000;
  
  &:hover {
    background-color: ${props => props.theme.colors.tertiary};
  }
`;

const Admin = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [subscribers, setSubscribers] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [copiedCommunity, setCopiedCommunity] = useState(null);
  
  // Blowout Sale States
  const [blowoutSale, setBlowoutSale] = useState(null);
  const [spotsRemaining, setSpotsRemaining] = useState(25);
  const [totalSpots, setTotalSpots] = useState(25);
  const [blowoutLoading, setBlowoutLoading] = useState(false);
  const [blowoutSuccess, setBlowoutSuccess] = useState('');
  
  // Contact Submissions States
  const [contactSubmissions, setContactSubmissions] = useState([]);
  const [contactLoading, setContactLoading] = useState(false);
  
  useEffect(() => {
    window.scrollTo(0, 0);
    
    // Check if user is already logged in
    const token = localStorage.getItem('adminToken');
    const savedUser = localStorage.getItem('adminUser');
    
    if (token && savedUser) {
      try {
        const userData = JSON.parse(savedUser);
        setIsAuthenticated(true);
        setUser(userData);
        fetchSubscribers();
        fetchBlowoutSaleStatus();
        fetchContactSubmissions();
      } catch (error) {
        console.error('Error parsing saved user data:', error);
        // Clear invalid data
        localStorage.removeItem('adminToken');
        localStorage.removeItem('adminUser');
        setLoading(false);
      }
    } else {
      setLoading(false);
    }
  }, []);
  
  const [headerRef, headerInView] = useInView({
    triggerOnce: true,
    threshold: 0.2,
  });
  
  const [contentRef, contentInView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });
  
  const fetchSubscribers = async () => {
    try {
      const data = await getNewsletterSubscribers();
      setSubscribers(data);
    } catch (err) {
      setError('Failed to load subscribers. Please try again later.');
      console.error('Error fetching subscribers:', err);
    } finally {
      setLoading(false);
    }
  };
  
  const fetchBlowoutSaleStatus = async () => {
    try {
      const response = await api.get('/blowout-sale/status');
      setBlowoutSale(response.data);
      setSpotsRemaining(response.data.spotsRemaining);
      setTotalSpots(response.data.totalSpots);
    } catch (err) {
      console.error('Error fetching blowout sale status:', err);
    }
  };
  
  const updateBlowoutSale = async () => {
    setBlowoutLoading(true);
    setBlowoutSuccess('');
    try {
      await api.put('/blowout-sale/update', {
        spots_remaining: spotsRemaining,
        total_spots: totalSpots,
        is_active: true
      });
      await fetchBlowoutSaleStatus();
      setBlowoutSuccess('Blowout sale updated successfully!');
      setTimeout(() => setBlowoutSuccess(''), 3000);
    } catch (err) {
      console.error('Error updating blowout sale:', err);
    } finally {
      setBlowoutLoading(false);
    }
  };
  
  const resetBlowoutSale = async () => {
    if (!window.confirm('Are you sure you want to reset the blowout sale? This will create a new sale with 25 spots.')) {
      return;
    }
    
    setBlowoutLoading(true);
    setBlowoutSuccess('');
    try {
      await api.post('/blowout-sale/reset', { total_spots: 25 });
      await fetchBlowoutSaleStatus();
      setBlowoutSuccess('Blowout sale reset successfully!');
      setTimeout(() => setBlowoutSuccess(''), 3000);
    } catch (err) {
      console.error('Error resetting blowout sale:', err);
    } finally {
      setBlowoutLoading(false);
    }
  };
  
  const fetchContactSubmissions = async () => {
    setContactLoading(true);
    try {
      const response = await api.get('/contact/submissions');
      setContactSubmissions(response.data);
    } catch (err) {
      console.error('Error fetching contact submissions:', err);
    } finally {
      setContactLoading(false);
    }
  };
  
  const markAsRead = async (id) => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:3001/api'}/contact/submissions/${id}/read`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
        }
      });
      
      if (response.ok) {
        setContactSubmissions(prev => 
          prev.map(submission => 
            submission.id === id 
              ? { ...submission, read: true } 
              : submission
          )
        );
      }
    } catch (err) {
      console.error('Error marking submission as read:', err);
    }
  };
  
  const deleteSubmission = async (id) => {
    if (!window.confirm('Are you sure you want to delete this submission?')) {
      return;
    }
    
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:3001/api'}/contact/submissions/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
        }
      });
      
      if (response.ok) {
        setContactSubmissions(prev => prev.filter(submission => submission.id !== id));
      }
    } catch (err) {
      console.error('Error deleting submission:', err);
    }
  };
  
  const handleLoginSuccess = (token, userData) => {
    setIsAuthenticated(true);
    setUser(userData);
    setLoading(true);
    fetchSubscribers();
    fetchBlowoutSaleStatus();
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
    setIsAuthenticated(false);
    setUser(null);
    setSubscribers(null);
    setBlowoutSale(null);
  };

  const copyEmailsToClipboard = (community) => {
    const emails = subscribers.subscribersByCommunity[community]
      .map(sub => sub.email)
      .join(', ');
    
    navigator.clipboard.writeText(emails).then(() => {
      setCopiedCommunity(community);
      setTimeout(() => setCopiedCommunity(null), 2000);
    });
  };
  
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };
  
  // Show login form if not authenticated
  if (!isAuthenticated) {
    return (
      <PageContainer>
        <PageHeader>
          <HeaderContent>
            <PageTitle>Newsletter Admin</PageTitle>
          </HeaderContent>
        </PageHeader>
        <AdminLogin onLoginSuccess={handleLoginSuccess} />
      </PageContainer>
    );
  }

  if (loading) {
    return (
      <PageContainer>
        <LogoutButton onClick={handleLogout}>
          <FaSignOutAlt />
          Logout
        </LogoutButton>
        <PageHeader>
          <HeaderContent>
            <PageTitle>Newsletter Admin</PageTitle>
          </HeaderContent>
        </PageHeader>
        <LoadingMessage>Loading subscribers...</LoadingMessage>
      </PageContainer>
    );
  }
  
  if (error) {
    return (
      <PageContainer>
        <LogoutButton onClick={handleLogout}>
          <FaSignOutAlt />
          Logout
        </LogoutButton>
        <PageHeader>
          <HeaderContent>
            <PageTitle>Newsletter Admin</PageTitle>
          </HeaderContent>
        </PageHeader>
        <ErrorMessage>{error}</ErrorMessage>
      </PageContainer>
    );
  }
  
  const communities = ['anza', 'aguanga', 'idyllwild', 'mountain-center'];
  
  return (
    <PageContainer>
      <LogoutButton onClick={handleLogout}>
        <FaSignOutAlt />
        Logout
      </LogoutButton>
      <PageHeader ref={headerRef}>
        <HeaderContent>
          <PageTitle
            initial={{ opacity: 0, y: 30 }}
            animate={headerInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.8 }}
          >
            Newsletter Admin
          </PageTitle>
          <PageDescription
            initial={{ opacity: 0, y: 30 }}
            animate={headerInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Manage newsletter subscribers and export email lists for each community
          </PageDescription>
        </HeaderContent>
      </PageHeader>
      
      <ContentSection>
        <ContentContainer ref={contentRef}>
          {/* Blowout Sale Management Section */}
          <BlowoutSaleSection
            initial={{ opacity: 0, y: 30 }}
            animate={contentInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.6 }}
          >
            <BlowoutHeader>
              <h2>
                <FaTag />
                2025 Blowout Sale Management
              </h2>
            </BlowoutHeader>
            <BlowoutContent>
              <BlowoutStats>
                <BlowoutStatCard>
                  <h3>{blowoutSale?.spotsRemaining || spotsRemaining}</h3>
                  <p>Spots Remaining</p>
                </BlowoutStatCard>
                <BlowoutStatCard>
                  <h3>{blowoutSale?.totalSpots || totalSpots}</h3>
                  <p>Total Spots</p>
                </BlowoutStatCard>
                <BlowoutStatCard>
                  <h3>{blowoutSale ? (blowoutSale.totalSpots - blowoutSale.spotsRemaining) : 0}</h3>
                  <p>Spots Claimed</p>
                </BlowoutStatCard>
              </BlowoutStats>
              
              <BlowoutControls>
                <InputGroup>
                  <label>Spots Remaining:</label>
                  <input
                    type="number"
                    value={spotsRemaining}
                    onChange={(e) => setSpotsRemaining(parseInt(e.target.value) || 0)}
                    min="0"
                    max={totalSpots}
                  />
                </InputGroup>
                
                <InputGroup>
                  <label>Total Spots:</label>
                  <input
                    type="number"
                    value={totalSpots}
                    onChange={(e) => setTotalSpots(parseInt(e.target.value) || 0)}
                    min="1"
                  />
                </InputGroup>
                
                <ActionButton
                  onClick={updateBlowoutSale}
                  disabled={blowoutLoading}
                >
                  Update Sale
                </ActionButton>
                
                <ActionButton
                  variant="danger"
                  onClick={resetBlowoutSale}
                  disabled={blowoutLoading}
                >
                  <FaRedo />
                  Reset Sale
                </ActionButton>
              </BlowoutControls>
              
              {blowoutSuccess && (
                <SuccessMessage>{blowoutSuccess}</SuccessMessage>
              )}
            </BlowoutContent>
          </BlowoutSaleSection>
          
          {/* Contact Submissions Section */}
          <ContactSubmissionsSection
            initial={{ opacity: 0, y: 30 }}
            animate={contentInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <CommunityHeader>
              <h2>
                <FaEnvelope />
                Contact Submissions
              </h2>
              <SubscriberCount>
                {contactSubmissions.length} messages
              </SubscriberCount>
            </CommunityHeader>
            <div style={{ padding: '0' }}>
              {contactLoading ? (
                <LoadingMessage>Loading contact submissions...</LoadingMessage>
              ) : contactSubmissions.length > 0 ? (
                contactSubmissions.map((submission) => (
                  <ContactMessage 
                    key={submission.id}
                    className={!submission.read ? 'unread' : ''}
                  >
                    <MessageHeader>
                      <MessageInfo>
                        <h4>{submission.subject}</h4>
                        <p><strong>From:</strong> {submission.name} ({submission.email})</p>
                        {submission.phone && <p><strong>Phone:</strong> {submission.phone}</p>}
                        <p><strong>Submitted:</strong> {new Date(submission.created_at).toLocaleString()}</p>
                      </MessageInfo>
                      <MessageActions>
                        {!submission.read && (
                          <ActionButton onClick={() => markAsRead(submission.id)}>
                            <FaCheckCircle />
                            Mark Read
                          </ActionButton>
                        )}
                        <ActionButton 
                          variant="danger" 
                          onClick={() => deleteSubmission(submission.id)}
                        >
                          <FaTrash />
                          Delete
                        </ActionButton>
                      </MessageActions>
                    </MessageHeader>
                    <MessageContent>{submission.message}</MessageContent>
                  </ContactMessage>
                ))
              ) : (
                <p style={{ textAlign: 'center', color: '#999', padding: '2rem' }}>
                  No contact submissions yet
                </p>
              )}
            </div>
          </ContactSubmissionsSection>
          
          <StatsContainer
            initial={{ opacity: 0, y: 30 }}
            animate={contentInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.6 }}
          >
            <StatCard>
              <h3>{subscribers?.total || 0}</h3>
              <p>Total Subscribers</p>
            </StatCard>
            {communities.map(community => (
              <StatCard key={community}>
                <h3>{subscribers?.subscribersByCommunity[community]?.length || 0}</h3>
                <p>{community.charAt(0).toUpperCase() + community.slice(1).replace('-', ' ')}</p>
              </StatCard>
            ))}
          </StatsContainer>
          
          {communities.map((community, index) => (
            <CommunitySection
              key={community}
              initial={{ opacity: 0, y: 30 }}
              animate={contentInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
              transition={{ duration: 0.6, delay: 0.1 * (index + 1) }}
            >
              <CommunityHeader>
                <h2>
                  <FaUsers />
                  {community.charAt(0).toUpperCase() + community.slice(1).replace('-', ' ')} Subscribers
                </h2>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <SubscriberCount>
                    {subscribers?.subscribersByCommunity[community]?.length || 0} subscribers
                  </SubscriberCount>
                  <CopyButton onClick={() => copyEmailsToClipboard(community)}>
                    <FaCopy />
                    {copiedCommunity === community ? 'Copied!' : 'Copy Emails'}
                  </CopyButton>
                </div>
              </CommunityHeader>
              <SubscriberList>
                {subscribers?.subscribersByCommunity[community]?.length > 0 ? (
                  <SubscriberTable>
                    <thead>
                      <tr>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Subscribed Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {subscribers.subscribersByCommunity[community].map((subscriber, idx) => (
                        <tr key={idx}>
                          <td>{subscriber.name}</td>
                          <td>{subscriber.email}</td>
                          <td>{formatDate(subscriber.subscribedAt)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </SubscriberTable>
                ) : (
                  <p style={{ textAlign: 'center', color: '#999', padding: '2rem' }}>
                    No subscribers yet for this community
                  </p>
                )}
              </SubscriberList>
            </CommunitySection>
          ))}
        </ContentContainer>
      </ContentSection>
    </PageContainer>
  );
};

export default Admin;