import React, { useEffect, useState, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Helmet } from 'react-helmet-async';
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
  FaCheckCircle,
  FaPlay,
  FaPause,
  FaFilePdf,
  FaDownload,
  FaBook,
  FaShare,
  FaFacebook,
  FaTwitter,
  FaLinkedin,
  FaEnvelope,
  FaCopy,
  FaPrint,
  FaMobileAlt
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

const PdfViewerContainer = styled.div`
  width: 100%;
  height: 600px;
  background: #525659;
  border-radius: ${props => props.theme.borderRadius.default};
  overflow: hidden;
  margin-bottom: 1rem;

  @media (max-width: ${props => props.theme.breakpoints.md}) {
    display: none; /* Hide iframe on mobile */
  }

  iframe {
    width: 100%;
    height: 100%;
    border: none;
  }
`;

const MobilePdfCard = styled.div`
  display: none;
  background: rgba(139, 69, 19, 0.1);
  border: 2px solid ${props => props.theme.colors.primary};
  border-radius: ${props => props.theme.borderRadius.default};
  padding: 3rem 2rem;
  text-align: center;
  margin-bottom: 1rem;

  @media (max-width: ${props => props.theme.breakpoints.md}) {
    display: block; /* Show on mobile */
  }

  svg {
    font-size: 4rem;
    color: ${props => props.theme.colors.primary};
    margin-bottom: 1rem;
  }

  h3 {
    font-family: ${props => props.theme.fonts.heading};
    font-size: 1.5rem;
    color: ${props => props.theme.colors.text.secondary};
    margin-bottom: 0.5rem;
  }

  p {
    color: ${props => props.theme.colors.text.primary};
    margin-bottom: 1.5rem;
    line-height: 1.6;
  }
`;

const DownloadButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  background: ${props => props.theme.colors.primary};
  color: white;
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: ${props => props.theme.borderRadius.default};
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  width: 100%;
  justify-content: center;

  &:hover {
    background: ${props => props.theme.colors.secondary};
    transform: translateY(-2px);
    box-shadow: ${props => props.theme.shadows.medium};
  }

  svg {
    font-size: 1.1rem;
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

const ShareGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0.75rem;
  margin-top: 1rem;
`;

const ShareButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.75rem;
  border: 1px solid ${props => props.theme.colors.border};
  background: rgba(255, 255, 255, 0.05);
  color: ${props => props.theme.colors.text.primary};
  border-radius: ${props => props.theme.borderRadius.small};
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 0.9rem;

  &:hover {
    background: ${props => props.$color || props.theme.colors.primary}22;
    border-color: ${props => props.$color || props.theme.colors.primary};
    color: ${props => props.$color || props.theme.colors.primary};
    transform: translateY(-2px);
  }

  svg {
    font-size: 1.1rem;
  }

  &.facebook:hover {
    background: #1877f222;
    border-color: #1877f2;
    color: #1877f2;
  }

  &.twitter:hover {
    background: #1da1f222;
    border-color: #1da1f2;
    color: #1da1f2;
  }

  &.linkedin:hover {
    background: #0077b522;
    border-color: #0077b5;
    color: #0077b5;
  }

  &.email:hover {
    background: ${props => props.theme.colors.secondary}22;
    border-color: ${props => props.theme.colors.secondary};
    color: ${props => props.theme.colors.secondary};
  }
`;

const StatGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  margin-top: 1rem;
`;

const StatItem = styled.div`
  text-align: center;
  padding: 1rem;
  background: rgba(0, 0, 0, 0.3);
  border-radius: ${props => props.theme.borderRadius.small};
  border: 1px solid ${props => props.theme.colors.border};

  .stat-value {
    font-size: 1.5rem;
    font-weight: bold;
    color: ${props => props.theme.colors.primary};
    margin-bottom: 0.25rem;
  }

  .stat-label {
    font-size: 0.85rem;
    color: ${props => props.theme.colors.text.muted};
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }
`;

const CopyNotification = styled(motion.div)`
  position: fixed;
  top: 100px;
  right: 2rem;
  background: ${props => props.theme.colors.primary};
  color: white;
  padding: 1rem 1.5rem;
  border-radius: ${props => props.theme.borderRadius.default};
  box-shadow: ${props => props.theme.shadows.large};
  display: flex;
  align-items: center;
  gap: 0.5rem;
  z-index: 1000;

  svg {
    font-size: 1.2rem;
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
  top: 5rem;
  right: 2rem;
  background: rgba(255, 255, 255, 0.1);
  color: white;
  border: none;
  padding: 1rem;
  border-radius: 50%;
  cursor: pointer;
  font-size: 1.5rem;
  transition: all 0.3s ease;
  z-index: 10001;

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

// Hero Video Component
const HeroVideoContainer = styled(motion.div)`
  position: relative;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  margin-left: calc(-50vw + 50%);
  margin-top: -80px;
  overflow: hidden;
  background: #000;
  cursor: pointer;

  @media (max-width: ${props => props.theme.breakpoints.md}) {
    height: 100vh;
    margin-top: -70px;
  }
`;

const HeroVideo = styled.video`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const VideoOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background:
    linear-gradient(to bottom, rgba(0,0,0,0.5) 0%, rgba(0,0,0,0.3) 10%, rgba(0,0,0,0) 15%),
    linear-gradient(to top, rgba(0,0,0,0.5) 0%, rgba(0,0,0,0.3) 15%, rgba(0,0,0,0) 30%);
  pointer-events: none;
`;

const PlayPauseButton = styled.button`
  position: absolute;
  bottom: 2rem;
  right: 2rem;
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(10px);
  border: 2px solid rgba(255, 255, 255, 0.3);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  z-index: 10;

  &:hover {
    background: rgba(0, 0, 0, 0.8);
    transform: scale(1.1);
    border-color: rgba(255, 255, 255, 0.5);
  }

  svg {
    font-size: 1.5rem;
    margin-left: ${props => props.$isPlaying ? '0' : '3px'};
  }

  @media (max-width: ${props => props.theme.breakpoints.md}) {
    width: 50px;
    height: 50px;
    bottom: 1rem;
    right: 1rem;

    svg {
      font-size: 1.2rem;
    }
  }
`;

// Property Info Overlay for Hero Video
const PropertyInfoOverlay = styled(motion.div)`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: linear-gradient(to top, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.7) 50%, rgba(0,0,0,0) 100%);
  padding: 4rem 2rem 2rem 2rem;
  z-index: 5;

  @media (max-width: ${props => props.theme.breakpoints.md}) {
    padding: 3rem 1.5rem 1.5rem 1.5rem;
  }
`;

const OverlayContent = styled.div`
  max-width: 1200px;
  margin: 0;
  color: white;

  @media (max-width: ${props => props.theme.breakpoints.md}) {
    margin: 0 auto;
    text-align: center;
  }
`;

const OverlayTitle = styled.h1`
  font-family: ${props => props.theme.fonts.heading};
  font-size: 3rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
  text-shadow: 2px 2px 4px rgba(0,0,0,0.5);

  @media (max-width: ${props => props.theme.breakpoints.md}) {
    font-size: 2rem;
  }
`;

const OverlayPrice = styled.div`
  font-size: 2rem;
  font-weight: 600;
  color: ${props => props.theme.colors.primary};
  margin-bottom: 0.5rem;
  text-shadow: 2px 2px 4px rgba(0,0,0,0.5);

  @media (max-width: ${props => props.theme.breakpoints.md}) {
    font-size: 1.5rem;
  }
`;

const OverlayLocation = styled.div`
  font-size: 1.2rem;
  color: rgba(255,255,255,0.9);
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  text-shadow: 1px 1px 2px rgba(0,0,0,0.5);

  svg {
    color: ${props => props.theme.colors.primary};
  }

  @media (max-width: ${props => props.theme.breakpoints.md}) {
    font-size: 1rem;
  }
`;

const OverlayDetails = styled.div`
  display: flex;
  gap: 2rem;
  flex-wrap: wrap;

  @media (max-width: ${props => props.theme.breakpoints.md}) {
    gap: 1rem;
  }
`;

const OverlayDetailItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: rgba(255,255,255,0.9);
  font-size: 1rem;
  text-shadow: 1px 1px 2px rgba(0,0,0,0.5);

  svg {
    color: rgba(255,255,255,0.7);
  }

  @media (max-width: ${props => props.theme.breakpoints.md}) {
    font-size: 0.9rem;
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
        style={{
          width: '100%',
          height: '100%',
          borderRadius: '8px',
          overflow: 'hidden',
          boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
          backgroundColor: '#1a1a1a'
        }}
      />
    </div>
  );
};

const ListingDetail = () => {
  const { slug } = useParams();
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxImageIndex, setLightboxImageIndex] = useState(0);
  const [videoRef, setVideoRef] = useState(null);
  const [isVideoPlaying, setIsVideoPlaying] = useState(true);
  const [showCopyNotification, setShowCopyNotification] = useState(false);

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

  const formatPropertyType = (type) => {
    const typeMap = {
      'house': 'Single Family Home', // Legacy value support
      'single-family': 'Single Family Home',
      'manufactured': 'Manufactured Home',
      'mobile': 'Mobile Home',
      'townhome': 'Town Home',
      'condo': 'Condo',
      'vacant-lot': 'Vacant Lot',
      'land': 'Land',
      'ranch': 'Ranch',
      'farm': 'Farm',
      'commercial': 'Commercial'
    };
    return typeMap[type] || type;
  };

  const getAllImages = () => {
    const images = [];

    // Add main image first
    if (listing?.main_image_url) {
      images.push({ url: listing.main_image_url, caption: 'Main Image' });
    }

    // Add additional images, but filter out any that match the main image URL
    if (listing?.listing_images) {
      const additionalImages = listing.listing_images
        .filter(img => img.image_url !== listing?.main_image_url)
        .map(img => ({
          url: img.image_url,
          caption: img.caption || ''
        }));
      images.push(...additionalImages);
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

  const toggleVideoPlayPause = () => {
    if (videoRef) {
      if (isVideoPlaying) {
        videoRef.pause();
      } else {
        videoRef.play();
      }
      setIsVideoPlaying(!isVideoPlaying);
    }
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

  const shareUrl = typeof window !== 'undefined' ? window.location.href : '';
  const shareTitle = listing ? `${listing.title} - ${formatPrice(listing.price)}` : '';
  const shareDescription = listing ? `Check out this ${formatPropertyType(listing.property_type)} in ${listing.city}, ${listing.state}` : '';

  const handleShare = (platform) => {
    const encodedUrl = encodeURIComponent(shareUrl);
    const encodedTitle = encodeURIComponent(shareTitle);
    const encodedDescription = encodeURIComponent(shareDescription);

    let shareLink = '';

    switch (platform) {
      case 'facebook':
        shareLink = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`;
        break;
      case 'twitter':
        shareLink = `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`;
        break;
      case 'linkedin':
        shareLink = `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`;
        break;
      case 'email':
        shareLink = `mailto:?subject=${encodedTitle}&body=${encodedDescription}%0A%0A${encodedUrl}`;
        break;
      case 'copy':
        navigator.clipboard.writeText(shareUrl).then(() => {
          setShowCopyNotification(true);
          setTimeout(() => setShowCopyNotification(false), 3000);
        });
        return;
      case 'print':
        window.print();
        return;
      default:
        return;
    }

    if (shareLink) {
      window.open(shareLink, '_blank', 'width=600,height=400');
    }
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

  // Get the main image URL for OG tags
  const ogImage = images.length > 0
    ? images[0].url
    : `${window.location.origin}/images/shared.jpeg`;

  // Format price for display
  const formattedPrice = listing.price
    ? `$${listing.price.toLocaleString()}`
    : 'Contact for Price';

  // Build description for meta tags
  const metaDescription = `${formattedPrice} - ${listing.bedrooms || 0} beds, ${listing.bathrooms || 0} baths, ${listing.square_feet || 'N/A'} sq ft. ${listing.address}, ${listing.city}, ${listing.state}. ${listing.description ? listing.description.substring(0, 150) + '...' : 'View this property listing at Outrider Real Estate.'}`;

  return (
    <PageContainer>
      <Helmet>
        <title>{listing.title || listing.address || 'Property Listing'} - Outrider Real Estate</title>
        <meta name="description" content={metaDescription} />

        {/* Open Graph Meta Tags */}
        <meta property="og:title" content={`${listing.title || listing.address || 'Property Listing'} - ${formattedPrice}`} />
        <meta property="og:description" content={metaDescription} />
        <meta property="og:image" content={ogImage} />
        <meta property="og:url" content={window.location.href} />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="Outrider Real Estate" />

        {/* Twitter Card Meta Tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={`${listing.title || listing.address || 'Property Listing'} - ${formattedPrice}`} />
        <meta name="twitter:description" content={metaDescription} />
        <meta name="twitter:image" content={ogImage} />
      </Helmet>

      {listing.drone_video_url && (
        <HeroVideoContainer
          initial="hidden"
          animate="visible"
          variants={fadeIn}
          transition={{ duration: 0.6 }}
        >
          <HeroVideo
            ref={(el) => setVideoRef(el)}
            src={listing.drone_video_url}
            autoPlay
            muted
            loop
            playsInline
            onPlay={() => setIsVideoPlaying(true)}
            onPause={() => setIsVideoPlaying(false)}
          />
          <VideoOverlay />
          <PropertyInfoOverlay
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <OverlayContent>
              <OverlayTitle>{listing.title}</OverlayTitle>
              <OverlayPrice>{formatPrice(listing.price)}</OverlayPrice>
              <OverlayLocation>
                <FaMapMarkerAlt />
                {listing.address && `${listing.address}, `}
                {listing.city}, {listing.state} {listing.zip_code}
              </OverlayLocation>
              <OverlayDetails>
                {listing.bedrooms && (
                  <OverlayDetailItem>
                    <FaBed />
                    <span>{listing.bedrooms}</span> Bedrooms
                  </OverlayDetailItem>
                )}
                {listing.bathrooms && (
                  <OverlayDetailItem>
                    <FaBath />
                    <span>{listing.bathrooms}</span> Baths
                  </OverlayDetailItem>
                )}
                {listing.square_feet && (
                  <OverlayDetailItem>
                    <FaRulerCombined />
                    <span>{Number(listing.square_feet).toLocaleString()}</span> Sq Ft
                  </OverlayDetailItem>
                )}
                {listing.property_type && (
                  <OverlayDetailItem>
                    <FaHome />
                    <span>{formatPropertyType(listing.property_type)}</span>
                  </OverlayDetailItem>
                )}
              </OverlayDetails>
            </OverlayContent>
          </PropertyInfoOverlay>
          <PlayPauseButton
            $isPlaying={isVideoPlaying}
            onClick={toggleVideoPlayPause}
            aria-label={isVideoPlaying ? 'Pause video' : 'Play video'}
          >
            {isVideoPlaying ? <FaPause /> : <FaPlay />}
          </PlayPauseButton>
        </HeroVideoContainer>
      )}

      {!listing.drone_video_url && (
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
                <span>{listing.bathrooms}</span> Baths
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
                <span>{formatPropertyType(listing.property_type)}</span>
              </DetailItem>
            )}
          </DetailsList>
        </HeaderContent>
      </ListingHeader>
      )}

      {images.length > 0 && (
        <GallerySection ref={galleryRef}>
          <GalleryContainer>
            {images.length > 0 && (
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
            )}

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

            {listing.listing_book_pdf_url && (
              <ContentCard
                initial="hidden"
                animate={contentInView ? "visible" : "hidden"}
                variants={fadeIn}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <CardTitle>
                  <FaBook /> Property Listing Book
                </CardTitle>

                {/* Desktop: Show PDF in iframe */}
                <PdfViewerContainer>
                  <iframe
                    src={`${listing.listing_book_pdf_url}#toolbar=0&navpanes=0&scrollbar=0`}
                    title="Property Listing Book"
                  />
                </PdfViewerContainer>

                {/* Mobile: Show download card */}
                <MobilePdfCard>
                  <FaMobileAlt />
                  <h3>View on Mobile</h3>
                  <p>For the best mobile experience, download the PDF to view the full property listing book.</p>
                </MobilePdfCard>

                {/* Download button (both mobile and desktop) */}
                <DownloadButton
                  onClick={() => window.open(listing.listing_book_pdf_url, '_blank')}
                >
                  <FaDownload /> Download Listing Book
                </DownloadButton>
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

            <ContentCard
              initial="hidden"
              animate={contentInView ? "visible" : "hidden"}
              variants={fadeIn}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <CardTitle><FaShare /> Share Listing</CardTitle>
              <ShareGrid>
                <ShareButton className="facebook" onClick={() => handleShare('facebook')}>
                  <FaFacebook /> Facebook
                </ShareButton>
                <ShareButton className="twitter" onClick={() => handleShare('twitter')}>
                  <FaTwitter /> Twitter
                </ShareButton>
                <ShareButton className="linkedin" onClick={() => handleShare('linkedin')}>
                  <FaLinkedin /> LinkedIn
                </ShareButton>
                <ShareButton className="email" onClick={() => handleShare('email')}>
                  <FaEnvelope /> Email
                </ShareButton>
                <ShareButton onClick={() => handleShare('copy')}>
                  <FaCopy /> Copy Link
                </ShareButton>
                <ShareButton onClick={() => handleShare('print')}>
                  <FaPrint /> Print
                </ShareButton>
              </ShareGrid>
            </ContentCard>

            <ContentCard
              initial="hidden"
              animate={contentInView ? "visible" : "hidden"}
              variants={fadeIn}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <CardTitle>Quick Stats</CardTitle>
              <StatGrid>
                {listing.bedrooms && (
                  <StatItem>
                    <div className="stat-value">{listing.bedrooms}</div>
                    <div className="stat-label">Bedrooms</div>
                  </StatItem>
                )}
                {listing.bathrooms && (
                  <StatItem>
                    <div className="stat-value">{listing.bathrooms}</div>
                    <div className="stat-label">Baths</div>
                  </StatItem>
                )}
                {listing.square_feet && (
                  <StatItem>
                    <div className="stat-value">{Number(listing.square_feet).toLocaleString()}</div>
                    <div className="stat-label">Sq Ft</div>
                  </StatItem>
                )}
                {listing.lot_size && (
                  <StatItem>
                    <div className="stat-value">{listing.lot_size}</div>
                    <div className="stat-label">Acres</div>
                  </StatItem>
                )}
                {listing.year_built && (
                  <StatItem>
                    <div className="stat-value">{listing.year_built}</div>
                    <div className="stat-label">Year Built</div>
                  </StatItem>
                )}
                {listing.property_type && (
                  <StatItem>
                    <div className="stat-value">{formatPropertyType(listing.property_type)}</div>
                    <div className="stat-label">Type</div>
                  </StatItem>
                )}
              </StatGrid>
            </ContentCard>
          </Sidebar>
        </ContentContainer>
      </ContentSection>


      {(listing.zillow_tour_url || listing.floor_plan_url ||
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
                transition={{ duration: 0.6, delay: 0.2 }}
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
                      <PhotoSphere imageUrl={sphere.image_url || sphere.drive_url || sphere.kuula_id} title={sphere.title} />
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

      <AnimatePresence>
        {showCopyNotification && (
          <CopyNotification
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 100 }}
          >
            <FaCheckCircle />
            Link copied to clipboard!
          </CopyNotification>
        )}
      </AnimatePresence>
    </PageContainer>
  );
};

export default ListingDetail;