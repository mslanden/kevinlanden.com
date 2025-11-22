import React, { useEffect, useState, useRef } from 'react';
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
  background-color: rgba(0, 0, 0, 0.3);

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.5s ease;
  }

  &.contain-image img {
    object-fit: contain;
    background-color: rgba(0, 0, 0, 0.5);
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

// Photo Sphere Viewer Component
const PhotoSphere = ({ imageUrl, title, height = "400px" }) => {
  const viewerRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    if (!imageUrl || !containerRef.current) return;

    // Import Photo Sphere Viewer and CSS dynamically
    Promise.all([
      import('@photo-sphere-viewer/core'),
      import('@photo-sphere-viewer/autorotate-plugin'),
      import('@photo-sphere-viewer/core/index.css')
    ]).then(([{ Viewer }, { AutorotatePlugin }]) => {
      // Clean up any existing viewer
      if (viewerRef.current) {
        viewerRef.current.destroy();
      }

      try {
        viewerRef.current = new Viewer({
          container: containerRef.current,
          panorama: imageUrl,
          caption: title,
          plugins: [
            [AutorotatePlugin, {
              autostartDelay: 3000,
              autorotateSpeed: '2rpm'
            }]
          ],
          navbar: [
            'autorotate',
            'zoom',
            'caption',
            'fullscreen',
          ],
          defaultZoomLvl: 0,
          mousewheelCtrlKey: false,
          touchmoveTwoFingers: true,
          loadingTxt: 'Loading 360° Photo...',
        });
      } catch (error) {
        console.error('Error initializing PhotoSphere viewer:', error);
        // Fallback to regular image if viewer fails
        if (containerRef.current) {
          containerRef.current.innerHTML = `
            <img
              src="${imageUrl}"
              alt="${title || '360° Photo'}"
              style="width: 100%; height: 100%; object-fit: cover; border-radius: 8px;"
            />
          `;
        }
      }
    }).catch(error => {
      console.error('Failed to load PhotoSphere viewer:', error);
      // Fallback to regular image
      if (containerRef.current) {
        containerRef.current.innerHTML = `
          <img
            src="${imageUrl}"
            alt="${title || '360° Photo'}"
            style="width: 100%; height: 100%; object-fit: cover; border-radius: 8px;"
          />
        `;
      }
    });

    // Cleanup on unmount
    return () => {
      if (viewerRef.current) {
        viewerRef.current.destroy();
        viewerRef.current = null;
      }
    };
  }, [imageUrl, title]);

  return (
    <div style={{ position: 'relative', width: '100%', height: height }}>
      <div
        ref={containerRef}
        style={{ width: '100%', height: '100%', borderRadius: '8px', overflow: 'hidden' }}
      />
    </div>
  );
};

