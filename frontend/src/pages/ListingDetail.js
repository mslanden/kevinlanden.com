import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import {
  FaBed,
  FaBath,
  FaRulerCombined,
  FaMapMarkerAlt,
  FaHome,
  FaCalendar,
  FaTree,
  FaChevronLeft,
  FaChevronRight,
  FaExpand,
  FaTimes,
  FaCheckCircle
} from 'react-icons/fa';
import api from '../utils/api';

const PageContainer = styled.div`
  padding-top: 80px;
  min-height: 100vh;
  background-color: ${props => props.theme.colors.background.dark};
`;

const LoadingContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 60vh;
  color: ${props => props.theme.colors.text.muted};
  font-size: 1.2rem;
`;

const NotFoundContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 60vh;
  text-align: center;
  padding: 2rem;

  h2 {
    font-family: ${props => props.theme.fonts.heading};
    font-size: 2.5rem;
    color: ${props => props.theme.colors.text.secondary};
    margin-bottom: 1rem;
  }

  p {
    color: ${props => props.theme.colors.text.muted};
    font-size: 1.1rem;
  }
`;

const ListingHeader = styled.section`
  background: linear-gradient(135deg, rgba(20, 20, 20, 0.95) 0%, rgba(10, 10, 10, 0.95) 100%);
  padding: 3rem 0;
  border-bottom: 1px solid ${props => props.theme.colors.border};
`;

const HeaderContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1.5rem;
`;

const TitleRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  flex-wrap: wrap;
  gap: 2rem;
  margin-bottom: 1.5rem;
`;

const ListingTitle = styled(motion.h1)`
  font-family: ${props => props.theme.fonts.heading};
  font-size: 2.5rem;
  color: ${props => props.theme.colors.text.secondary};

  @media (max-width: ${props => props.theme.breakpoints.md}) {
    font-size: 2rem;
  }
`;

const ListingPrice = styled(motion.div)`
  font-size: 2.5rem;
  font-weight: bold;
  color: ${props => props.theme.colors.primary};

  @media (max-width: ${props => props.theme.breakpoints.md}) {
    font-size: 2rem;
  }
`;

const LocationInfo = styled(motion.div)`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: ${props => props.theme.colors.text.primary};
  font-size: 1.1rem;
  margin-bottom: 1.5rem;

  svg {
    color: ${props => props.theme.colors.primary};
  }
`;

const DetailsList = styled(motion.div)`
  display: flex;
  flex-wrap: wrap;
  gap: 2rem;
`;

const DetailItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: ${props => props.theme.colors.text.primary};

  svg {
    color: ${props => props.theme.colors.secondary};
    font-size: 1.1rem;
  }

  span {
    font-weight: 600;
  }
`;

const GallerySection = styled.section`
  padding: 3rem 0;
`;

const GalleryContainer = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 1.5rem;
`;

const MainImage = styled(motion.div)`
  position: relative;
  width: 100%;
  height: 600px;
  border-radius: ${props => props.theme.borderRadius.large};
  overflow: hidden;
  margin-bottom: 1rem;
  cursor: pointer;

  @media (max-width: ${props => props.theme.breakpoints.md}) {
    height: 400px;
  }

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  &:hover .expand-icon {
    opacity: 1;
  }
`;

const ExpandIcon = styled.div`
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: rgba(0, 0, 0, 0.7);
  color: white;
  padding: 0.75rem;
  border-radius: 50%;
  opacity: 0;
  transition: opacity 0.3s ease;
`;

const ThumbnailGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 0.5rem;

  @media (max-width: ${props => props.theme.breakpoints.md}) {
    grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
  }
`;

const Thumbnail = styled.div`
  aspect-ratio: 16 / 9;
  border-radius: ${props => props.theme.borderRadius.small};
  overflow: hidden;
  cursor: pointer;
  border: 2px solid ${props => props.active ? props.theme.colors.primary : 'transparent'};
  transition: all 0.3s ease;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  &:hover {
    border-color: ${props => props.theme.colors.secondary};
    transform: scale(1.05);
  }
`;

const ContentSection = styled.section`
  padding: 3rem 0;
`;

const ContentContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1.5rem;
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 3rem;

  @media (max-width: ${props => props.theme.breakpoints.lg}) {
    grid-template-columns: 1fr;
  }
`;

const MainContent = styled.div``;

const Sidebar = styled.div``;

const ContentCard = styled(motion.div)`
  background: rgba(20, 20, 20, 0.85);
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius.default};
  padding: 2rem;
  margin-bottom: 2rem;
`;

