import React, { useEffect } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

const PageContainer = styled.div`
  padding-top: 80px; /* Account for navbar */
`;

const PageHeader = styled.div`
  background-color: ${props => props.theme.colors.background.richDark};
  position: relative;
  padding: 6rem 0;
  text-align: center;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-image: url('/images/camera-equipment.jpg');
    background-size: cover;
    background-position: center;
    opacity: 0.2;
    z-index: 1;
  }
  
  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(to bottom, rgba(13, 13, 13, 0.8), #0d0d0d);
    z-index: 2;
  }
`;

const HeaderContent = styled.div`
  position: relative;
  z-index: 3;
  max-width: 1000px;
  margin: 0 auto;
  padding: 0 1.5rem;
`;

const PageTitle = styled(motion.h1)`
  font-family: ${props => props.theme.fonts.heading};
  font-size: 4rem;
  color: ${props => props.theme.colors.text.secondary};
  margin-bottom: 1.5rem;
  
  @media (max-width: ${props => props.theme.breakpoints.md}) {
    font-size: 3rem;
  }
`;

const PageDescription = styled(motion.p)`
  font-size: 1.2rem;
  color: ${props => props.theme.colors.text.primary};
  max-width: 800px;
  margin: 0 auto;
  line-height: 1.8;
`;

const ContentSection = styled.section`
  padding: 5rem 0;
  background-color: ${props => props.theme.colors.background.dark};
`;

const ContentContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1.5rem;
`;

const SectionHeader = styled.div`
  text-align: center;
  margin-bottom: 3rem;
  position: relative;
  
  &::after {
    content: '';
    position: absolute;
    bottom: -15px;
    left: 50%;
    transform: translateX(-50%);
    width: 100px;
    height: 2px;
    background: linear-gradient(to right, transparent, ${props => props.theme.colors.primary}, transparent);
  }
`;

const SectionTitle = styled(motion.h2)`
  font-family: ${props => props.theme.fonts.heading};
  font-size: 2.5rem;
  color: ${props => props.theme.colors.text.secondary};
  margin-bottom: 1rem;
  
  @media (max-width: ${props => props.theme.breakpoints.md}) {
    font-size: 2rem;
  }
`;

const SectionDescription = styled(motion.p)`
  font-size: 1.1rem;
  color: ${props => props.theme.colors.text.primary};
  max-width: 700px;
  margin: 0 auto;
  line-height: 1.7;
`;

const GalleryGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 2rem;
  margin-bottom: 4rem;
  
  @media (max-width: ${props => props.theme.breakpoints.md}) {
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  }
`;

const GalleryItem = styled(motion.div)`
  background-color: rgba(20, 20, 20, 0.85);
  border-radius: ${props => props.theme.borderRadius.default};
  overflow: hidden;
  border: 1px solid ${props => props.theme.colors.border};
  box-shadow: ${props => props.theme.shadows.medium};
  height: 100%;
  display: flex;
  flex-direction: column;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: ${props => props.theme.shadows.large};
    border-color: ${props => props.theme.colors.secondary};
    
    img {
      transform: scale(1.05);
    }
  }
`;

const GalleryImage = styled.div`
  height: 240px;
  overflow: hidden;
  position: relative;
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.5s ease;
  }
  
  &.before-after {
    display: flex;
    
    .image-half {
      width: 50%;
      height: 100%;
      
      img {
        height: 100%;
        width: 100%;
        object-fit: cover;
      }
      
      &:first-child {
        border-right: 1px solid ${props => props.theme.colors.border};
      }
    }
  }
`;

const GalleryContent = styled.div`
  padding: 1.5rem;
  flex: 1;
  display: flex;
  flex-direction: column;
`;

const GalleryTitle = styled.h3`
  font-family: ${props => props.theme.fonts.heading};
  font-size: 1.5rem;
  color: ${props => props.theme.colors.text.secondary};
  margin-bottom: 0.8rem;
`;

const GalleryDescription = styled.p`
  color: ${props => props.theme.colors.text.primary};
  line-height: 1.6;
  margin-bottom: 1rem;
  flex: 1;
`;

