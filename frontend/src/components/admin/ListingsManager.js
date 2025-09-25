import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FaPlus,
  FaEdit,
  FaTrash,
  FaQrcode,
  FaDownload,
  FaEye,
  FaHome,
  FaBed,
  FaBath,
  FaRulerCombined,
  FaMapMarkerAlt,
  FaChevronLeft,
  FaImage,
  FaCube,
  FaTimes,
  FaCopy,
  FaExternalLinkAlt
} from 'react-icons/fa';
import ListingForm from './ListingForm';
import api from '../../utils/api';

const Container = styled.div`
  max-width: 1400px;
  margin: 0 auto;
`;

const HeaderActions = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  flex-wrap: wrap;
  gap: 1rem;
`;

const SearchBar = styled.div`
  display: flex;
  align-items: center;
  background: rgba(20, 20, 20, 0.85);
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius.default};
  padding: 0.75rem 1rem;
  flex: 1;
  max-width: 400px;

  input {
    background: transparent;
    border: none;
    color: ${props => props.theme.colors.text.primary};
    width: 100%;
    font-size: 1rem;
    outline: none;

    &::placeholder {
      color: ${props => props.theme.colors.text.muted};
    }
  }
`;

const CreateButton = styled(motion.button)`
  background: linear-gradient(135deg, ${props => props.theme.colors.primary} 0%, #a0530f 100%);
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: ${props => props.theme.borderRadius.default};
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;

  &:hover {
    transform: translateY(-2px);
    box-shadow: ${props => props.theme.shadows.large};
  }
`;

const ListingsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 2rem;
  margin-bottom: 3rem;

  @media (max-width: ${props => props.theme.breakpoints.md}) {
    grid-template-columns: 1fr;
  }
`;

const ListingCard = styled(motion.div)`
  background: rgba(20, 20, 20, 0.85);
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius.default};
  overflow: hidden;
  position: relative;

  &:hover {
    border-color: ${props => props.theme.colors.secondary};
    box-shadow: ${props => props.theme.shadows.large};
  }
`;

const StatusBadge = styled.span`
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: ${props => {
    switch (props.status) {
      case 'active': return '#4CAF50';
      case 'pending': return '#FF9800';
      case 'sold': return '#F44336';
      case 'inactive': return '#9E9E9E';
      default: return '#9E9E9E';
    }
  }};
  color: white;
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: 600;
  text-transform: uppercase;
  z-index: 2;
`;

const ListingImage = styled.div`
  height: 200px;
  background: ${props => props.image ? `url(${props.image})` : 'linear-gradient(135deg, #333 0%, #1a1a1a 100%)'};
  background-size: cover;
  background-position: center;
  position: relative;

  ${props => !props.image && `
    display: flex;
    align-items: center;
    justify-content: center;

    svg {
      font-size: 3rem;
      color: #666;
    }
  `}
`;

const ListingInfo = styled.div`
  padding: 1.5rem;
`;

const ListingTitle = styled.h3`
  font-family: ${props => props.theme.fonts.heading};
  font-size: 1.3rem;
  color: ${props => props.theme.colors.text.secondary};
  margin-bottom: 0.5rem;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const ListingLocation = styled.p`
  color: ${props => props.theme.colors.text.muted};
  font-size: 0.95rem;
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;

  svg {
    font-size: 0.85rem;
    color: ${props => props.theme.colors.primary};
  }
`;

const ListingPrice = styled.div`
  font-size: 1.5rem;
  font-weight: bold;
  color: ${props => props.theme.colors.primary};
  margin-bottom: 1rem;
`;

const ListingDetails = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
  flex-wrap: wrap;
`;

const DetailItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.4rem;
  color: ${props => props.theme.colors.text.primary};
  font-size: 0.9rem;

  svg {
    color: ${props => props.theme.colors.text.muted};
    font-size: 0.85rem;
  }
`;

const ListingActions = styled.div`
  display: flex;
  gap: 0.5rem;
  padding-top: 1rem;
  border-top: 1px solid ${props => props.theme.colors.border};
`;

const ActionButton = styled(motion.button)`
  flex: 1;
  background: transparent;
  border: 1px solid ${props => props.theme.colors.border};
  color: ${props => props.theme.colors.text.primary};
  padding: 0.5rem;
  border-radius: ${props => props.theme.borderRadius.small};
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.3rem;
  font-size: 0.85rem;
  transition: all 0.3s ease;

  &:hover {
    background: ${props => props.theme.colors.primary}22;
    border-color: ${props => props.theme.colors.primary};
    color: ${props => props.theme.colors.primary};
  }

  &.danger:hover {
    background: #ff444422;
    border-color: #ff4444;
    color: #ff4444;
  }
`;

const QRModal = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.9);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 2rem;
`;

const QRModalContent = styled(motion.div)`
  background: ${props => props.theme.colors.background.dark};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius.large};
  padding: 2rem;
  max-width: 500px;
  width: 100%;
  text-align: center;
`;

const QRCode = styled.img`
  max-width: 300px;
  width: 100%;
  height: auto;
  margin: 2rem auto;
  background: white;
  padding: 1rem;
  border-radius: ${props => props.theme.borderRadius.default};
`;

const ListingURL = styled.div`
  background: rgba(20, 20, 20, 0.85);
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius.default};
  padding: 1rem;
  margin: 1rem 0;
  word-break: break-all;
  font-size: 0.9rem;
  color: ${props => props.theme.colors.text.muted};
`;

const ModalActions = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 1.5rem;
`;

const ModalButton = styled.button`
  flex: 1;
  padding: 0.75rem 1.5rem;
  border-radius: ${props => props.theme.borderRadius.default};
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;

  &.primary {
    background: ${props => props.theme.colors.primary};
    color: white;
    border: none;

    &:hover {
      background: #a0530f;
    }
  }

  &.secondary {
    background: transparent;
    color: ${props => props.theme.colors.text.primary};
    border: 1px solid ${props => props.theme.colors.border};

    &:hover {
      background: rgba(255, 255, 255, 0.05);
    }
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 4rem 2rem;

  svg {
    font-size: 4rem;
    color: ${props => props.theme.colors.text.muted};
    margin-bottom: 1rem;
  }

  h3 {
    font-size: 1.5rem;
    color: ${props => props.theme.colors.text.secondary};
    margin-bottom: 0.5rem;
  }

  p {
    color: ${props => props.theme.colors.text.muted};
    margin-bottom: 2rem;
  }
`;

const ListingsManager = () => {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingListing, setEditingListing] = useState(null);
  const [qrModalData, setQrModalData] = useState(null);

  useEffect(() => {
    fetchListings();
  }, []);

  const fetchListings = async () => {
    try {
      setLoading(true);
      const response = await api.get('/listings');
      setListings(response.data || []);
    } catch (error) {
      console.error('Error fetching listings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setEditingListing(null);
    setShowForm(true);
  };

  const handleEdit = (listing) => {
    setEditingListing(listing);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this listing? This action cannot be undone.')) {
      try {
        await api.delete(`/listings/${id}`);
        fetchListings();
      } catch (error) {
        console.error('Error deleting listing:', error);
        alert('Failed to delete listing');
      }
    }
  };

  const handleShowQR = async (listing) => {
    try {
      const response = await api.get(`/listings/${listing.id}/qr-code`);
      setQrModalData({
        ...listing,
        qr_code_url: response.data.qr_code_url,
        listing_url: response.data.listing_url
      });
    } catch (error) {
      console.error('Error fetching QR code:', error);
    }
  };

  const handleDownloadQR = () => {
    if (qrModalData?.qr_code_url) {
      const link = document.createElement('a');
      link.href = qrModalData.qr_code_url;
      link.download = `qr-${qrModalData.slug}.png`;
      link.click();
    }
  };

  const handleCopyURL = () => {
    if (qrModalData?.listing_url) {
      navigator.clipboard.writeText(qrModalData.listing_url);
      alert('URL copied to clipboard!');
    }
  };

  const handleViewListing = (slug) => {
    const baseUrl = window.location.origin;
    window.open(`${baseUrl}/listing/${slug}`, '_blank');
  };

  const handleFormSubmit = async (formData) => {
    try {
      if (editingListing) {
        await api.put(`/listings/${editingListing.id}`, formData);
      } else {
        await api.post('/listings', formData);
      }
      setShowForm(false);
      fetchListings();
    } catch (error) {
      console.error('Error saving listing:', error);
      alert('Failed to save listing');
    }
  };

  const filteredListings = listings.filter(listing =>
    listing.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    listing.location?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    listing.city?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatPrice = (price) => {
    if (!price) return 'Price TBD';
    return `$${Number(price).toLocaleString()}`;
  };

  if (showForm) {
    return (
      <ListingForm
        listing={editingListing}
        onSubmit={handleFormSubmit}
        onCancel={() => setShowForm(false)}
      />
    );
  }

  return (
    <Container>
      <HeaderActions>
        <SearchBar>
          <input
            type="text"
            placeholder="Search listings..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </SearchBar>
        <CreateButton
          onClick={handleCreate}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <FaPlus /> New Listing
        </CreateButton>
      </HeaderActions>

      {loading ? (
        <EmptyState>
          <p>Loading listings...</p>
        </EmptyState>
      ) : filteredListings.length === 0 ? (
        <EmptyState>
          <FaHome />
          <h3>No Listings Yet</h3>
          <p>Create your first listing to get started</p>
          <CreateButton
            onClick={handleCreate}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <FaPlus /> Create Listing
          </CreateButton>
        </EmptyState>
      ) : (
        <ListingsGrid>
          {filteredListings.map((listing) => (
            <ListingCard
              key={listing.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <StatusBadge status={listing.status}>{listing.status}</StatusBadge>
              <ListingImage image={listing.main_image_url}>
                {!listing.main_image_url && <FaHome />}
              </ListingImage>
              <ListingInfo>
                <ListingTitle>{listing.title}</ListingTitle>
                <ListingLocation>
                  <FaMapMarkerAlt />
                  {listing.city}, {listing.state}
                </ListingLocation>
                <ListingPrice>{formatPrice(listing.price)}</ListingPrice>
                <ListingDetails>
                  {listing.bedrooms && (
                    <DetailItem>
                      <FaBed />
                      {listing.bedrooms} beds
                    </DetailItem>
                  )}
                  {listing.bathrooms && (
                    <DetailItem>
                      <FaBath />
                      {listing.bathrooms} baths
                    </DetailItem>
                  )}
                  {listing.square_feet && (
                    <DetailItem>
                      <FaRulerCombined />
                      {Number(listing.square_feet).toLocaleString()} sqft
                    </DetailItem>
                  )}
                </ListingDetails>
                <ListingActions>
                  <ActionButton onClick={() => handleViewListing(listing.slug)}>
                    <FaEye /> View
                  </ActionButton>
                  <ActionButton onClick={() => handleEdit(listing)}>
                    <FaEdit /> Edit
                  </ActionButton>
                  <ActionButton onClick={() => handleShowQR(listing)}>
                    <FaQrcode /> QR
                  </ActionButton>
                  <ActionButton className="danger" onClick={() => handleDelete(listing.id)}>
                    <FaTrash />
                  </ActionButton>
                </ListingActions>
              </ListingInfo>
            </ListingCard>
          ))}
        </ListingsGrid>
      )}

      <AnimatePresence>
        {qrModalData && (
          <QRModal
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setQrModalData(null)}
          >
            <QRModalContent
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              onClick={(e) => e.stopPropagation()}
            >
              <h2>{qrModalData.title}</h2>
              <QRCode src={qrModalData.qr_code_url} alt="QR Code" />
              <ListingURL>{qrModalData.listing_url}</ListingURL>
              <ModalActions>
                <ModalButton className="secondary" onClick={handleCopyURL}>
                  <FaCopy /> Copy URL
                </ModalButton>
                <ModalButton className="primary" onClick={handleDownloadQR}>
                  <FaDownload /> Download QR
                </ModalButton>
              </ModalActions>
              <ModalButton
                className="secondary"
                onClick={() => setQrModalData(null)}
                style={{ marginTop: '1rem', width: '100%' }}
              >
                Close
              </ModalButton>
            </QRModalContent>
          </QRModal>
        )}
      </AnimatePresence>
    </Container>
  );
};

export default ListingsManager;