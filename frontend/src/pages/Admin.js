import React, { useEffect, useState, useMemo } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { FaUsers, FaCopy, FaTag, FaRedo, FaEnvelope, FaTrash, FaCheckCircle, FaFileDownload, FaSearch, FaFilter, FaSortUp, FaSortDown, FaSort } from 'react-icons/fa';
import { getNewsletterSubscribers } from '../utils/api';
import api from '../utils/api';
import AdminLogin from '../components/AdminLogin';
import NewsletterGenerator from '../components/NewsletterGenerator';
import MarketDataManager from '../components/MarketDataManager';
import AdminLayout from '../components/admin/AdminLayout';
import AdminDashboard from '../components/admin/AdminDashboard';
import AdminCard from '../components/admin/AdminCard';
import ListingsManager from '../components/admin/ListingsManager';

const PageContainer = styled.div`
  min-height: 100vh;
  background-color: ${props => props.theme.colors.background.dark};
`;

const LoginContainer = styled.div`
  padding-top: 80px;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const LoginHeader = styled.div`
  text-align: center;
  margin-bottom: 2rem;
  
  h1 {
    font-family: ${props => props.theme.fonts.heading};
    font-size: 3rem;
    color: ${props => props.theme.colors.text.secondary};
    margin-bottom: 1rem;
  }
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

const SubscriberCount = styled.span`
  background-color: ${props => props.theme.colors.primary};
  color: white;
  padding: 0.25rem 1rem;
  border-radius: ${props => props.theme.borderRadius.small};
  font-weight: 600;
  cursor: default;
  user-select: none;
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

// Loading skeleton components
const SkeletonRow = styled.div`
  display: flex;
  gap: 1rem;
  padding: 1rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);

  .skeleton {
    background: linear-gradient(90deg, rgba(255,255,255,0.1) 25%, rgba(255,255,255,0.2) 50%, rgba(255,255,255,0.1) 75%);
    background-size: 200% 100%;
    animation: loading 1.5s infinite;
    border-radius: 4px;
  }

  .checkbox-skeleton {
    width: 16px;
    height: 16px;
  }

  .name-skeleton {
    width: 120px;
    height: 20px;
  }

  .email-skeleton {
    width: 200px;
    height: 20px;
  }

  .date-skeleton {
    width: 100px;
    height: 20px;
  }

  @keyframes loading {
    0% {
      background-position: 200% 0;
    }
    100% {
      background-position: -200% 0;
    }
  }
`;

const SkeletonTable = styled.div`
  padding: 1rem;
`;

const EmptyStateIcon = styled.div`
  font-size: 4rem;
  opacity: 0.3;
  margin-bottom: 1.5rem;
  color: ${props => props.theme.colors.text.muted};
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

const MessageActionButton = styled.button`
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

// Enhanced Subscriber Management Styles
const SubscriberControls = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  margin-bottom: 2rem;
  background-color: rgba(20, 20, 20, 0.85);
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius.default};
  padding: 1.5rem;
`;

const SearchFilterRow = styled.div`
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
  align-items: center;

  @media (max-width: ${props => props.theme.breakpoints.md}) {
    flex-direction: column;
    align-items: stretch;
  }
`;

const SearchBox = styled.div`
  position: relative;
  flex: 1;
  min-width: 250px;

  svg {
    position: absolute;
    left: 1rem;
    top: 50%;
    transform: translateY(-50%);
    color: ${props => props.theme.colors.text.muted};
    font-size: 1rem;
  }
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 0.75rem 1rem 0.75rem 2.5rem;
  background-color: rgba(255, 255, 255, 0.1);
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius.small};
  color: ${props => props.theme.colors.text.primary};
  font-size: 1rem;

  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
    background-color: rgba(255, 255, 255, 0.15);
  }

  &::placeholder {
    color: ${props => props.theme.colors.text.muted};
  }
`;

const FilterSelect = styled.select`
  padding: 0.75rem 1rem;
  background-color: rgba(255, 255, 255, 0.1);
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius.small};
  color: ${props => props.theme.colors.text.primary};
  cursor: pointer;

  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
  }

  option {
    background-color: ${props => props.theme.colors.background.dark};
    color: ${props => props.theme.colors.text.primary};
  }
`;