// Special components for different content types
const ResponsiveGalleryGrid = styled(motion.div)`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
  align-items: stretch;
  
  @media (max-width: ${props => props.theme.breakpoints.md}) {
    grid-template-columns: 1fr;
  }
`;

const BeforeAfterContainer = styled.div`
  position: relative;
  height: 100%;
  width: 100%;
  display: flex;
  overflow: hidden;
  
  .before, .after {
    position: relative;
    width: 50%;
    overflow: hidden;
  }
  
  .before {
    border-right: 2px solid ${props => props.theme.colors.secondary};
  }
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  
  .label {
    position: absolute;
    bottom: 10px;
    padding: 5px 10px;
    background-color: rgba(0, 0, 0, 0.7);
    color: white;
    font-size: 0.8rem;
    border-radius: 3px;
  }
  
  .before .label {
    left: 10px;
  }
  
  .after .label {
    right: 10px;
  }
`;

const TourContainer = styled.div`
  width: 100%;
  height: 450px;
  overflow: hidden;
  border-radius: ${props => props.theme.borderRadius.default};
  border: 1px solid ${props => props.theme.colors.border};
  margin-bottom: 2rem;
  
  iframe {
    width: 100%;
    height: 100%;
    border: none;
  }
  
  .kuula-container {
    width: 100%;
    height: 100%;
  }
`;

// Simple Kuula Iframe Component
const KuulaViewer = ({ kuulaId, height = "100%" }) => {
  return (
    <iframe 
      title={`Kuula 360° View ${kuulaId}`}
      width="100%" 
      height={height} 
      frameBorder="0" 
      allowFullScreen
      allow="xr-spatial-tracking; gyroscope; accelerometer"
      src={`https://kuula.co/share/${kuulaId}?logo=1&info=1&fs=1&vr=0&sd=1&thumbs=1`}
    ></iframe>
  );
};

