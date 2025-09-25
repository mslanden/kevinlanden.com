import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import {
  FaUsers,
  FaEnvelope,
  FaTag,
  FaChartLine,
  FaEnvelopeOpen,
  FaExclamationCircle,
  FaCheckCircle,
  FaClock,
  FaHome,
  FaDollarSign,
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaUserCheck,
  FaExclamationTriangle
} from 'react-icons/fa';
import { LineChart, BarChart, DoughnutChart, MetricCard } from './ChartComponents';
import api from '../../utils/api';

const DashboardContainer = styled.div`
  display: grid;
  gap: 2rem;
`;

const MetricsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
`;

const ChartsSection = styled.div`
  display: grid;
  gap: 2rem;
  margin-bottom: 2rem;
`;

const ChartsRow = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 2rem;

  @media (max-width: ${props => props.theme.breakpoints.lg}) {
    grid-template-columns: 1fr;
  }
`;

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 200px;
  color: ${props => props.theme.colors.text.muted};
  font-size: 1.1rem;
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.5rem;
`;

const StatCard = styled(motion.div)`
  background-color: rgba(20, 20, 20, 0.85);
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius.default};
  padding: 1.5rem;
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 4px;
    height: 100%;
    background-color: ${props => props.color || props.theme.colors.primary};
  }
`;

const StatHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1rem;
`;

const StatIcon = styled.div`
  width: 50px;
  height: 50px;
  background-color: ${props => props.color ? `${props.color}20` : 'rgba(139, 69, 19, 0.2)'};
  border-radius: ${props => props.theme.borderRadius.default};
  display: flex;
  align-items: center;
  justify-content: center;
  
  svg {
    font-size: 1.5rem;
    color: ${props => props.color || props.theme.colors.primary};
  }
`;

const StatContent = styled.div`
  h3 {
    font-size: 2rem;
    color: ${props => props.theme.colors.text.secondary};
    margin-bottom: 0.25rem;
    font-weight: 700;
  }
  
  p {
    color: ${props => props.theme.colors.text.muted};
    font-size: 0.95rem;
  }
`;

const QuickActions = styled.div`
  background-color: rgba(20, 20, 20, 0.85);
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius.default};
  padding: 2rem;
  
  h2 {
    font-family: ${props => props.theme.fonts.heading};
    font-size: 1.5rem;
    color: ${props => props.theme.colors.text.secondary};
    margin-bottom: 1.5rem;
  }
`;

const ActionGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 1rem;
`;

const ActionButton = styled.button`
  background-color: rgba(139, 69, 19, 0.1);
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius.small};
  padding: 1rem;
  color: ${props => props.theme.colors.text.primary};
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  text-align: center;
  
  &:hover {
    background-color: rgba(139, 69, 19, 0.2);
    border-color: ${props => props.theme.colors.primary};
    transform: translateY(-2px);
  }
  
  svg {
    font-size: 1.5rem;
    color: ${props => props.theme.colors.primary};
  }
  
  span {
    font-size: 0.9rem;
    font-weight: 500;
  }
`;

const RecentActivity = styled.div`
  background-color: rgba(20, 20, 20, 0.85);
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius.default};
  padding: 2rem;
  
  h2 {
    font-family: ${props => props.theme.fonts.heading};
    font-size: 1.5rem;
    color: ${props => props.theme.colors.text.secondary};
    margin-bottom: 1.5rem;
  }
`;

const ActivityList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const ActivityItem = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background-color: rgba(255, 255, 255, 0.03);
  border-radius: ${props => props.theme.borderRadius.small};
  
  svg {
    font-size: 1.2rem;
    color: ${props => props.color || props.theme.colors.text.muted};
  }
`;

const ActivityContent = styled.div`
  flex: 1;

  p {
    color: ${props => props.theme.colors.text.primary};
    font-size: 0.95rem;
    margin-bottom: 0.25rem;
  }

  span {
    color: ${props => props.theme.colors.text.muted};
    font-size: 0.85rem;
  }
`;

const ActivityIcon = styled.div`
  display: flex;
  align-items: center;

  svg {
    font-size: 1.2rem;
  }
`;

// System Health Monitoring Styled Components
const SystemHealthSection = styled.section`
  background-color: rgba(20, 20, 20, 0.85);
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius.default};
  padding: 2rem;
  margin-bottom: 2rem;
  backdrop-filter: blur(10px);

  h2 {
    font-family: ${props => props.theme.fonts.heading};
    color: ${props => props.theme.colors.text.secondary};
    font-size: 1.8rem;
    margin-bottom: 1.5rem;
    display: flex;
    align-items: center;

    svg {
      color: ${props => props.theme.colors.primary};
    }
  }
`;

const HealthGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
`;

const HealthCard = styled.div`
  background-color: rgba(40, 40, 40, 0.8);
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius.small};
  padding: 1rem;
  position: relative;

  .status-indicator {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background-color: ${props => {
      switch (props.status) {
        case 'healthy': return '#4CAF50';
        case 'warning': return '#FF9800';
        case 'degraded':
        case 'unhealthy': return '#f44336';
        default: return '#757575';
      }
    }};
    animation: ${props => props.status === 'healthy' ? 'none' : 'pulse 2s infinite'};
  }

  @keyframes pulse {
    0% { opacity: 1; }
    50% { opacity: 0.5; }
    100% { opacity: 1; }
  }
`;

const HealthHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.5rem;

  span {
    color: ${props => props.theme.colors.text.muted};
    font-size: 0.9rem;
    font-weight: 500;
  }
`;

const HealthValue = styled.div`
  color: ${props => props.theme.colors.text.secondary};
  font-size: 1.1rem;
  font-weight: 600;
  margin-bottom: 0.25rem;
`;

const HealthDetail = styled.div`
  color: ${props => props.theme.colors.text.muted};
  font-size: 0.8rem;
`;

const AdminDashboard = ({ onNavigate }) => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedTimeframe, setSelectedTimeframe] = useState('6months');
  const [trendsData, setTrendsData] = useState({});
  const [systemHealth, setSystemHealth] = useState(null);

  useEffect(() => {
    fetchDashboardData();
    fetchTrendsData('subscribers');
    fetchTrendsData('contacts');
    fetchTrendsData('market');
    fetchSystemHealth();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedTimeframe]);

  // Fetch system health periodically
  useEffect(() => {
    const healthInterval = setInterval(fetchSystemHealth, 30000); // Every 30 seconds
    return () => clearInterval(healthInterval);
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const response = await api.get('/analytics/dashboard', {
        withCredentials: true
      });
      setDashboardData(response.data.data);
      setError('');
    } catch (err) {
      console.error('Dashboard data fetch error:', err);
      setError('Failed to load dashboard analytics');
    } finally {
      setLoading(false);
    }
  };

  const fetchTrendsData = async (type) => {
    try {
      const response = await api.get(`/analytics/trends/${type}`, {
        params: { timeframe: selectedTimeframe },
        withCredentials: true
      });
      setTrendsData(prev => ({
        ...prev,
        [type]: response.data.data.chartData
      }));
    } catch (err) {
      console.error(`Trends data fetch error for ${type}:`, err);
    }
  };

  const fetchSystemHealth = async () => {
    try {
      const response = await api.get('/analytics/health', {
        withCredentials: true
      });
      setSystemHealth(response.data.data);
    } catch (err) {
      console.error('System health fetch error:', err);
      setSystemHealth(null);
    }
  };

  const handleTimeframeChange = (timeframe) => {
    setSelectedTimeframe(timeframe);
  };

  if (loading) {
    return (
      <DashboardContainer>
        <LoadingContainer>
          <FaClock style={{ marginRight: '1rem' }} />
          Loading dashboard analytics...
        </LoadingContainer>
      </DashboardContainer>
    );
  }

  if (error) {
    return (
      <DashboardContainer>
        <LoadingContainer style={{ color: '#f44336' }}>
          <FaExclamationCircle style={{ marginRight: '1rem' }} />
          {error}
        </LoadingContainer>
      </DashboardContainer>
    );
  }

  if (!dashboardData) {
    return null;
  }

  const { overview, segmentation, recentActivity } = dashboardData;
  // Format chart data for subscribers by community
  const subscriberChartData = {
    labels: Object.keys(segmentation.subscribersByCommunity || {}),
    values: Object.values(segmentation.subscribersByCommunity || {})
  };

  // Format chart data for contacts by type
  const contactChartData = {
    labels: Object.keys(segmentation.contactsByType || {}),
    values: Object.values(segmentation.contactsByType || {})
  };

  // Format trend data for line charts
  const formatTrendData = (data) => {
    if (!data || !Array.isArray(data)) return { labels: [], values: [] };
    return {
      labels: data.map(item => item.date),
      values: data.map(item => item.count)
    };
  };

  const quickActions = [
    { icon: FaUsers, label: 'View Subscribers', action: () => onNavigate('subscribers') },
    { icon: FaEnvelopeOpen, label: 'Check Messages', action: () => onNavigate('contacts') },
    { icon: FaTag, label: 'Update Sale', action: () => onNavigate('blowout') },
    { icon: FaChartLine, label: 'Market Data', action: () => onNavigate('market') },
    { icon: FaCalendarAlt, label: 'Generate Newsletter', action: () => onNavigate('newsletter') },
  ];

  return (
    <DashboardContainer>
      {/* Key Metrics */}
      <MetricsGrid>
        <MetricCard
          title="Total Subscribers"
          value={overview.totalSubscribers}
          icon={FaUsers}
          color="#4CAF50"
        />
        <MetricCard
          title="Unread Messages"
          value={overview.unreadContacts}
          icon={FaEnvelope}
          color="#ff9800"
        />
        <MetricCard
          title="Recent Contacts"
          value={overview.recentContacts}
          icon={FaUserCheck}
          color="#2196F3"
        />
        <MetricCard
          title="Available Properties"
          value={overview.availableProperties}
          icon={FaHome}
          color="#9C27B0"
        />
        <MetricCard
          title="Average Price"
          value={`$${overview.averagePrice?.toLocaleString() || 0}`}
          icon={FaDollarSign}
          color="#FF5722"
        />
        {overview.blowoutSaleProgress && (
          <MetricCard
            title="Sale Progress"
            value={`${overview.blowoutSaleProgress.progressPercentage}%`}
            icon={FaTag}
            color="#607D8B"
          />
        )}
      </MetricsGrid>

      {/* System Health Monitoring */}
      {systemHealth && (
        <SystemHealthSection>
          <h2>
            <FaExclamationTriangle style={{ marginRight: '0.5rem' }} />
            System Health
          </h2>
          <HealthGrid>
            <HealthCard status={systemHealth.status}>
              <HealthHeader>
                <div className="status-indicator" />
                <span>Overall Status</span>
              </HealthHeader>
              <HealthValue>
                {systemHealth.status.charAt(0).toUpperCase() + systemHealth.status.slice(1)}
              </HealthValue>
              <HealthDetail>
                Uptime: {Math.floor(systemHealth.uptime / 3600)}h {Math.floor((systemHealth.uptime % 3600) / 60)}m
              </HealthDetail>
            </HealthCard>

            <HealthCard status={systemHealth.database.connected ? 'healthy' : 'unhealthy'}>
              <HealthHeader>
                <div className="status-indicator" />
                <span>Database</span>
              </HealthHeader>
              <HealthValue>
                {systemHealth.database.connected ? 'Connected' : 'Disconnected'}
              </HealthValue>
              <HealthDetail>
                Latency: {systemHealth.database.latency}
              </HealthDetail>
            </HealthCard>

            <HealthCard status="healthy">
              <HealthHeader>
                <div className="status-indicator" />
                <span>Memory Usage</span>
              </HealthHeader>
              <HealthValue>
                {systemHealth.memory.heapUsed}
              </HealthValue>
              <HealthDetail>
                Total: {systemHealth.memory.heapTotal}
              </HealthDetail>
            </HealthCard>

            <HealthCard status="healthy">
              <HealthHeader>
                <div className="status-indicator" />
                <span>Environment</span>
              </HealthHeader>
              <HealthValue>
                {systemHealth.environment}
              </HealthValue>
              <HealthDetail>
                Node: {systemHealth.load.nodeVersion}
              </HealthDetail>
            </HealthCard>
          </HealthGrid>
        </SystemHealthSection>
      )}

      {/* Charts Section */}
      <ChartsSection>
        <ChartsRow>
          <LineChart
            title="Subscriber Growth"
            data={formatTrendData(trendsData.subscribers)}
            timeframe={selectedTimeframe}
            onTimeframeChange={handleTimeframeChange}
            icon={FaChartLine}
          />
          <DoughnutChart
            title="Subscribers by Community"
            data={subscriberChartData}
            icon={FaMapMarkerAlt}
          />
        </ChartsRow>

        <ChartsRow>
          <LineChart
            title="Contact Inquiries"
            data={formatTrendData(trendsData.contacts)}
            timeframe={selectedTimeframe}
            onTimeframeChange={handleTimeframeChange}
            icon={FaEnvelopeOpen}
          />
          <BarChart
            title="Contacts by Type"
            data={contactChartData}
            icon={FaUsers}
            horizontal
          />
        </ChartsRow>
      </ChartsSection>

      <QuickActions>
        <h2>Quick Actions</h2>
        <ActionGrid>
          {quickActions.map((action, index) => (
            <ActionButton key={index} onClick={action.action}>
              <action.icon />
              <span>{action.label}</span>
            </ActionButton>
          ))}
        </ActionGrid>
      </QuickActions>

      <RecentActivity>
        <h2>Recent Activity</h2>
        <ActivityList>
          {recentActivity && recentActivity.length > 0 ? (
            recentActivity.map((activity, index) => (
              <ActivityItem key={activity.id || index}>
                <ActivityIcon action={activity.action}>
                  {activity.action === 'INSERT' && <FaCheckCircle color="#4CAF50" />}
                  {activity.action === 'UPDATE' && <FaEnvelope color="#ff9800" />}
                  {activity.action === 'DELETE' && <FaExclamationCircle color="#f44336" />}
                </ActivityIcon>
                <ActivityContent>
                  <p>
                    {activity.action} on {activity.table.replace('_', ' ')}
                    {activity.userEmail && ` by ${activity.userEmail}`}
                  </p>
                  <span>{new Date(activity.timestamp).toLocaleString()}</span>
                </ActivityContent>
              </ActivityItem>
            ))
          ) : (
            <ActivityItem>
              <FaClock />
              <ActivityContent>
                <p>No recent activity</p>
                <span>Activity will appear here as it happens</span>
              </ActivityContent>
            </ActivityItem>
          )}
        </ActivityList>
      </RecentActivity>
    </DashboardContainer>
  );
};

export default AdminDashboard;