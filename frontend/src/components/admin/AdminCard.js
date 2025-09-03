import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';

const Card = styled(motion.div)`
  background-color: rgba(20, 20, 20, 0.85);
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius.default};
  overflow: hidden;
  margin-bottom: ${props => props.marginBottom || '2rem'};
`;

const CardHeader = styled.div`
  background-color: ${props => props.headerBg || 'rgba(139, 69, 19, 0.2)'};
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
    display: flex;
    align-items: center;
    gap: 1rem;
    
    svg {
      color: ${props => props.iconColor || props.theme.colors.primary};
    }
  }
`;

const CardContent = styled.div`
  padding: ${props => props.noPadding ? '0' : '2rem'};
`;

const AdminCard = ({ 
  title, 
  icon: Icon, 
  iconColor,
  headerBg,
  headerActions, 
  children, 
  noPadding,
  marginBottom,
  ...animationProps 
}) => {
  return (
    <Card marginBottom={marginBottom} {...animationProps}>
      <CardHeader headerBg={headerBg}>
        <h2>
          {Icon && <Icon />}
          {title}
        </h2>
        {headerActions}
      </CardHeader>
      <CardContent noPadding={noPadding}>
        {children}
      </CardContent>
    </Card>
  );
};

export default AdminCard;