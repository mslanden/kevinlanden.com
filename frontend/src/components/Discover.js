import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { FaCheck } from 'react-icons/fa';

const DiscoverSection = styled.section`
  padding: 8rem 0;
  background-color: ${props => props.theme.colors.background.warmDark};
  position: relative;
  overflow: hidden;
`;

const DiscoverContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1.5rem;
  position: relative;
`;

const SectionTitle = styled(motion.h2)`
  font-family: ${props => props.theme.fonts.heading};
  font-size: 3rem;
  text-align: center;
  margin-bottom: 1rem;
  color: ${props => props.theme.colors.text.secondary};
  letter-spacing: 1px;
  
  @media (max-width: ${props => props.theme.breakpoints.md}) {
    font-size: 2.5rem;
  }
`;

const Subtitle = styled(motion.h3)`
  text-align: center;
  width: 100%;
  max-width: 700px;
  margin: 1.5rem auto 4rem;
  color: #d2b48c;
  font-size: 2rem;
  font-family: ${props => props.theme.fonts.heading};
  letter-spacing: 1px;
  position: relative;
  display: block;
  
  &::after {
    content: '';
    position: absolute;
    bottom: -15px;
    left: 50%;
    transform: translateX(-50%);
    width: 80px;
    height: 2px;
    background-color: rgba(139, 69, 19, 0.6);
  }
  
  @media (max-width: ${props => props.theme.breakpoints.md}) {
    font-size: 1.8rem;
  }
`;

const FeaturesContainer = styled.div`
  display: flex;
  flex-direction: column;
  max-width: 900px;
  margin: 3rem auto 0;
  background-color: rgba(18, 18, 18, 0.85);
  border-radius: ${props => props.theme.borderRadius.large};
  padding: 2.5rem;
  box-shadow: ${props => props.theme.shadows.medium};
  border: 1px solid ${props => props.theme.colors.border};
`;

const FeatureItem = styled(motion.div)`
  display: flex;
  align-items: flex-start;
  margin-bottom: 1.5rem;
  padding-bottom: 1.5rem;
  border-bottom: ${props => props.index === props.total - 1 ? 'none' : `1px solid rgba(139, 69, 19, 0.3)`};
  
  &:last-child {
    margin-bottom: 0;
  }
`;

const FeatureIcon = styled.div`
  min-width: 30px;
  height: 30px;
  border-radius: 50%;
  background-color: rgba(139, 69, 19, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 1rem;
  margin-top: 0.2rem;
  border: 1px solid ${props => props.theme.colors.border};
  
  svg {
    font-size: 0.9rem;
    color: #d2b48c;
  }
`;

const FeatureContent = styled.div`
  flex: 1;
`;

const FeatureTitle = styled.h3`
  font-family: ${props => props.theme.fonts.heading};
  font-size: 1.25rem;
  margin-bottom: 0.5rem;
  color: ${props => props.theme.colors.text.secondary};
`;

const FeatureDescription = styled.p`
  color: ${props => props.theme.colors.text.primary};
  line-height: 1.7;
  font-size: 1rem;
`;

const PricingSection = styled(motion.div)`
  margin-top: 3rem;
  padding-top: 2rem;
  border-top: 1px solid rgba(139, 69, 19, 0.4); /* Slightly more visible border */
  text-align: center;
`;

const PricingTitle = styled.h3`
  font-family: ${props => props.theme.fonts.heading};
  font-size: 1.5rem;
  margin-bottom: 1.5rem;
  color: #d2b48c;
`;

const PricingItems = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  max-width: 600px;
  margin: 0 auto;
  
  p {
    color: ${props => props.theme.colors.text.primary};
    font-size: 1.1rem;
    line-height: 1.5;
  }
  
  strong {
    color: ${props => props.theme.colors.text.secondary};
  }
`;

const Discover = () => {
  const [titleRef, titleInView] = useInView({
    triggerOnce: true,
    threshold: 0.2,
  });
  
  const [subtitleRef, subtitleInView] = useInView({
    triggerOnce: true,
    threshold: 0.2,
  });
  
  const [featuresRef, featuresInView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });
  
  const [pricingRef, pricingInView] = useInView({
    triggerOnce: true,
    threshold: 0.2,
  });
  
  const featureVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: 0.1 * i,
        duration: 0.5,
      },
    }),
  };
  
  const features = [
    {
      title: "No contract commitments",
      description: "We earn your business every day"
    },
    {
      title: "Weekly updates",
      description: "On market status and showing feedback"
    },
    {
      title: "Comprehensive marketing",
      description: "Every home gets professional marketing regardless of price point"
    },
    {
      title: "Professional communication",
      description: "Prompt responses to your questions"
    },
    {
      title: "Local expertise",
      description: "In the unique rural and mountain property markets"
    },
    {
      title: "Transparent process",
      description: "From listing to closing"
    },
  ];
  
  return (
    <DiscoverSection id="discover">
      <DiscoverContainer>
        <SectionTitle
          ref={titleRef}
          initial={{ opacity: 0, y: 30 }}
          animate={titleInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8 }}
        >
          Take No Bull
        </SectionTitle>
        
        <Subtitle
          ref={subtitleRef}
          initial={{ opacity: 0, y: 30 }}
          animate={subtitleInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          The Outrider Difference
        </Subtitle>
        
        <FeaturesContainer ref={featuresRef}>
          {features.map((feature, index) => (
            <FeatureItem
              key={index}
              custom={index}
              index={index}
              total={features.length}
              initial="hidden"
              animate={featuresInView ? "visible" : "hidden"}
              variants={featureVariants}
            >
              <FeatureIcon>
                <FaCheck />
              </FeatureIcon>
              <FeatureContent>
                <FeatureTitle>{feature.title}</FeatureTitle>
                <FeatureDescription>{feature.description}</FeatureDescription>
              </FeatureContent>
            </FeatureItem>
          ))}
        </FeaturesContainer>
        
        <PricingSection
          ref={pricingRef}
          initial={{ opacity: 0, y: 30 }}
          animate={pricingInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          <PricingTitle>Competitive Listing Fee</PricingTitle>
          <PricingItems>
            <p><strong>Just 2% to list your property</strong> ($7k minimum)</p>
            <p>Full-service representation without the premium price</p>
          </PricingItems>
        </PricingSection>
      </DiscoverContainer>
    </DiscoverSection>
  );
};

export default Discover;