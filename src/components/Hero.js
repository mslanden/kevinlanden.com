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
  max-width: 900px;
  padding: 0 2rem;
  display: flex;
  flex-direction: column;
  height: 80%;
  justify-content: center;
`;

const HeroLogo = styled(motion.div)`
  margin-bottom: 2rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  
  img {
    max-width: 340px;
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
      max-width: 220px;
    }
  }
`;



const HeroSubtitle = styled(motion.p)`
  font-size: 1.2rem;
  color: #f5f5f5;
  margin-bottom: 2.5rem;
  max-width: 720px;
  margin-left: auto;
  margin-right: auto;
  font-weight: 300;
  letter-spacing: 0.5px;
  line-height: 1.8;
  text-shadow: 1px 1px 4px rgba(0, 0, 0, 0.6);
  padding: 0 10px;
  
  @media (max-width: ${props => props.theme.breakpoints.md}) {
    font-size: 1.1rem;
    max-width: 650px;
    line-height: 1.7;
  }
  
  @media (max-width: ${props => props.theme.breakpoints.sm}) {
    font-size: 1rem;
    line-height: 1.6;
  }
`;
const ServiceFeatures = styled(motion.div)`
  text-align: center;
  margin-top: 1.5rem;
  margin-bottom: 3rem;
  font-size: 1.1rem;
  color: #d2b48c;
  letter-spacing: 0.5px;
  font-weight: 500;
  
  @media (max-width: ${props => props.theme.breakpoints.sm}) {
    font-size: 0.95rem;
  }
`;

const TagLine = styled(motion.div)`
  text-align: center;
  margin-top: 2rem;
  font-family: ${props => props.theme.fonts.heading};
  font-size: 1.8rem;
  color: ${props => props.theme.colors.text.secondary};
  font-style: italic;
  letter-spacing: 1px;
  
  @media (max-width: ${props => props.theme.breakpoints.md}) {
    font-size: 1.5rem;
    margin-top: 2rem;
  }
  
  @media (max-width: ${props => props.theme.breakpoints.sm}) {
    margin-top: 1.5rem;
  }
`;

const LogoText = styled(motion.div)`
  font-family: ${props => props.theme.fonts.heading};
  font-size: 4rem;
  font-weight: 600;
  letter-spacing: 2px;
  color: ${props => props.theme.colors.secondary};
  margin-top: 1rem;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.6);
  
  @media (max-width: ${props => props.theme.breakpoints.md}) {
    font-size: 3.2rem;
  }
  
  @media (max-width: ${props => props.theme.breakpoints.sm}) {
    font-size: 2.8rem;
  }
`;

const SubLogoText = styled(motion.div)`
  font-family: ${props => props.theme.fonts.body};
  font-size: 1.5rem;
  font-style: italic;
  color: ${props => props.theme.colors.text.secondary};
  letter-spacing: 1px;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.6);
  
  @media (max-width: ${props => props.theme.breakpoints.md}) {
    font-size: 1.8rem;
  }
  
  @media (max-width: ${props => props.theme.breakpoints.sm}) {
    font-size: 1.5rem;
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
        <HeroLogo
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <img 
            src="/logo/logo-theme-color.svg" 
            alt="Outrider Real Estate" 
            style={{
              height: 'auto',
              maxWidth: '240px',
              filter: 'drop-shadow(2px 2px 4px rgba(0, 0, 0, 0.3))',
            }}
          />
          <LogoText
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            OUTRIDER
          </LogoText>
          <SubLogoText
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.5 }}
          >
            - real estate -
          </SubLogoText>
        </HeroLogo>



        <HeroSubtitle
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
        >
          Professional real estate services, serving the mountain communities of Anza, Aguanga, Idyllwild, and Mountain Center.
        </HeroSubtitle>
        
        <ServiceFeatures
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.65 }}
        >
          No binding contracts • Transparent • 1% to list or buy
        </ServiceFeatures>
        <TagLine
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
        >
          Let's ride...
        </TagLine>
      </HeroContent>
    </HeroContainer>
  );
};

export default Hero;