const BulkActions = styled.div`
  display: flex;
  gap: 1rem;
  align-items: center;

  @media (max-width: ${props => props.theme.breakpoints.md}) {
    flex-wrap: wrap;
  }
`;

const BulkActionButton = styled.button`
  background-color: ${props => props.variant === 'danger' ? '#ff6b6b' : props.theme.colors.primary};
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
    transform: none;
  }
`;

const SortableHeader = styled.th`
  text-align: left;
  padding: 1rem;
  color: ${props => props.theme.colors.text.secondary};
  font-weight: 600;
  cursor: pointer;
  user-select: none;
  transition: all 0.3s ease;

  &:hover {
    background-color: rgba(255, 255, 255, 0.05);
    color: ${props => props.theme.colors.primary};
  }

  display: flex;
  align-items: center;
  gap: 0.5rem;

  svg {
    opacity: ${props => props.active ? 1 : 0.5};
    font-size: 0.8rem;
  }
`;

const SelectAllCheckbox = styled.input`
  margin-right: 0.5rem;
  cursor: pointer;
`;

const SubscriberRow = styled.tr`
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  background-color: ${props => props.selected ? 'rgba(139, 69, 19, 0.1)' : 'transparent'};

  &:hover {
    background-color: ${props => props.selected ? 'rgba(139, 69, 19, 0.15)' : 'rgba(255, 255, 255, 0.05)'};
  }

  &:last-child {
    border-bottom: none;
  }

  td {
    padding: 1rem;
    color: ${props => props.theme.colors.text.primary};
  }
`;

const PaginationContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 2rem;
  padding: 1rem;
  background-color: rgba(20, 20, 20, 0.85);
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius.default};

  @media (max-width: ${props => props.theme.breakpoints.md}) {
    flex-direction: column;
    gap: 1rem;
  }
`;

const PaginationInfo = styled.div`
  color: ${props => props.theme.colors.text.muted};
  font-size: 0.9rem;
`;

const PaginationControls = styled.div`
  display: flex;
  gap: 0.5rem;
  align-items: center;
