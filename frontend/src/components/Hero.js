import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import cowHeroImage from '../cow-hero.jpeg';

const HeroContainer = styled.section`
  height: 100vh;
  width: 100%;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #000;
  overflow: hidden;
`;

// Removed unused HeroBackground component

const HeroContent = styled.div`
  position: relative;
  z-index: 3;
  text-align: center;
  max-width: 1000px;
  padding: 0 2rem;
  display: flex;
  flex-direction: column;
  height: 85%;
  justify-content: space-between;
  align-items: center;
`;

const HeroTop = styled.div`
  flex: 1;
  display: flex;
  align-items: flex-end;
  width: 100%;
  padding-bottom: 1rem;
`;

const HeroLogo = styled(motion.div)`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  
  img {
    max-width: 350px;
    width: 100%;
    height: auto;
    margin: 0 auto;
    display: block;
  }
  
  @media (max-width: ${props => props.theme.breakpoints.md}) {
    img {
      max-width: 280px;
    }
  }
  
  @media (max-width: ${props => props.theme.breakpoints.sm}) {
    img {
      max-width: 240px;
    }
  }
`;

const HeroMiddle = styled.div`
  flex: 2;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  gap: 1.5rem;
`;

const HeroBottom = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  width: 100%;
  padding-top: 1rem;
`;



const HeroSubtitle = styled(motion.p)`
  font-size: 1.3rem;
  color: #f5f5f5;
  margin: 0;
  max-width: 800px;
  font-weight: 300;
  letter-spacing: 0.5px;
  line-height: 1.8;
  text-shadow: 1px 1px 4px rgba(0, 0, 0, 0.6);
  padding: 0 1rem;
  
  @media (max-width: ${props => props.theme.breakpoints.md}) {
    font-size: 1.2rem;
    max-width: 700px;
    line-height: 1.7;
  }
  
  @media (max-width: ${props => props.theme.breakpoints.sm}) {
    font-size: 1.1rem;
    line-height: 1.6;
    padding: 0;
  }
`;
const ServiceFeatures = styled(motion.div)`
  text-align: center;
  margin: 0;
  font-size: 1.2rem;
  color: #d2b48c;
  letter-spacing: 0.8px;
  font-weight: 500;
  text-shadow: 1px 1px 3px rgba(0, 0, 0, 0.5);
  
  @media (max-width: ${props => props.theme.breakpoints.sm}) {
    font-size: 1rem;
  }
`;

const TagLine = styled(motion.div)`
  text-align: center;
  margin: 0;
  font-family: ${props => props.theme.fonts.heading};
  font-size: 2.2rem;
  color: ${props => props.theme.colors.text.secondary};
  font-style: italic;
  letter-spacing: 2px;
  text-shadow: 2px 2px 5px rgba(0, 0, 0, 0.6);
  
  @media (max-width: ${props => props.theme.breakpoints.md}) {
    font-size: 1.8rem;
    letter-spacing: 1px;
  }
  
  @media (max-width: ${props => props.theme.breakpoints.sm}) {
    font-size: 1.6rem;
  }
`;

const LogoText = styled(motion.div)`
  font-family: ${props => props.theme.fonts.heading};
  font-size: 5rem;
  font-weight: 600;
  letter-spacing: 3px;
  color: ${props => props.theme.colors.secondary};
  margin-top: 1.5rem;
  text-shadow: 3px 3px 6px rgba(0, 0, 0, 0.7);
  
  @media (max-width: ${props => props.theme.breakpoints.md}) {
    font-size: 4rem;
    letter-spacing: 2px;
  }
  
  @media (max-width: ${props => props.theme.breakpoints.sm}) {
    font-size: 3.2rem;
    letter-spacing: 1px;
  }
`;




const Hero = () => {
  
  // Create style objects for the image and overlay (added a very light overlay)
  const imageStyle = {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    filter: 'brightness(0.8) contrast(1.1)',
    zIndex: 1,
  };
  
  // Light overlay style
  const overlayStyle = {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    background: 'linear-gradient(to bottom, rgba(0, 0, 0, 0.5) 0%, rgba(0, 0, 0, 0.05) 100%)',
    zIndex: 2
  };

  return (
    <HeroContainer id="home">
      <img src={cowHeroImage} alt="Country landscape" style={imageStyle} />
      <div style={overlayStyle}></div>
      <HeroContent>
        <HeroTop>
          <HeroLogo
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
          >
            <img 
              src="/logo/hero.svg" 
              alt="Kevin Landen Real Estate" 
              style={{
                height: 'auto',
                filter: 'drop-shadow(3px 3px 6px rgba(0, 0, 0, 0.4))',
              }}
            />
          </HeroLogo>
        </HeroTop>

        <HeroMiddle>
          <HeroSubtitle
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.9 }}
          >
            Professional real estate services, serving the mountain communities of Anza, Aguanga, Idyllwild, and Mountain Center.
          </HeroSubtitle>
          
          <ServiceFeatures
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 1.1 }}
          >
            No binding contracts • 2% to list or buy <span style={{fontSize: '0.9rem', opacity: 0.8}}>(8k minimum)</span>
          </ServiceFeatures>
        </HeroMiddle>

        <HeroBottom>
          <TagLine
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 1.3 }}
          >
            Let's ride...
          </TagLine>
        </HeroBottom>
      </HeroContent>
    </HeroContainer>
  );
};

export default Hero;