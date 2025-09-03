import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { FaCamera, FaGlobe, FaMailBulk, FaPencilRuler } from 'react-icons/fa';

const MarketingSection = styled.section`
  padding: 8rem 0;
  background-color: #191919;
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-image: url('/images/barn-wood-texture.jpg');
    background-size: cover;
    opacity: 0.05;
    z-index: 1;
  }
`;

const MarketingContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1.5rem;
  position: relative;
  z-index: 2;
`;

const SectionHeader = styled.div`
  text-align: center;
  margin-bottom: 5rem;
  position: relative;
  
  &::after {
    content: '';
    position: absolute;
    bottom: -20px;
    left: 50%;
    transform: translateX(-50%);
    width: 100px;
    height: 2px;
    background: linear-gradient(to right, transparent, ${props => props.theme.colors.primary}, transparent);
  }
`;

const SectionTitle = styled(motion.h2)`
  font-family: ${props => props.theme.fonts.heading};
  font-size: 3rem;
  color: ${props => props.theme.colors.text.secondary};
  margin-bottom: 1.5rem;
  letter-spacing: 2px;
  
  @media (max-width: ${props => props.theme.breakpoints.md}) {
    font-size: 2.5rem;
  }
`;

const SectionSubtitle = styled(motion.p)`
  font-size: 1.1rem;
  color: ${props => props.theme.colors.text.muted};
  max-width: 700px;
  margin: 0 auto;
`;

const ContentContainer = styled.div`
  max-width: 800px;
  margin: 0 auto;
`;

const MarketingStrategyList = styled(motion.div)`
  display: flex;
  flex-direction: column;
  gap: 2rem;
`;

const MarketingStrategyItem = styled(motion.div)`
  display: flex;
  gap: 1.5rem;
  background-color: rgba(30, 30, 30, 0.6);
  padding: 2rem;
  border-radius: ${props => props.theme.borderRadius.default};
  border: 1px solid ${props => props.theme.colors.border};
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateX(10px);
    background-color: rgba(50, 50, 50, 0.6);
    box-shadow: ${props => props.theme.shadows.medium};
  }
`;

const IconContainer = styled.div`
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background-color: rgba(139, 69, 19, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid ${props => props.theme.colors.border};
  flex-shrink: 0;
  
  svg {
    color: ${props => props.theme.colors.text.secondary};
    font-size: 1.5rem;
  }
`;

const StrategyContent = styled.div`
  flex: 1;
`;

const StrategyTitle = styled.h3`
  font-family: ${props => props.theme.fonts.heading};
  font-size: 1.3rem;
  color: ${props => props.theme.colors.text.secondary};
  margin-bottom: 0.7rem;
`;

const StrategyDescription = styled.p`
  color: ${props => props.theme.colors.text.primary};
  line-height: 1.7;
`;



const MarketingPlan = () => {
  const [titleRef, titleInView] = useInView({
    triggerOnce: true,
    threshold: 0.2,
  });
  
  const [strategyRef, strategyInView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });
  
  const strategyVariants = {
    hidden: { opacity: 0, x: -50 },
    visible: (i) => ({
      opacity: 1,
      x: 0,
      transition: {
        delay: 0.1 * i,
        duration: 0.6,
      },
    }),
  };
  
  const strategies = [
    {
      icon: <FaCamera />,
      title: 'Professional Photography',
      description: 'Every property receives professional photography to showcase your home in the best possible light.'
    },
    {
      icon: <FaGlobe />,
      title: 'Internet Marketing',
      description: 'Comprehensive online marketing strategy including social media, real estate platforms, and targeted advertising.'
    },
    {
      icon: <FaMailBulk />,
      title: 'Email Campaigns',
      description: 'Targeted email marketing to our database of potential buyers and industry partners.'
    },
    {
      icon: <FaPencilRuler />,
      title: 'Staging Consultation',
      description: 'Expert advice on how to present your home for maximum appeal to potential buyers.'
    }
  ];
  
  return (
    <MarketingSection id="marketing">
      <MarketingContainer>
        <SectionHeader>
          <SectionTitle
            ref={titleRef}
            initial={{ opacity: 0, y: 30 }}
            animate={titleInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.8 }}
          >
            Marketing Plan
          </SectionTitle>
          <SectionSubtitle
            initial={{ opacity: 0, y: 30 }}
            animate={titleInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            How we showcase your property to achieve the best possible outcome
          </SectionSubtitle>
        </SectionHeader>
        
        <ContentContainer>
          <MarketingStrategyList
            ref={strategyRef}
            initial="hidden"
            animate={strategyInView ? "visible" : "hidden"}
            variants={{
              visible: {
                transition: {
                  staggerChildren: 0.2
                }
              }
            }}
          >
            {strategies.map((strategy, index) => (
              <MarketingStrategyItem
                key={strategy.title}
                custom={index}
                variants={strategyVariants}
              >
                <IconContainer>{strategy.icon}</IconContainer>
                <StrategyContent>
                  <StrategyTitle>{strategy.title}</StrategyTitle>
                  <StrategyDescription>{strategy.description}</StrategyDescription>
                </StrategyContent>
              </MarketingStrategyItem>
            ))}
          </MarketingStrategyList>
        </ContentContainer>
      </MarketingContainer>
    </MarketingSection>
  );
};

export default MarketingPlan;