const CardTitle = styled.h2`
  font-family: ${props => props.theme.fonts.heading};
  font-size: 1.8rem;
  color: ${props => props.theme.colors.text.secondary};
  margin-bottom: 1.5rem;
  display: flex;
  align-items: center;
  gap: 0.75rem;

  svg {
    color: ${props => props.theme.colors.primary};
    font-size: 1.5rem;
  }
`;

const Description = styled.p`
  color: ${props => props.theme.colors.text.primary};
  line-height: 1.8;
  font-size: 1.05rem;
`;

const FeaturesList = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 1rem;
`;

const FeatureItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: ${props => props.theme.colors.text.primary};

  svg {
    color: ${props => props.theme.colors.primary};
    font-size: 1rem;
  }
`;

const ToursSection = styled.section`
  padding: 4rem 0;
  background: ${props => props.theme.colors.background.richDark};
`;

const ToursContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1.5rem;
`;

const TourTitle = styled(motion.h2)`
  font-family: ${props => props.theme.fonts.heading};
  font-size: 2.5rem;
  color: ${props => props.theme.colors.text.secondary};
  text-align: center;
  margin-bottom: 3rem;

  @media (max-width: ${props => props.theme.breakpoints.md}) {
    font-size: 2rem;
  }
`;

const ZillowTourContainer = styled(motion.div)`
  width: 100%;
  height: 500px;
  border-radius: ${props => props.theme.borderRadius.large};
  overflow: hidden;
  margin-bottom: 3rem;
  border: 1px solid ${props => props.theme.colors.border};

  iframe {
    width: 100%;
    height: 100%;
    border: none;
  }

  @media (max-width: ${props => props.theme.breakpoints.md}) {
    height: 400px;
  }
`;

const FloorPlanAndSpheresGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;

  @media (max-width: ${props => props.theme.breakpoints.lg}) {
    grid-template-columns: 1fr;
  }
`;

const FloorPlanContainer = styled(motion.div)`
  background: rgba(20, 20, 20, 0.85);
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius.default};
  padding: 1.5rem;

  h3 {
    font-family: ${props => props.theme.fonts.heading};
    font-size: 1.5rem;
    color: ${props => props.theme.colors.text.secondary};
    margin-bottom: 1rem;
  }

  img {
    width: 100%;
    height: auto;
    border-radius: ${props => props.theme.borderRadius.default};
    cursor: pointer;
  }
`;

const KuulaSpheresContainer = styled(motion.div)`
  background: rgba(20, 20, 20, 0.85);
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius.default};
  padding: 1.5rem;

  h3 {
    font-family: ${props => props.theme.fonts.heading};
    font-size: 1.5rem;
    color: ${props => props.theme.colors.text.secondary};
    margin-bottom: 1rem;
  }
`;

const KuulaSphere = styled.div`
  margin-bottom: 1.5rem;

  h4 {
    color: ${props => props.theme.colors.text.primary};
    margin-bottom: 0.75rem;
    font-size: 1.1rem;
  }

  iframe {
    width: 100%;
    height: 300px;
    border-radius: ${props => props.theme.borderRadius.default};
    border: none;
  }
`;

const ComingSoon = styled.div`
  background: rgba(139, 69, 19, 0.1);
  border: 1px dashed ${props => props.theme.colors.primary};
  border-radius: ${props => props.theme.borderRadius.default};
  padding: 2rem;
  text-align: center;
  color: ${props => props.theme.colors.text.muted};

  h3 {
    color: ${props => props.theme.colors.text.secondary};
    margin-bottom: 0.5rem;
  }
`;

const ContactButton = styled(Link)`
  display: inline-block;
  background: ${props => props.theme.colors.primary};
  color: white;
  padding: 1rem 2rem;
  border-radius: ${props => props.theme.borderRadius.default};
  text-decoration: none;
  font-weight: 600;
  font-size: 1.1rem;
  text-align: center;
  transition: all 0.3s ease;
  margin-top: 1rem;

  &:hover {
    background: ${props => props.theme.colors.secondary};
    color: white;
    text-decoration: none;
    transform: translateY(-2px);
  }

  &:focus {
    outline: 2px solid ${props => props.theme.colors.secondary};
    outline-offset: 2px;
  }
`;

const ContactInfo = styled.div`
  text-align: center;

  p {
    color: ${props => props.theme.colors.text.primary};
    margin-bottom: 1rem;
    line-height: 1.6;
    text-align: center;
  }
`;

const Lightbox = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.95);
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
`;

const LightboxImage = styled.img`
  max-width: 90vw;
  max-height: 90vh;
  object-fit: contain;
