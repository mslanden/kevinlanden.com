import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

const DiscoverSection = styled.section`
  padding: 8rem 0;
  background-color: ${props => props.theme.colors.background.dark};
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-image: url('/images/wood-texture.jpg');
    background-size: cover;
    opacity: 0.05;
    z-index: 1;
  }
`;

const DiscoverContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1.5rem;
  position: relative;
  z-index: 2;
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

const Subtitle = styled(motion.p)`
  text-align: center;
  max-width: 700px;
  margin: 0 auto 4rem;
  color: ${props => props.theme.colors.text.muted};
  font-size: 1.1rem;
  line-height: 1.7;
`;

const FeaturesContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 3rem;
  margin-top: 4rem;
  
  @media (max-width: ${props => props.theme.breakpoints.md}) {
    grid-template-columns: 1fr;
    gap: 2rem;
  }
`;

const FeatureCard = styled(motion.div)`
  background-color: rgba(30, 30, 30, 0.5);
  border-radius: ${props => props.theme.borderRadius.large};
  padding: 3rem 2rem;
  box-shadow: ${props => props.theme.shadows.medium};
  border: 1px solid ${props => props.theme.colors.border};
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 4px;
    height: 0;
    background-color: ${props => props.theme.colors.primary};
    transition: height 0.5s ease;
  }
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: ${props => props.theme.shadows.large};
    
    &::before {
      height: 100%;
    }
  }
`;

const FeatureIcon = styled.div`
  width: 70px;
  height: 70px;
  border-radius: 50%;
  background-color: rgba(139, 69, 19, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 1.5rem;
  border: 1px solid ${props => props.theme.colors.border};
  
  svg {
    font-size: 1.8rem;
    color: ${props => props.theme.colors.text.secondary};
  }
`;

const FeatureTitle = styled.h3`
  font-family: ${props => props.theme.fonts.heading};
  font-size: 1.5rem;
  margin-bottom: 1rem;
  color: ${props => props.theme.colors.text.secondary};
`;

const FeatureDescription = styled.p`
  color: ${props => props.theme.colors.text.primary};
  line-height: 1.7;
  margin-bottom: 1.5rem;
`;

const TagLine = styled(motion.div)`
  text-align: center;
  margin-top: 5rem;
  font-family: ${props => props.theme.fonts.heading};
  font-size: 1.8rem;
  color: ${props => props.theme.colors.text.secondary};
  font-style: italic;
  letter-spacing: 1px;
  
  @media (max-width: ${props => props.theme.breakpoints.md}) {
    font-size: 1.5rem;
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
  
  const [taglineRef, taglineInView] = useInView({
    triggerOnce: true,
    threshold: 0.5,
  });
  
  const featureVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: 0.1 * i,
        duration: 0.6,
      },
    }),
  };
  
  return (
    <DiscoverSection id="discover">
      <DiscoverContainer>
        <SectionTitle
          ref={titleRef}
          initial={{ opacity: 0, y: 30 }}
          animate={titleInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8 }}
        >
          Discover the Outrider Experience
        </SectionTitle>
        
        <Subtitle
          ref={subtitleRef}
          initial={{ opacity: 0, y: 30 }}
          animate={subtitleInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          No nonsense advisory with professional and timely communication
        </Subtitle>
        
        <FeaturesContainer ref={featuresRef}>
          <FeatureCard
            custom={0}
            initial="hidden"
            animate={featuresInView ? "visible" : "hidden"}
            variants={featureVariants}
          >
            <FeatureIcon>
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor" viewBox="0 0 16 16">
                <path d="M8 16s6-5.686 6-10A6 6 0 0 0 2 6c0 4.314 6 10 6 10zm0-7a3 3 0 1 1 0-6 3 3 0 0 1 0 6z"/>
              </svg>
            </FeatureIcon>
            <FeatureTitle>Local Expertise</FeatureTitle>
            <FeatureDescription>
              With deep roots in Anza, Aguanga, Idyllwild, and Mountain Center, we know every trail, property, and market trend in our service territory.
            </FeatureDescription>
          </FeatureCard>
          
          <FeatureCard
            custom={1}
            initial="hidden"
            animate={featuresInView ? "visible" : "hidden"}
            variants={featureVariants}
          >
            <FeatureIcon>
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor" viewBox="0 0 16 16">
                <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0z"/>
                <path d="M2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2zm12 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1v-1c0-1-1-4-6-4s-6 3-6 4v1a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h12z"/>
              </svg>
            </FeatureIcon>
            <FeatureTitle>Personalized Service</FeatureTitle>
            <FeatureDescription>
              Every client receives our full attention and a customized approach tailored to their unique real estate goals and needs.
            </FeatureDescription>
          </FeatureCard>
          
          <FeatureCard
            custom={2}
            initial="hidden"
            animate={featuresInView ? "visible" : "hidden"}
            variants={featureVariants}
          >
            <FeatureIcon>
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor" viewBox="0 0 16 16">
                <path d="M0 2a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2h-2.5a1 1 0 0 0-.8.4l-1.9 2.533a1 1 0 0 1-1.6 0L5.3 12.4a1 1 0 0 0-.8-.4H2a2 2 0 0 1-2-2V2zm3.5 1a.5.5 0 0 0 0 1h9a.5.5 0 0 0 0-1h-9zm0 2.5a.5.5 0 0 0 0 1h9a.5.5 0 0 0 0-1h-9zm0 2.5a.5.5 0 0 0 0 1h5a.5.5 0 0 0 0-1h-5z"/>
              </svg>
            </FeatureIcon>
            <FeatureTitle>Clear Communication</FeatureTitle>
            <FeatureDescription>
              Expect timely updates, honest advice, and straightforward guidance throughout your entire real estate journey.
            </FeatureDescription>
          </FeatureCard>
        </FeaturesContainer>
        
        <TagLine
          ref={taglineRef}
          initial={{ opacity: 0 }}
          animate={taglineInView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 1, delay: 0.3 }}
        >
          Let's ride...
        </TagLine>
      </DiscoverContainer>
    </DiscoverSection>
  );
};

export default Discover;