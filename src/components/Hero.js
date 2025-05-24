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
  z-index: 2;
  text-align: center;
  max-width: 900px;
  padding: 0 2rem;
`;

const HeroLogo = styled(motion.div)`
  margin-bottom: 3rem;
  
  img {
    height: 100px;
    margin-bottom: 1rem;
  }
`;

const HeroTitle = styled(motion.h1)`
  font-family: ${props => props.theme.fonts.heading};
  font-size: 4.5rem;
  font-weight: 700;
  color: #fff;
  margin-bottom: 1.5rem;
  letter-spacing: 2px;
  text-shadow: 2px 2px 8px rgba(0, 0, 0, 0.7);
  
  span {
    color: ${props => props.theme.colors.secondary};
  }
  
  @media (max-width: ${props => props.theme.breakpoints.md}) {
    font-size: 3rem;
  }
  
  @media (max-width: ${props => props.theme.breakpoints.sm}) {
    font-size: 2.5rem;
  }
`;

const HeroSubtitle = styled(motion.p)`
  font-size: 1.2rem;
  color: #f5f5f5;
  margin-bottom: 2.5rem;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
  font-weight: 300;
  letter-spacing: 0.5px;
  line-height: 1.8;
  text-shadow: 1px 1px 4px rgba(0, 0, 0, 0.8);
  
  @media (max-width: ${props => props.theme.breakpoints.sm}) {
    font-size: 1rem;
  }
`;





const Hero = () => {
  // Create style objects for the image and overlay
  const imageStyle = {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    filter: 'brightness(0.4) contrast(1.2)',
    zIndex: 1,
  };

  // Overlay style
  const overlayStyle = {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    background: 'linear-gradient(to bottom, rgba(0, 0, 0, 0.6) 0%, rgba(0, 0, 0, 0.7) 100%)',
    zIndex: 2
  };

  return (
    <HeroContainer id="home">
      {/* Use an actual img element with the imported image */}
      <img src={cowHeroImage} alt="Country landscape" style={imageStyle} />
      <div style={overlayStyle}></div>
      <HeroContent>
        <HeroLogo
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <h2 style={{ 
            fontFamily: "'Bodoni Moda', serif", 
            fontSize: '2rem', 
            color: '#d2b48c',
            letterSpacing: '3px'
          }}>
            OUTRIDER
          </h2>
        </HeroLogo>
        
        <HeroTitle
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
        >
          Real Estate Done <span>Right</span>
        </HeroTitle>
        
        <HeroSubtitle
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
        >
          Professional real estate services with a country touch, serving Anza, Aguanga, Idyllwild, and Mountain Center.
        </HeroSubtitle>
      </HeroContent>
    </HeroContainer>
  );
};

export default Hero;