`;

const CloseButton = styled.button`
  position: absolute;
  top: 2rem;
  right: 2rem;
  background: rgba(255, 255, 255, 0.1);
  color: white;
  border: none;
  padding: 1rem;
  border-radius: 50%;
  cursor: pointer;
  font-size: 1.5rem;
  transition: all 0.3s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.2);
  }
`;

const NavigationButton = styled.button`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background: rgba(255, 255, 255, 0.1);
  color: white;
  border: none;
  padding: 1rem;
  cursor: pointer;
  font-size: 2rem;
  transition: all 0.3s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.2);
  }

  &.prev {
    left: 2rem;
  }

  &.next {
    right: 2rem;
  }
`;

// Google Drive Video Component
const GoogleDriveVideo = ({ url, title, height = "400px" }) => {
  // Convert Google Drive share URL to embed URL
  const getEmbedUrl = (driveUrl) => {
    if (!driveUrl) return '';

    // Extract file ID from various Google Drive URL formats
    let fileId = '';

    // Handle direct share URLs: https://drive.google.com/file/d/FILE_ID/view
    const shareMatch = driveUrl.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
    if (shareMatch) {
      fileId = shareMatch[1];
    }

    // If we found a file ID, create embed URL
    if (fileId) {
      return `https://drive.google.com/file/d/${fileId}/preview`;
    }

    // Fallback: if already a preview URL, use as-is
    if (driveUrl.includes('/preview')) {
      return driveUrl;
    }

    return driveUrl; // Return original if can't parse
  };

  const embedUrl = getEmbedUrl(url);

  return (
    <iframe
      title={title || 'Property Video'}
      width="100%"
      height={height}
      frameBorder="0"
      allowFullScreen
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
      src={embedUrl}
      style={{
        borderRadius: '8px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.3)'
      }}
    ></iframe>
  );
};

// Google Drive 360° Sphere Viewer
const GoogleDriveSphere = ({ driveUrl, title, height = "300px" }) => {
  // For 360° photos, we'll use the same embed approach
  // Note: Google Drive doesn't have native 360° viewer, but the image will display
  const getEmbedUrl = (url) => {
    if (!url) return '';

    const shareMatch = url.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
    if (shareMatch) {
      const fileId = shareMatch[1];
      return `https://drive.google.com/file/d/${fileId}/preview`;
    }

    return url.includes('/preview') ? url : url;
  };

  const embedUrl = getEmbedUrl(driveUrl);

  return (
    <iframe
      title={title || '360° Photo Sphere'}
      width="100%"
      height={height}
      frameBorder="0"
      allowFullScreen
      src={embedUrl}
      style={{
        borderRadius: '8px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.3)'
      }}
    ></iframe>
  );
};