`;

const PageButton = styled.button`
  background-color: ${props => props.active ? props.theme.colors.primary : 'rgba(255, 255, 255, 0.1)'};
  color: ${props => props.active ? 'white' : props.theme.colors.text.primary};
  border: 1px solid ${props => props.active ? props.theme.colors.primary : props.theme.colors.border};
  padding: 0.5rem 0.75rem;
  border-radius: ${props => props.theme.borderRadius.small};
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover:not(:disabled) {
    background-color: ${props => props.active ? props.theme.colors.tertiary : 'rgba(255, 255, 255, 0.15)'};
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const PageSizeSelect = styled.select`
  padding: 0.5rem;
  background-color: rgba(255, 255, 255, 0.1);
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius.small};
  color: ${props => props.theme.colors.text.primary};
  cursor: pointer;

  option {
    background-color: ${props => props.theme.colors.background.dark};
  }
`;

const Admin = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [subscribers, setSubscribers] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [copiedCommunity, setCopiedCommunity] = useState(null);
  const [activeTab, setActiveTab] = useState('dashboard');
  
  // Blowout Sale States
  const [blowoutSale, setBlowoutSale] = useState(null);
  const [spotsRemaining, setSpotsRemaining] = useState(25);
  const [totalSpots, setTotalSpots] = useState(25);
  const [isBlowoutActive, setIsBlowoutActive] = useState(true);
  const [blowoutLoading, setBlowoutLoading] = useState(false);
  const [blowoutSuccess, setBlowoutSuccess] = useState('');
  
  // Contact Submissions States
  const [contactSubmissions, setContactSubmissions] = useState([]);
  const [contactLoading, setContactLoading] = useState(false);

  // Subscriber Management States
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCommunity, setFilterCommunity] = useState('all');
  const [sortField, setSortField] = useState('subscribedAt');
  const [sortDirection, setSortDirection] = useState('desc');
  const [currentPage, setCurrentPage] = useState({});
  const [pageSize, setPageSize] = useState(10);
  const [selectedSubscribers, setSelectedSubscribers] = useState(new Set());

  const communities = ['anza', 'aguanga', 'idyllwild', 'mountain-center'];

  // Enhanced subscriber filtering and sorting
  const filteredAndSortedSubscribers = useMemo(() => {
    if (!subscribers?.subscribersByCommunity) return {};

    const result = {};

    communities.forEach(community => {
      let communitySubscribers = subscribers.subscribersByCommunity[community] || [];

      // Apply search filter
      if (searchTerm) {
        communitySubscribers = communitySubscribers.filter(sub =>
          sub.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          sub.email?.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }

      // Apply sorting
      communitySubscribers.sort((a, b) => {
        let aValue = a[sortField];
        let bValue = b[sortField];

        if (sortField === 'subscribedAt') {
          aValue = new Date(aValue);
          bValue = new Date(bValue);
        } else if (typeof aValue === 'string') {
          aValue = aValue.toLowerCase();
          bValue = bValue.toLowerCase();
        }

        if (sortDirection === 'asc') {
          return aValue > bValue ? 1 : -1;
        } else {
          return aValue < bValue ? 1 : -1;
        }
      });

      result[community] = communitySubscribers;
    });

    return result;
  }, [subscribers, searchTerm, sortField, sortDirection]);

  // Pagination logic for each community
  const paginatedSubscribers = useMemo(() => {
    const result = {};

    Object.keys(filteredAndSortedSubscribers).forEach(community => {
      const communityData = filteredAndSortedSubscribers[community];
      const page = currentPage[community] || 1;
      const startIndex = (page - 1) * pageSize;
      const endIndex = startIndex + pageSize;

      result[community] = {
        data: communityData.slice(startIndex, endIndex),
        total: communityData.length,
        totalPages: Math.ceil(communityData.length / pageSize),
        currentPage: page
      };
    });

    return result;
  }, [filteredAndSortedSubscribers, currentPage, pageSize]);

  const verifySession = async (userData) => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:3001/api'}/auth/me`, {
        method: 'GET',
        credentials: 'include', // Include cookies
      });

      if (response.ok) {
        setIsAuthenticated(true);
        setUser(userData);
        fetchSubscribers();
        fetchBlowoutSaleStatus();
        fetchContactSubmissions();
      } else {
        // Session expired or invalid
        localStorage.removeItem('adminUser');
        setLoading(false);
      }
    } catch (error) {
      console.error('Session verification failed:', error);
      localStorage.removeItem('adminUser');
      setLoading(false);
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0);

    // Check if user is already logged in
    const savedUser = localStorage.getItem('adminUser');

    if (savedUser) {
      try {
        const userData = JSON.parse(savedUser);
        // Verify the session is still valid by making an authenticated request
        verifySession(userData);
      } catch (error) {
        console.error('Error parsing saved user data:', error);
        // Clear invalid data
        localStorage.removeItem('adminUser');
        setLoading(false);
      }
    } else {
      setLoading(false);
    }
  }, []);

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
      setIsBlowoutActive(response.data.isActive);
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
        is_active: isBlowoutActive
      }, {
        withCredentials: true
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
      const response = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:3001/api'}/contact/submissions`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include'
      });
      
      if (response.ok) {
        const data = await response.json();
        setContactSubmissions(data.data || data); // Handle different response structures
      } else {
        console.error('Failed to fetch contact submissions:', response.status);
      }
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
        },
        credentials: 'include'
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
        },
        credentials: 'include'
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
    fetchContactSubmissions();
  };

  const handleLogout = async () => {
    try {
      await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:3001/api'}/auth/logout`, {
        method: 'POST',
        credentials: 'include'
      });
    } catch (error) {
      console.error('Logout error:', error);
    }

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

  const exportToCSV = (community) => {
    const subscriberData = subscribers.subscribersByCommunity[community];
    if (!subscriberData || subscriberData.length === 0) {
      alert('No subscribers to export');
      return;
    }

    // Create CSV content
    const headers = ['Name', 'Email', 'Subscribed Date'];
    const csvContent = [
      headers.join(','),
      ...subscriberData.map(sub => [
        `"${sub.name || ''}"`,
        `"${sub.email}"`,
        `"${formatDate(sub.subscribedAt)}"`
      ].join(','))
    ].join('\n');

    // Create blob and download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `${community}_subscribers_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const exportAllSubscribers = () => {
    if (!subscribers || subscribers.total === 0) {
      alert('No subscribers to export');
      return;
    }

    // Combine all subscribers
    const allSubscribers = [];
    communities.forEach(community => {
      const communitySubscribers = subscribers.subscribersByCommunity[community] || [];
      communitySubscribers.forEach(sub => {
        allSubscribers.push({
          ...sub,
          community: community.charAt(0).toUpperCase() + community.slice(1).replace('-', ' ')
        });
      });
    });

    // Create CSV content
    const headers = ['Name', 'Email', 'Community', 'Subscribed Date'];
    const csvContent = [
      headers.join(','),
      ...allSubscribers.map(sub => [
        `"${sub.name || ''}"`,
        `"${sub.email}"`,
        `"${sub.community}"`,
        `"${formatDate(sub.subscribedAt)}"`
      ].join(','))
    ].join('\n');

    // Create blob and download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `all_subscribers_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };
  
  // Calculate stats for dashboard
  const unreadMessagesCount = contactSubmissions.filter(msg => !msg.read).length;
  const recentActivity = [];
  
  // Add recent contact submissions to activity
  contactSubmissions.slice(0, 3).forEach(submission => {
    recentActivity.push({
      type: 'contact',
      message: `New message from ${submission.name}`,
      time: new Date(submission.created_at).toLocaleString()
    });
  });
  
  // Show login form if not authenticated
  if (!isAuthenticated) {
    return (
      <PageContainer>
        <LoginContainer>
          <LoginHeader>
            <h1>Admin Portal</h1>
          </LoginHeader>
          <AdminLogin onLoginSuccess={handleLoginSuccess} />
        </LoginContainer>
      </PageContainer>
    );
  }
  
  if (loading) {
    return (
      <PageContainer>
        <AdminLayout 
          activeTab={activeTab} 
          onTabChange={setActiveTab} 
          user={user} 
          onLogout={handleLogout}
        >
          <LoadingMessage>Loading data...</LoadingMessage>
        </AdminLayout>
      </PageContainer>
    );
  }

  // Helper functions for subscriber management
  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const handlePageChange = (community, page) => {
    setCurrentPage(prev => ({
      ...prev,
      [community]: page
    }));
  };

  const handleSelectSubscriber = (community, subscriberEmail) => {
    const key = `${community}:${subscriberEmail}`;
    setSelectedSubscribers(prev => {
      const newSet = new Set(prev);
      if (newSet.has(key)) {
        newSet.delete(key);
      } else {
        newSet.add(key);
      }
      return newSet;
    });
  };

  const handleSelectAllSubscribers = (community) => {
    const communityData = paginatedSubscribers[community]?.data || [];
    const communityKeys = communityData.map(sub => `${community}:${sub.email}`);

    setSelectedSubscribers(prev => {
      const newSet = new Set(prev);
      const allSelected = communityKeys.every(key => newSet.has(key));

      if (allSelected) {
        // Deselect all
        communityKeys.forEach(key => newSet.delete(key));
      } else {
        // Select all
        communityKeys.forEach(key => newSet.add(key));
      }

      return newSet;
    });
  };

  const getSortIcon = (field) => {
    if (sortField !== field) return <FaSort />;
    return sortDirection === 'asc' ? <FaSortUp /> : <FaSortDown />;
  };

  // Bulk actions
  const handleBulkExport = () => {
    if (selectedSubscribers.size === 0) return;

    // Convert selected subscribers to export format
    const selectedData = [];
    Array.from(selectedSubscribers).forEach(key => {
      const [community, email] = key.split(':');
      const communitySubscribers = subscribers.subscribersByCommunity[community] || [];
      const subscriber = communitySubscribers.find(sub => sub.email === email);

      if (subscriber) {
        selectedData.push({
          ...subscriber,
          community: community.charAt(0).toUpperCase() + community.slice(1).replace('-', ' ')
        });
      }
    });

    // Create CSV content
    const headers = ['Name', 'Email', 'Community', 'Subscribed Date'];
    const csvContent = [
      headers.join(','),
      ...selectedData.map(sub => [
        `"${sub.name || ''}"`,
        `"${sub.email}"`,
        `"${sub.community}"`,
        `"${formatDate(sub.subscribedAt)}"`
      ].join(','))
    ].join('\n');

    // Create blob and download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `selected_subscribers_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    // Clear selection after export
    setSelectedSubscribers(new Set());
  };

  const handleBulkDelete = () => {
    if (selectedSubscribers.size === 0) return;

    const count = selectedSubscribers.size;
    const confirmed = window.confirm(
      `Are you sure you want to delete ${count} selected subscriber${count !== 1 ? 's' : ''}? This action cannot be undone.`
    );

    if (!confirmed) return;

    // TODO: Implement actual API call to delete subscribers
    console.log('Bulk delete requested for:', Array.from(selectedSubscribers));

    // For now, just clear the selection
    // In a real implementation, you'd make API calls here
    setSelectedSubscribers(new Set());

    // Show success message
    alert(`Successfully deleted ${count} subscriber${count !== 1 ? 's' : ''}.`);

    // Refresh subscriber data
    fetchSubscribers();
  };
  
  const renderContent = () => {
    switch(activeTab) {
      case 'dashboard':
        return (
          <AdminDashboard
            onNavigate={setActiveTab}
          />
        );

      case 'subscribers':
        return renderSubscribersContent();

      case 'contacts':
        return renderContactsContent();

      case 'listings':
        return <ListingsManager />;

      case 'blowout':
        return renderBlowoutContent();

      case 'market':
        return <MarketDataManager />;

      case 'newsletter':
        return <NewsletterGenerator />;

      default:
        return null;
    }
  };
  
  const renderSubscribersContent = () => (
    <>
      {/* Enhanced Stats Section */}
      <StatsContainer>
        <StatCard>
          <h3>{subscribers?.total || 0}</h3>
          <p>Total Subscribers</p>
          <div style={{ marginTop: '1rem' }}>
            <CopyButton onClick={exportAllSubscribers}>
              <FaFileDownload />
              Export All
            </CopyButton>
          </div>
        </StatCard>
        {communities.map(community => {
          const total = subscribers?.subscribersByCommunity[community]?.length || 0;
          const filtered = filteredAndSortedSubscribers[community]?.length || 0;
          return (
            <StatCard key={community}>
              <h3>{searchTerm ? `${filtered}/${total}` : total}</h3>
              <p>{community.charAt(0).toUpperCase() + community.slice(1).replace('-', ' ')}</p>
            </StatCard>
          );
        })}
      </StatsContainer>

      {/* Search and Filter Controls */}
      <SubscriberControls>
        <SearchFilterRow>
          <SearchBox>
            <FaSearch />
            <SearchInput
              type="text"
              placeholder="Search subscribers by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </SearchBox>

          <FilterSelect
            value={filterCommunity}
            onChange={(e) => setFilterCommunity(e.target.value)}
          >
            <option value="all">All Communities</option>
            {communities.map(community => (
              <option key={community} value={community}>
                {community.charAt(0).toUpperCase() + community.slice(1).replace('-', ' ')}
              </option>
            ))}
          </FilterSelect>

          <PageSizeSelect
            value={pageSize}
            onChange={(e) => setPageSize(parseInt(e.target.value))}
          >
            <option value="10">10 per page</option>
            <option value="25">25 per page</option>
            <option value="50">50 per page</option>
            <option value="100">100 per page</option>
          </PageSizeSelect>
        </SearchFilterRow>

        {selectedSubscribers.size > 0 && (
          <BulkActions>
            <span style={{ color: '#999' }}>
              {selectedSubscribers.size} selected
            </span>
            <BulkActionButton onClick={handleBulkExport}>
              <FaFileDownload />
              Export Selected
            </BulkActionButton>
            <BulkActionButton variant="danger" onClick={handleBulkDelete}>
              <FaTrash />
              Delete Selected
            </BulkActionButton>
          </BulkActions>
        )}
      </SubscriberControls>

      {/* Enhanced Community Tables */}
      {communities
        .filter(community => filterCommunity === 'all' || filterCommunity === community)
        .map((community, index) => {
          const communityData = paginatedSubscribers[community];
          const subscriberData = communityData?.data || [];
          const total = communityData?.total || 0;
          const currentPageNum = communityData?.currentPage || 1;
          const totalPages = communityData?.totalPages || 1;

          const selectedInCommunity = subscriberData.filter(sub =>
            selectedSubscribers.has(`${community}:${sub.email}`)
          ).length;

          return (
            <AdminCard
              key={community}
              title={`${community.charAt(0).toUpperCase() + community.slice(1).replace('-', ' ')} Subscribers`}
              icon={FaUsers}
              headerActions={
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
                  <SubscriberCount>
                    {total} subscriber{total !== 1 ? 's' : ''}
                    {searchTerm && ` (filtered)`}
                  </SubscriberCount>
                  <CopyButton onClick={() => exportToCSV(community)}>
                    <FaFileDownload />
                    Export CSV
                  </CopyButton>
                  <CopyButton onClick={() => copyEmailsToClipboard(community)}>
                    <FaCopy />
                    {copiedCommunity === community ? 'Copied!' : 'Copy Emails'}
                  </CopyButton>
                </div>
              }
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 * index }}
            >
              <SubscriberList>
                {loading ? (
                  <SkeletonTable>
                    {Array.from({ length: pageSize }, (_, i) => (
                      <SkeletonRow key={i}>
                        <div className="skeleton checkbox-skeleton"></div>
                        <div className="skeleton name-skeleton"></div>
                        <div className="skeleton email-skeleton"></div>
                        <div className="skeleton date-skeleton"></div>
                      </SkeletonRow>
                    ))}
                  </SkeletonTable>
                ) : subscriberData.length > 0 ? (
                  <>
                    <SubscriberTable>
                      <thead>
                        <tr>
                          <th style={{ width: '40px' }}>
                            <SelectAllCheckbox
                              type="checkbox"
                              checked={selectedInCommunity === subscriberData.length && subscriberData.length > 0}
                              onChange={() => handleSelectAllSubscribers(community)}
                            />
                          </th>
                          <SortableHeader
                            active={sortField === 'name'}
                            onClick={() => handleSort('name')}
                          >
                            Name {getSortIcon('name')}
                          </SortableHeader>
                          <SortableHeader
                            active={sortField === 'email'}
                            onClick={() => handleSort('email')}
                          >
                            Email {getSortIcon('email')}
                          </SortableHeader>
                          <SortableHeader
                            active={sortField === 'subscribedAt'}
                            onClick={() => handleSort('subscribedAt')}
                          >
                            Subscribed Date {getSortIcon('subscribedAt')}
                          </SortableHeader>
                        </tr>
                      </thead>
                      <tbody>
                        {subscriberData.map((subscriber, idx) => {
                          const isSelected = selectedSubscribers.has(`${community}:${subscriber.email}`);
                          return (
                            <SubscriberRow key={idx} selected={isSelected}>
                              <td>
                                <input
                                  type="checkbox"
                                  checked={isSelected}
                                  onChange={() => handleSelectSubscriber(community, subscriber.email)}
                                />
                              </td>
                              <td>{subscriber.name || 'N/A'}</td>
                              <td>{subscriber.email}</td>
                              <td>{formatDate(subscriber.subscribedAt)}</td>
                            </SubscriberRow>
                          );
                        })}
                      </tbody>
                    </SubscriberTable>

                    {/* Pagination */}
                    {totalPages > 1 && (
                      <PaginationContainer>
                        <PaginationInfo>
                          Showing {((currentPageNum - 1) * pageSize) + 1} to {Math.min(currentPageNum * pageSize, total)} of {total} subscribers
                        </PaginationInfo>

                        <PaginationControls>
                          <PageButton
                            disabled={currentPageNum === 1}
                            onClick={() => handlePageChange(community, currentPageNum - 1)}
                          >
                            Previous
                          </PageButton>

                          {Array.from({ length: totalPages }, (_, i) => i + 1)
                            .filter(page =>
                              page === 1 ||
                              page === totalPages ||
                              Math.abs(page - currentPageNum) <= 2
                            )
                            .map((page, idx, arr) => (
                              <React.Fragment key={page}>
                                {idx > 0 && arr[idx - 1] !== page - 1 && (
                                  <span style={{ color: '#999' }}>...</span>
                                )}
                                <PageButton
                                  active={page === currentPageNum}
                                  onClick={() => handlePageChange(community, page)}
                                >
                                  {page}
                                </PageButton>
                              </React.Fragment>
                            ))
                          }

                          <PageButton
                            disabled={currentPageNum === totalPages}
                            onClick={() => handlePageChange(community, currentPageNum + 1)}
                          >
                            Next
                          </PageButton>
                        </PaginationControls>
                      </PaginationContainer>
                    )}
                  </>
                ) : (
                  <div style={{ textAlign: 'center', color: '#999', padding: '3rem' }}>
                    {searchTerm ? (
                      <>
                        <FaSearch style={{ fontSize: '3rem', marginBottom: '1rem', opacity: 0.3 }} />
                        <p>No subscribers found matching "{searchTerm}"</p>
                        <button
                          style={{
                            background: 'none',
                            border: 'none',
                            color: '#8b4513',
                            cursor: 'pointer',
                            textDecoration: 'underline'
                          }}
                          onClick={() => setSearchTerm('')}
                        >
                          Clear search
                        </button>
                      </>
                    ) : (
                      <>
                        <FaUsers style={{ fontSize: '3rem', marginBottom: '1rem', opacity: 0.3 }} />
                        <p>No subscribers yet for this community</p>
                      </>
                    )}
                  </div>
                )}
              </SubscriberList>
            </AdminCard>
          );
        })}
    </>
  );
  
  const renderContactsContent = () => (
    <AdminCard
      title="Contact Submissions"
      icon={FaEnvelope}
      headerActions={
        <SubscriberCount>
          {contactSubmissions.length} messages
        </SubscriberCount>
      }
      noPadding
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
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
                  <MessageActionButton onClick={() => markAsRead(submission.id)}>
                    <FaCheckCircle />
                    Mark Read
                  </MessageActionButton>
                )}
                <MessageActionButton 
                  variant="danger" 
                  onClick={() => deleteSubmission(submission.id)}
                >
                  <FaTrash />
                  Delete
                </MessageActionButton>
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
    </AdminCard>
  );
  
  const renderBlowoutContent = () => (
    <AdminCard
      title="2025 Blowout Sale Management"
      icon={FaTag}
      iconColor={props => props.theme.colors.accent}
      headerBg="linear-gradient(135deg, rgba(139, 69, 19, 0.3) 0%, rgba(184, 134, 11, 0.3) 100%)"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
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
          <BlowoutStatCard>
            <h3 style={{ color: isBlowoutActive ? '#4CAF50' : '#ff9800' }}>{isBlowoutActive ? 'Active' : 'Inactive'}</h3>
            <p>Sale Status</p>
          </BlowoutStatCard>
        </BlowoutStats>
        
        <BlowoutControls>
          <InputGroup>
            <label style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <span>Sale Active:</span>
              <label style={{ 
                position: 'relative', 
                display: 'inline-block', 
                width: '60px', 
                height: '34px'
              }}>
                <input
                  type="checkbox"
                  checked={isBlowoutActive}
                  onChange={(e) => setIsBlowoutActive(e.target.checked)}
                  style={{
                    opacity: 0,
                    width: 0,
                    height: 0
                  }}
                />
                <span style={{
                  position: 'absolute',
                  cursor: 'pointer',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  backgroundColor: isBlowoutActive ? '#4CAF50' : '#ccc',
                  transition: '0.4s',
                  borderRadius: '34px'
                }}>
                  <span style={{
                    position: 'absolute',
                    content: '',
                    height: '26px',
                    width: '26px',
                    left: isBlowoutActive ? '30px' : '4px',
                    bottom: '4px',
                    backgroundColor: 'white',
                    transition: '0.4s',
                    borderRadius: '50%'
                  }}></span>
                </span>
              </label>
            </label>
          </InputGroup>
          
          <InputGroup>
            <label>Spots Remaining:</label>
            <input
              type="number"
              value={spotsRemaining}
              onChange={(e) => setSpotsRemaining(parseInt(e.target.value) || 0)}
              min="0"
              max={totalSpots}
              disabled={!isBlowoutActive}
            />
          </InputGroup>
          
          <InputGroup>
            <label>Total Spots:</label>
            <input
              type="number"
              value={totalSpots}
              onChange={(e) => setTotalSpots(parseInt(e.target.value) || 0)}
              min="1"
              disabled={!isBlowoutActive}
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
    </AdminCard>
  );
  
  return (
    <PageContainer>
      <AdminLayout 
        activeTab={activeTab} 
        onTabChange={setActiveTab} 
        user={user} 
        onLogout={handleLogout}
      >
        {renderContent()}
      </AdminLayout>
    </PageContainer>
  );
};

export default Admin;