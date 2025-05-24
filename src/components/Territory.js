import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

const TerritorySection = styled.section`
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
    background-image: url('/images/topographic-map.jpg');
    background-size: cover;
    opacity: 0.1;
    z-index: 1;
  }
`;

const TerritoryContainer = styled.div`
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
  max-width: 600px;
  margin: 0 auto;
`;

const TerritoryGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 3rem;
  
  @media (max-width: ${props => props.theme.breakpoints.md}) {
    grid-template-columns: 1fr 1fr;
    gap: 2rem;
  }
  
  @media (max-width: ${props => props.theme.breakpoints.sm}) {
    grid-template-columns: 1fr;
  }
`;

const TerritoryCard = styled(motion.div)`
  background-color: rgba(30, 30, 30, 0.7);
  border-radius: ${props => props.theme.borderRadius.large};
  overflow: hidden;
  box-shadow: ${props => props.theme.shadows.medium};
  transition: all 0.3s ease;
  border: 1px solid ${props => props.theme.colors.border};
  height: 100%;
  display: flex;
  flex-direction: column;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: ${props => props.theme.shadows.large};
    
    img {
      transform: scale(1.05);
    }
  }
`;

const TerritoryImage = styled.div`
  height: 200px;
  overflow: hidden;
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.5s ease;
  }
`;

const TerritoryContent = styled.div`
  padding: 2rem;
  flex: 1;
  display: flex;
  flex-direction: column;
`;

const TerritoryName = styled.h3`
  font-family: ${props => props.theme.fonts.heading};
  font-size: 1.8rem;
  color: ${props => props.theme.colors.text.secondary};
  margin-bottom: 1rem;
`;

const TerritoryDescription = styled.p`
  color: ${props => props.theme.colors.text.primary};
  line-height: 1.7;
  margin-bottom: 1.5rem;
  flex: 1;
`;

const TerritoryStats = styled.div`
  display: flex;
  justify-content: space-between;
  color: ${props => props.theme.colors.text.muted};
  font-size: 0.9rem;
  margin-top: auto;
  padding-top: 1rem;
  border-top: 1px solid ${props => props.theme.colors.border};
`;

const TerritoryStat = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  
  span:first-child {
    font-weight: bold;
    color: ${props => props.theme.colors.text.secondary};
    margin-bottom: 0.2rem;
  }
`;

const MapContainer = styled(motion.div)`
  margin-top: 5rem;
  border-radius: ${props => props.theme.borderRadius.large};
  overflow: hidden;
  box-shadow: ${props => props.theme.shadows.large};
  border: 1px solid ${props => props.theme.colors.border};
  height: 400px;
  background-color: rgba(30, 30, 30, 0.7);
  position: relative;
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  
  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(45deg, rgba(0,0,0,0.5) 0%, rgba(0,0,0,0.2) 100%);
  }
`;

const MapTitle = styled.div`
  position: absolute;
  top: 20px;
  left: 20px;
  z-index: 10;
  background-color: rgba(30, 30, 30, 0.8);
  padding: 0.7rem 1.5rem;
  border-radius: ${props => props.theme.borderRadius.default};
  border: 1px solid ${props => props.theme.colors.border};
  
  h3 {
    color: ${props => props.theme.colors.text.secondary};
    font-family: ${props => props.theme.fonts.heading};
    font-size: 1.2rem;
    margin: 0;
  }
`;

const Territory = () => {
  const [titleRef, titleInView] = useInView({
    triggerOnce: true,
    threshold: 0.2,
  });
  
  const [cardsRef, cardsInView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });
  
  const [mapRef, mapInView] = useInView({
    triggerOnce: true,
    threshold: 0.2,
  });
  
  const cardVariants = {
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
  
  const territories = [
    {
      name: 'Anza',
      image: '/images/anza.jpeg',
      description: 'Rural community with spacious properties, horse-friendly parcels, and stunning mountain views.',
      elevation: '3,921 ft',
      population: '~3,000',
      avgListing: '$499K'
    },
    {
      name: 'Aguanga',
      image: '/images/aguanga.jpeg',
      description: 'Peaceful countryside with sprawling ranch properties and a tight-knit community atmosphere.',
      elevation: '2,667 ft',
      population: '~1,200',
      avgListing: '$475K'
    },
    {
      name: 'Idyllwild',
      image: '/images/idyllwild.jpeg',
      description: 'Charming mountain town with artistic flair, surrounded by pine forests and granite peaks.',
      elevation: '5,413 ft',
      population: '~3,800',
      avgListing: '$650K'
    },
    {
      name: 'Mountain Center',
      image: '/images/mountain-center.jpeg',
      description: 'Small mountain community offering secluded homes with breathtaking panoramic views.',
      elevation: '4,518 ft',
      population: '~1,000',
      avgListing: '$525K'
    }
  ];
  
  return (
    <TerritorySection id="territory">
      <TerritoryContainer>
        <SectionHeader>
          <SectionTitle
            ref={titleRef}
            initial={{ opacity: 0, y: 30 }}
            animate={titleInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.8 }}
          >
            Service Territory
          </SectionTitle>
          <SectionSubtitle
            initial={{ opacity: 0, y: 30 }}
            animate={titleInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Expertly serving the unique real estate markets of these beautiful communities
          </SectionSubtitle>
        </SectionHeader>
        
        <TerritoryGrid ref={cardsRef}>
          {territories.map((territory, index) => (
            <TerritoryCard
              key={territory.name}
              custom={index}
              initial="hidden"
              animate={cardsInView ? "visible" : "hidden"}
              variants={cardVariants}
            >
              <TerritoryImage>
                <img src={territory.image} alt={territory.name} />
              </TerritoryImage>
              <TerritoryContent>
                <TerritoryName>{territory.name}</TerritoryName>
                <TerritoryDescription>{territory.description}</TerritoryDescription>
                <TerritoryStats>
                  <TerritoryStat>
                    <span>{territory.elevation}</span>
                    <span>Elevation</span>
                  </TerritoryStat>
                  <TerritoryStat>
                    <span>{territory.population}</span>
                    <span>Population</span>
                  </TerritoryStat>
                  <TerritoryStat>
                    <span>{territory.avgListing}</span>
                    <span>Avg. Listing</span>
                  </TerritoryStat>
                </TerritoryStats>
              </TerritoryContent>
            </TerritoryCard>
          ))}
        </TerritoryGrid>
        
        <MapContainer
          ref={mapRef}
          initial={{ opacity: 0, y: 30 }}
          animate={mapInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8 }}
        >
          <img src="/images/territory-map.jpeg" alt="Territory Map" />
          <MapTitle>
            <h3>Our Service Area</h3>
          </MapTitle>
        </MapContainer>
      </TerritoryContainer>
    </TerritorySection>
  );
};

export default Territory;