const ListingDetail = () => {
  const { slug } = useParams();
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxImageIndex, setLightboxImageIndex] = useState(0);

  const [headerRef, headerInView] = useInView({ triggerOnce: true, threshold: 0.2 });
  const [galleryRef, galleryInView] = useInView({ triggerOnce: true, threshold: 0.1 });
  const [contentRef, contentInView] = useInView({ triggerOnce: true, threshold: 0.1 });
  const [toursRef, toursInView] = useInView({ triggerOnce: true, threshold: 0.1 });

  useEffect(() => {
    fetchListing();
    window.scrollTo(0, 0);
  }, [slug]);

  const fetchListing = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/listings/${slug}`);
      setListing(response.data);
    } catch (error) {
      console.error('Error fetching listing:', error);
      setListing(null);
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price) => {
    if (!price) return 'Price TBD';
    return `$${Number(price).toLocaleString()}`;
  };

  const getAllImages = () => {
    const images = [];
    if (listing?.main_image_url) {
      images.push({ url: listing.main_image_url, caption: 'Main Image' });
    }
    if (listing?.listing_images) {
      images.push(...listing.listing_images.map(img => ({
        url: img.image_url,
        caption: img.caption || ''
      })));
    }
    return images;
  };

  const openLightbox = (index) => {
    setLightboxImageIndex(index);
    setLightboxOpen(true);
  };

  const closeLightbox = () => {
    setLightboxOpen(false);
  };

  const navigateLightbox = (direction) => {
    const images = getAllImages();
    if (direction === 'prev') {
      setLightboxImageIndex((prev) => (prev - 1 + images.length) % images.length);
    } else {
      setLightboxImageIndex((prev) => (prev + 1) % images.length);
    }
  };

  const fadeIn = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0 }
  };

  if (loading) {
    return (
      <PageContainer>
        <LoadingContainer>Loading listing...</LoadingContainer>
      </PageContainer>
    );
  }

  if (!listing) {
    return (
      <PageContainer>
        <NotFoundContainer>
          <h2>Listing Not Found</h2>
          <p>The listing you're looking for doesn't exist or has been removed.</p>
        </NotFoundContainer>
      </PageContainer>
    );
  }

  const images = getAllImages();

  return (
    <PageContainer>
      <ListingHeader ref={headerRef}>
        <HeaderContent>
          <TitleRow>
            <ListingTitle
              initial="hidden"
              animate={headerInView ? "visible" : "hidden"}
              variants={fadeIn}
              transition={{ duration: 0.6 }}
            >
              {listing.title}
            </ListingTitle>
            <ListingPrice
              initial="hidden"
              animate={headerInView ? "visible" : "hidden"}
              variants={fadeIn}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              {formatPrice(listing.price)}
            </ListingPrice>
          </TitleRow>

          <LocationInfo
            initial="hidden"
            animate={headerInView ? "visible" : "hidden"}
            variants={fadeIn}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <FaMapMarkerAlt />
            {listing.address && `${listing.address}, `}
            {listing.city}, {listing.state} {listing.zip_code}
          </LocationInfo>

          <DetailsList
            initial="hidden"
            animate={headerInView ? "visible" : "hidden"}
            variants={fadeIn}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            {listing.bedrooms && (
              <DetailItem>
                <FaBed />
                <span>{listing.bedrooms}</span> Bedrooms
              </DetailItem>
            )}
            {listing.bathrooms && (
              <DetailItem>
                <FaBath />
                <span>{listing.bathrooms}</span> Bathrooms
              </DetailItem>
            )}
            {listing.square_feet && (
              <DetailItem>
                <FaRulerCombined />
                <span>{Number(listing.square_feet).toLocaleString()}</span> Sq Ft
              </DetailItem>
            )}
            {listing.lot_size && (
              <DetailItem>
                <FaTree />
                <span>{listing.lot_size}</span> Acres
              </DetailItem>
            )}
            {listing.year_built && (
              <DetailItem>
                <FaCalendar />
                Built in <span>{listing.year_built}</span>
              </DetailItem>
            )}
            {listing.property_type && (
              <DetailItem>
                <FaHome />
                <span>{listing.property_type.charAt(0).toUpperCase() + listing.property_type.slice(1)}</span>
              </DetailItem>
            )}
          </DetailsList>
        </HeaderContent>
      </ListingHeader>

      {images.length > 0 && (
        <GallerySection ref={galleryRef}>
          <GalleryContainer>
            <MainImage
              initial="hidden"
              animate={galleryInView ? "visible" : "hidden"}
              variants={fadeIn}
              transition={{ duration: 0.6 }}
              onClick={() => openLightbox(currentImageIndex)}
            >
              <img src={images[currentImageIndex].url} alt={images[currentImageIndex].caption} />
              <ExpandIcon className="expand-icon">
                <FaExpand />
              </ExpandIcon>
            </MainImage>

            {images.length > 1 && (
              <ThumbnailGrid>
                {images.map((img, index) => (
                  <Thumbnail
                    key={index}
                    active={index === currentImageIndex}
                    onClick={() => setCurrentImageIndex(index)}
                  >
                    <img src={img.url} alt={img.caption} />
                  </Thumbnail>
                ))}
              </ThumbnailGrid>
            )}
          </GalleryContainer>
        </GallerySection>
      )}

      <ContentSection ref={contentRef}>
        <ContentContainer>
          <MainContent>
            {listing.description && (
              <ContentCard
                initial="hidden"
                animate={contentInView ? "visible" : "hidden"}
                variants={fadeIn}
                transition={{ duration: 0.6 }}
              >
                <CardTitle>
                  <FaHome /> Property Description
                </CardTitle>
                <Description>{listing.description}</Description>
              </ContentCard>
            )}

            {listing.listing_features && listing.listing_features.length > 0 && (
              <ContentCard
                initial="hidden"
                animate={contentInView ? "visible" : "hidden"}
                variants={fadeIn}
                transition={{ duration: 0.6, delay: 0.1 }}
              >
                <CardTitle>
                  <FaCheckCircle /> Property Features
                </CardTitle>
                <FeaturesList>
                  {listing.listing_features.map((feature, index) => (
                    <FeatureItem key={index}>
                      <FaCheckCircle />
                      {feature.feature}
                    </FeatureItem>
                  ))}
                </FeaturesList>
              </ContentCard>
            )}
          </MainContent>

          <Sidebar>
            <ContentCard
              initial="hidden"
              animate={contentInView ? "visible" : "hidden"}
              variants={fadeIn}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <CardTitle>Contact</CardTitle>
              <ContactInfo>
                <p>Interested in this property? Get in touch with Outrider Realty for more information, to schedule a viewing, or to make an offer.</p>
                <ContactButton to="/contact">
                  Contact Us
                </ContactButton>
              </ContactInfo>
            </ContentCard>
          </Sidebar>
        </ContentContainer>
      </ContentSection>

      {(listing.zillow_tour_url || listing.floor_plan_url || listing.drone_video_url ||
        (listing.listing_kuula_spheres && listing.listing_kuula_spheres.length > 0)) && (
        <ToursSection ref={toursRef}>
          <ToursContainer>
            <TourTitle
              initial="hidden"
              animate={toursInView ? "visible" : "hidden"}
              variants={fadeIn}
              transition={{ duration: 0.6 }}
            >
              3D Tours & Floor Plans
            </TourTitle>

            {listing.zillow_tour_url && (
              <ZillowTourContainer
                initial="hidden"
                animate={toursInView ? "visible" : "hidden"}
                variants={fadeIn}
                transition={{ duration: 0.6, delay: 0.1 }}
              >
                <iframe
                  src={listing.zillow_tour_url}
                  allowFullScreen
                  title="Zillow 3D Tour"
                />
              </ZillowTourContainer>
            )}

            <FloorPlanAndSpheresGrid>
              {listing.floor_plan_url ? (
                <FloorPlanContainer
                  initial="hidden"
                  animate={toursInView ? "visible" : "hidden"}
                  variants={fadeIn}
                  transition={{ duration: 0.6, delay: 0.2 }}
                >
                  <h3>Floor Plan</h3>
                  <img
                    src={listing.floor_plan_url}
                    alt="Floor Plan"
                    onClick={() => window.open(listing.floor_plan_url, '_blank')}
                  />
                </FloorPlanContainer>
              ) : (
                <ComingSoon>
                  <h3>Floor Plan</h3>
                  <p>Coming soon</p>
                </ComingSoon>
              )}

              {listing.drone_video_url && (
                <KuulaSpheresContainer
                  initial="hidden"
                  animate={toursInView ? "visible" : "hidden"}
                  variants={fadeIn}
                  transition={{ duration: 0.6, delay: 0.2 }}
                >
                  <h3>Drone Video</h3>
                  <KuulaSphere>
                    <GoogleDriveVideo url={listing.drone_video_url} title="Property Drone Video" />
                  </KuulaSphere>
                </KuulaSpheresContainer>
              )}

              {listing.listing_kuula_spheres && listing.listing_kuula_spheres.length > 0 ? (
                <KuulaSpheresContainer
                  initial="hidden"
                  animate={toursInView ? "visible" : "hidden"}
                  variants={fadeIn}
                  transition={{ duration: 0.6, delay: 0.3 }}
                >
                  <h3>360° PhotoSpheres</h3>
                  {listing.listing_kuula_spheres.map((sphere, index) => (
                    <KuulaSphere key={index}>
                      {sphere.title && <h4>{sphere.title}</h4>}
                      <GoogleDriveSphere driveUrl={sphere.drive_url || sphere.kuula_id} title={sphere.title} />
                    </KuulaSphere>
                  ))}
                </KuulaSpheresContainer>
              ) : (
                <ComingSoon>
                  <h3>360° PhotoSpheres</h3>
                  <p>Coming soon</p>
                </ComingSoon>
              )}
            </FloorPlanAndSpheresGrid>
          </ToursContainer>
        </ToursSection>
      )}

      {lightboxOpen && images.length > 0 && (
        <Lightbox
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={closeLightbox}
        >
          <CloseButton onClick={closeLightbox}>
            <FaTimes />
          </CloseButton>

          {images.length > 1 && (
            <>
              <NavigationButton className="prev" onClick={(e) => {
                e.stopPropagation();
                navigateLightbox('prev');
              }}>
                <FaChevronLeft />
              </NavigationButton>
              <NavigationButton className="next" onClick={(e) => {
                e.stopPropagation();
                navigateLightbox('next');
              }}>
                <FaChevronRight />
              </NavigationButton>
            </>
          )}

          <LightboxImage
            src={images[lightboxImageIndex].url}
            alt={images[lightboxImageIndex].caption}
            onClick={(e) => e.stopPropagation()}
          />
        </Lightbox>
      )}
    </PageContainer>
  );
};

export default ListingDetail;