const BestInShow = () => {
  const [items, setItems] = useState({
    photography: [],
    'virtual-staging': [],
    'item-removal': [],
    '3d-tours': []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchBestInShowItems();
  }, []);

  const fetchBestInShowItems = async () => {
    try {
      const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';
      const response = await fetch(`${apiUrl}/best-in-show`);

      if (!response.ok) {
        throw new Error('Failed to fetch Best in Show items');
      }

      const data = await response.json();
      setItems(data);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching Best in Show items:', err);
      setError(err.message);
      setLoading(false);
    }
  };

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

  // Render helper functions
  const renderGalleryItem = (galleryItem, index) => {
    // Check if this is a floor plan or similar document that needs contain instead of cover
    const isFloorPlan = galleryItem.title?.toLowerCase().includes('floor plan') ||
                        galleryItem.title?.toLowerCase().includes('floorplan');

    return (
      <GalleryItem key={galleryItem.id || index} variants={item}>
        <GalleryImage className={isFloorPlan ? 'contain-image' : ''} style={isFloorPlan ? { height: '400px' } : {}}>
          <img src={galleryItem.image_url} alt={galleryItem.title} />
        </GalleryImage>
        <GalleryContent>
          <GalleryTitle>{galleryItem.title}</GalleryTitle>
          <GalleryDescription>{galleryItem.description}</GalleryDescription>
        </GalleryContent>
      </GalleryItem>
    );
  };

  const renderBeforeAfter = (beforeAfterItem, index) => (
    <GalleryItem key={beforeAfterItem.id || index} variants={item}>
      <GalleryImage>
        <BeforeAfterContainer>
          <div className="before">
            <img src={beforeAfterItem.image_url_before} alt={`${beforeAfterItem.title} Before`} />
            <div className="label">Before</div>
          </div>
          <div className="after">
            <img src={beforeAfterItem.image_url} alt={`${beforeAfterItem.title} After`} />
            <div className="label">After</div>
          </div>
        </BeforeAfterContainer>
      </GalleryImage>
      <GalleryContent>
        <GalleryTitle>{beforeAfterItem.title}</GalleryTitle>
        <GalleryDescription>{beforeAfterItem.description}</GalleryDescription>
      </GalleryContent>
    </GalleryItem>
  );

  const render360Viewer = (viewerItem, index) => (
    <GalleryItem key={viewerItem.id || index} variants={item}>
      <GalleryImage style={{ height: '400px' }}>
        <PhotoSphere imageUrl={viewerItem.image_url} title={viewerItem.title} height="400px" />
      </GalleryImage>
      <GalleryContent>
        <GalleryTitle>{viewerItem.title}</GalleryTitle>
        <GalleryDescription>{viewerItem.description}</GalleryDescription>
      </GalleryContent>
    </GalleryItem>
  );

  const renderIframeEmbed = (embedItem, index) => (
    <TourContainer key={embedItem.id || index}>
      <iframe
        src={embedItem.embed_url}
        height="450"
        width="100%"
        frameBorder="0"
        allowFullScreen
        title={embedItem.title}
      ></iframe>
    </TourContainer>
  );

  if (loading) {
    return (
      <PageContainer>
        <div style={{ textAlign: 'center', padding: '4rem 0', color: '#fff' }}>
          Loading Best in Show content...
        </div>
      </PageContainer>
    );
  }

  if (error) {
    return (
      <PageContainer>
        <div style={{ textAlign: 'center', padding: '4rem 0', color: '#fff' }}>
          Error loading content: {error}
        </div>
      </PageContainer>
    );
  }
  
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
      {items.photography && items.photography.length > 0 && (
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
              {items.photography.map((photoItem, index) => {
                if (photoItem.item_type === 'gallery-item') {
                  return renderGalleryItem(photoItem, index);
                } else if (photoItem.item_type === 'before-after') {
                  return renderBeforeAfter(photoItem, index);
                } else if (photoItem.item_type === '360-viewer') {
                  return render360Viewer(photoItem, index);
                }
                return null;
              })}
            </GalleryGrid>
          </ContentContainer>
        </ContentSection>
      )}
      
      {/* Virtual Staging Section */}
      {items['virtual-staging'] && items['virtual-staging'].length > 0 && (
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
              {items['virtual-staging'].map((stagingItem, index) => {
                if (stagingItem.item_type === 'gallery-item') {
                  return renderGalleryItem(stagingItem, index);
                } else if (stagingItem.item_type === 'before-after') {
                  return renderBeforeAfter(stagingItem, index);
                } else if (stagingItem.item_type === '360-viewer') {
                  return render360Viewer(stagingItem, index);
                }
                return null;
              })}
            </GalleryGrid>
          </ContentContainer>
        </ContentSection>
      )}
      
      {/* Item Removal Section */}
      {items['item-removal'] && items['item-removal'].length > 0 && (
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
              {items['item-removal'].map((removalItem, index) => {
                if (removalItem.item_type === 'gallery-item') {
                  return renderGalleryItem(removalItem, index);
                } else if (removalItem.item_type === 'before-after') {
                  return renderBeforeAfter(removalItem, index);
                } else if (removalItem.item_type === '360-viewer') {
                  return render360Viewer(removalItem, index);
                }
                return null;
              })}
            </GalleryGrid>
          </ContentContainer>
        </ContentSection>
      )}
      
      {/* 3D Tours & Floor Plans Section */}
      {items['3d-tours'] && items['3d-tours'].length > 0 && (
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

            {/* Render iframe-embeds first (like Zillow tours) */}
            {items['3d-tours']
              .filter(tourItem => tourItem.item_type === 'iframe-embed')
              .map((tourItem, index) => renderIframeEmbed(tourItem, index))}

            {/* Then render grid items (floor plans, 360 viewers, etc.) */}
            <ResponsiveGalleryGrid
              initial="hidden"
              animate={tourInView ? "visible" : "hidden"}
              variants={staggerItems}
            >
              {items['3d-tours']
                .filter(tourItem => tourItem.item_type !== 'iframe-embed')
                .map((tourItem, index) => {
                  if (tourItem.item_type === 'gallery-item') {
                    return renderGalleryItem(tourItem, index);
                  } else if (tourItem.item_type === 'before-after') {
                    return renderBeforeAfter(tourItem, index);
                  } else if (tourItem.item_type === '360-viewer') {
                    return render360Viewer(tourItem, index);
                  }
                  return null;
                })}
            </ResponsiveGalleryGrid>
          </ContentContainer>
        </ContentSection>
      )}
    </PageContainer>
  );
};

export default BestInShow;