const BestInShow = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  
  const [headerRef, headerInView] = useInView({
    triggerOnce: true,
    threshold: 0.2,
  });
  
  const [photoRef, photoInView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });
  
  const [virtualRef, virtualInView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });
  
  const [droneRef, droneInView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });
  
  const [tourRef, tourInView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });
  
  const fadeIn = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0 }
  };
  
  const staggerItems = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { staggerChildren: 0.2 }
    }
  };
  
  const item = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };
  
  return (
    <PageContainer>
      <PageHeader>
        <HeaderContent ref={headerRef}>
          <PageTitle
            initial="hidden"
            animate={headerInView ? "visible" : "hidden"}
            variants={fadeIn}
            transition={{ duration: 0.8 }}
          >
            Best In Show
          </PageTitle>
          <PageDescription
            initial="hidden"
            animate={headerInView ? "visible" : "hidden"}
            variants={fadeIn}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Showcasing the premium visual media services that help our listings stand out from the competition.
          </PageDescription>
        </HeaderContent>
      </PageHeader>
      
      {/* Photography Section */}
      <ContentSection>
        <ContentContainer>
          <SectionHeader>
            <SectionTitle
              ref={photoRef}
              initial="hidden"
              animate={photoInView ? "visible" : "hidden"}
              variants={fadeIn}
              transition={{ duration: 0.8 }}
            >
              Professional Photography
            </SectionTitle>
            <SectionDescription
              initial="hidden"
              animate={photoInView ? "visible" : "hidden"}
              variants={fadeIn}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              Expertly captured and hand-edited photos that showcase every property in its best light.
            </SectionDescription>
          </SectionHeader>
          
          <GalleryGrid
            initial="hidden"
            animate={photoInView ? "visible" : "hidden"}
            variants={staggerItems}
          >
            <GalleryItem variants={item}>
              <GalleryImage>
                <img src="/images/photo-example-1.jpeg" alt="Living Room" />
              </GalleryImage>
              <GalleryContent>
                <GalleryTitle>Residential Interior</GalleryTitle>
                <GalleryDescription>
                  Professional lighting and composition techniques highlight architectural features and create inviting spaces.
                </GalleryDescription>
              </GalleryContent>
            </GalleryItem>
            
            <GalleryItem variants={item}>
              <GalleryImage>
                <img src="/images/photo-example-2.jpeg" alt="Exterior" />
              </GalleryImage>
              <GalleryContent>
                <GalleryTitle>Exterior Showcase</GalleryTitle>
                <GalleryDescription>
                  Carefully timed outdoor photography captures curb appeal and surrounding landscape features.
                </GalleryDescription>
              </GalleryContent>
            </GalleryItem>
            
            <GalleryItem variants={item}>
              <GalleryImage>
                <img src="/images/photo-example-3.jpeg" alt="Detail" />
              </GalleryImage>
              <GalleryContent>
                <GalleryTitle>Drone Photography</GalleryTitle>
                <GalleryDescription>
                  Stunning aerial perspectives that capture the full scope of the property, landscape, and surrounding views.
                </GalleryDescription>
              </GalleryContent>
            </GalleryItem>
          </GalleryGrid>
        </ContentContainer>
      </ContentSection>
      
      {/* Virtual Staging Section */}
      <ContentSection style={{ backgroundColor: "#1a1613" /* warmDark */ }}>
        <ContentContainer>
          <SectionHeader>
            <SectionTitle
              ref={virtualRef}
              initial="hidden"
              animate={virtualInView ? "visible" : "hidden"}
              variants={fadeIn}
              transition={{ duration: 0.8 }}
            >
              Virtual Staging
            </SectionTitle>
            <SectionDescription
              initial="hidden"
              animate={virtualInView ? "visible" : "hidden"}
              variants={fadeIn}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              Transform empty rooms into beautifully furnished spaces that help buyers visualize the potential.
            </SectionDescription>
          </SectionHeader>
          
          <GalleryGrid
            initial="hidden"
            animate={virtualInView ? "visible" : "hidden"}
            variants={staggerItems}
            style={{ maxWidth: '900px', margin: '0 auto 4rem' }}
          >
            <GalleryItem variants={item}>
              <GalleryImage>
                <BeforeAfterContainer>
                  <div className="before">
                    <img src="/images/virtual-before-1.jpeg" alt="Living Room Before Virtual Staging" />
                    <div className="label">Before</div>
                  </div>
                  <div className="after">
                    <img src="/images/virtual-after-1.jpeg" alt="Living Room After Virtual Staging" />
                    <div className="label">After</div>
                  </div>
                </BeforeAfterContainer>
              </GalleryImage>
              <GalleryContent>
                <GalleryTitle>Living Room Transformation</GalleryTitle>
                <GalleryDescription>
                  Virtual staging adds modern furniture and decor to empty spaces, helping buyers visualize the living potential.
                </GalleryDescription>
              </GalleryContent>
            </GalleryItem>
            
            <GalleryItem variants={item}>
              <GalleryImage>
                <BeforeAfterContainer>
                  <div className="before">
                    <img src="/images/virtual-before-2.jpeg" alt="Master Bedroom Before Virtual Staging" />
                    <div className="label">Before</div>
                  </div>
                  <div className="after">
                    <img src="/images/virtual-after-2.jpeg" alt="Master Bedroom After Virtual Staging" />
                    <div className="label">After</div>
                  </div>
                </BeforeAfterContainer>
              </GalleryImage>
              <GalleryContent>
                <GalleryTitle>Master Bedroom Enhancement</GalleryTitle>
                <GalleryDescription>
                  Virtual staging creates warm and inviting bedroom spaces that showcase the room's true potential.
                </GalleryDescription>
              </GalleryContent>
            </GalleryItem>
          </GalleryGrid>
        </ContentContainer>
      </ContentSection>
      
      {/* Item Removal Section */}
      <ContentSection>
        <ContentContainer>
          <SectionHeader>
            <SectionTitle
              ref={droneRef}
              initial="hidden"
              animate={droneInView ? "visible" : "hidden"}
              variants={fadeIn}
              transition={{ duration: 0.8 }}
            >
              Item Removal
            </SectionTitle>
            <SectionDescription
              initial="hidden"
              animate={droneInView ? "visible" : "hidden"}
              variants={fadeIn}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              Clean up and declutter spaces digitally to present a pristine property without physical staging.
            </SectionDescription>
          </SectionHeader>
          
          <GalleryGrid
            initial="hidden"
            animate={droneInView ? "visible" : "hidden"}
            variants={staggerItems}
            style={{ maxWidth: '900px', margin: '0 auto 4rem' }}
          >
            <GalleryItem variants={item}>
              <GalleryImage>
                <BeforeAfterContainer>
                  <div className="before">
                    <img src="/images/removal-before-1.jpeg" alt="Living Space Before Item Removal" />
                    <div className="label">Before</div>
                  </div>
                  <div className="after">
                    <img src="/images/removal-after-1.jpeg" alt="Living Space After Item Removal" />
                    <div className="label">After</div>
                  </div>
                </BeforeAfterContainer>
              </GalleryImage>
              <GalleryContent>
                <GalleryTitle>Restaged Living Space</GalleryTitle>
                <GalleryDescription>
                  Digital restaging removes clutter and reimagines the space with inviting, updated furnishings for a fresh look.
                </GalleryDescription>
              </GalleryContent>
            </GalleryItem>
            
            <GalleryItem variants={item}>
              <GalleryImage>
                <BeforeAfterContainer>
                  <div className="before">
                    <img src="/images/removal-before-2.jpeg" alt="Kitchen Before Item Removal" />
                    <div className="label">Before</div>
                  </div>
                  <div className="after">
                    <img src="/images/removal-after-2.jpeg" alt="Kitchen After Item Removal" />
                    <div className="label">After</div>
                  </div>
                </BeforeAfterContainer>
              </GalleryImage>
              <GalleryContent>
                <GalleryTitle>Item Removal</GalleryTitle>
                <GalleryDescription>
                  See how a clutter-free, empty space allows buyers to appreciate the room’s size and envision their own furnishings—making it easier to imagine the possibilities.
                </GalleryDescription>
              </GalleryContent>
            </GalleryItem>
          </GalleryGrid>
        </ContentContainer>
      </ContentSection>
      
      {/* 3D Tours & Floor Plans Section */}
      <ContentSection style={{ backgroundColor: "#101318" /* coolDark */ }}>
        <ContentContainer>
          <SectionHeader>
            <SectionTitle
              ref={tourRef}
              initial="hidden"
              animate={tourInView ? "visible" : "hidden"}
              variants={fadeIn}
              transition={{ duration: 0.8 }}
            >
              3D Tours & Floor Plans
            </SectionTitle>
            <SectionDescription
              initial="hidden"
              animate={tourInView ? "visible" : "hidden"}
              variants={fadeIn}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              Immersive virtual experiences that allow buyers to explore properties from anywhere.
            </SectionDescription>
          </SectionHeader>
          
          <TourContainer>
            <iframe 
              src="https://www.zillow.com/view-imx/bf81432d-958e-42c7-9412-5200c94d443d?initialViewType=pano&utm_source=dashboard" 
              height="450" 
              width="100%" 
              frameBorder="0" 
              allowFullScreen
              title="Zillow 3D Tour"
            ></iframe>
          </TourContainer>
          
          <ResponsiveGalleryGrid
            initial="hidden"
            animate={tourInView ? "visible" : "hidden"}
            variants={staggerItems}
          >
            <GalleryItem variants={item}>
              <GalleryImage style={{ height: '400px' }}>
                <img src="/images/floorplan.jpeg" alt="Floor Plan Example" style={{ height: '100%', objectFit: 'cover', backgroundColor: '#0d0d0d' }} />
              </GalleryImage>
              <GalleryContent>
                <GalleryTitle>Floor Plans</GalleryTitle>
                <GalleryDescription>
                  Detailed floor plans help buyers understand the layout and flow of the property.
                </GalleryDescription>
              </GalleryContent>
            </GalleryItem>
            
            <GalleryItem variants={item}>
              <GalleryImage style={{ height: '400px' }}>
                <KuulaViewer kuulaId="h5Hpv" height="400px" />
              </GalleryImage>
              <GalleryContent>
                <GalleryTitle>360° PhotoSpheres</GalleryTitle>
                <GalleryDescription>
                  Immersive 360-degree views of key rooms and outdoor areas provide a realistic virtual experience.
                </GalleryDescription>
              </GalleryContent>
            </GalleryItem>
          </ResponsiveGalleryGrid>
        </ContentContainer>
      </ContentSection>
    </PageContainer>
  );
};

export default BestInShow;