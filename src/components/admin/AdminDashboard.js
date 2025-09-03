import React from 'react';
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
  FaClock
} from 'react-icons/fa';

const DashboardContainer = styled.div`
  display: grid;
  gap: 2rem;
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

const AdminDashboard = ({ 
  subscribersCount, 
  unreadMessagesCount, 
  totalMessagesCount,
  blowoutSaleData,
  recentActivity = [],
  onNavigate 
}) => {
  const stats = [
    {
      icon: FaUsers,
      value: subscribersCount || 0,
      label: 'Total Subscribers',
      color: '#4CAF50'
    },
    {
      icon: FaEnvelope,
      value: unreadMessagesCount || 0,
      label: 'Unread Messages',
      color: '#ff9800'
    },
    {
      icon: FaTag,
      value: blowoutSaleData?.spotsRemaining || 0,
      label: 'Blowout Spots Left',
      color: '#2196F3'
    },
    {
      icon: FaChartLine,
      value: `${((blowoutSaleData?.totalSpots - blowoutSaleData?.spotsRemaining) / blowoutSaleData?.totalSpots * 100).toFixed(0)}%`,
      label: 'Sale Progress',
      color: '#9C27B0'
    }
  ];

  const quickActions = [
    { icon: FaUsers, label: 'View Subscribers', action: () => onNavigate('subscribers') },
    { icon: FaEnvelopeOpen, label: 'Check Messages', action: () => onNavigate('contacts') },
    { icon: FaTag, label: 'Update Sale', action: () => onNavigate('blowout') },
    { icon: FaChartLine, label: 'Market Data', action: () => onNavigate('market') },
  ];

  return (
    <DashboardContainer>
      <StatsGrid>
        {stats.map((stat, index) => (
          <StatCard
            key={index}
            color={stat.color}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <StatHeader>
              <StatContent>
                <h3>{stat.value}</h3>
                <p>{stat.label}</p>
              </StatContent>
              <StatIcon color={stat.color}>
                <stat.icon />
              </StatIcon>
            </StatHeader>
          </StatCard>
        ))}
      </StatsGrid>

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
          {recentActivity.length > 0 ? (
            recentActivity.map((activity, index) => (
              <ActivityItem key={index}>
                {activity.type === 'contact' && <FaEnvelope color="#ff9800" />}
                {activity.type === 'subscriber' && <FaUsers color="#4CAF50" />}
                {activity.type === 'sale' && <FaTag color="#2196F3" />}
                <ActivityContent>
                  <p>{activity.message}</p>
                  <span>{activity.time}</span>
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