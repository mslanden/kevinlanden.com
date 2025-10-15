import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import {
  FaChevronLeft,
  FaImage,
  FaCube,
  FaPlus,
  FaTrash,
  FaTimes,
  FaSave,
  FaHome,
  FaMapMarkerAlt,
  FaDollarSign,
  FaUpload,
  FaVideo
} from 'react-icons/fa';
import ImageUpload from './ImageUpload';
import VideoUpload from './VideoUpload';
import PdfUpload from './PdfUpload';
import api from '../../utils/api';

const FormContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
`;

const FormHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 2rem;
  padding-bottom: 1rem;
  border-bottom: 2px solid ${props => props.theme.colors.border};

  h2 {
    font-family: ${props => props.theme.fonts.heading};
    font-size: 2rem;
    color: ${props => props.theme.colors.text.secondary};
  }
`;

const BackButton = styled.button`
  background: transparent;
  border: 1px solid ${props => props.theme.colors.border};
  color: ${props => props.theme.colors.text.primary};
  padding: 0.5rem 1rem;
  border-radius: ${props => props.theme.borderRadius.default};
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.3s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.05);
    border-color: ${props => props.theme.colors.primary};
  }
`;

const FormGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;

  @media (max-width: ${props => props.theme.breakpoints.md}) {
    grid-template-columns: 1fr;
  }
`;

const FormSection = styled.div`
  background: rgba(20, 20, 20, 0.85);
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius.default};
  padding: 1.5rem;

  &.full-width {
    grid-column: 1 / -1;
  }
`;

const SectionTitle = styled.h3`
  font-family: ${props => props.theme.fonts.heading};
  font-size: 1.3rem;
  color: ${props => props.theme.colors.text.secondary};
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;

  svg {
    color: ${props => props.theme.colors.primary};
  }
`;

const FormGroup = styled.div`
  margin-bottom: 1.5rem;

  &:last-child {
    margin-bottom: 0;
  }
`;

const FormRow = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
`;

const Label = styled.label`
  display: block;
  color: ${props => props.theme.colors.text.primary};
  font-size: 0.95rem;
  margin-bottom: 0.5rem;
  font-weight: 500;

  span {
    color: ${props => props.theme.colors.primary};
  }
`;

const Input = styled.input`
  width: 100%;
  padding: 0.75rem;
  background: rgba(0, 0, 0, 0.3);
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius.small};
  color: ${props => props.theme.colors.text.primary};
  font-size: 1rem;
  transition: all 0.3s ease;

  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
    background: rgba(139, 69, 19, 0.05);
  }

  &::placeholder {
    color: ${props => props.theme.colors.text.muted};
  }
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: 0.75rem;
  background: rgba(0, 0, 0, 0.3);
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius.small};
  color: ${props => props.theme.colors.text.primary};
  font-size: 1rem;
  resize: vertical;
  min-height: 120px;
  transition: all 0.3s ease;

  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
    background: rgba(139, 69, 19, 0.05);
  }

  &::placeholder {
    color: ${props => props.theme.colors.text.muted};
  }
`;

const Select = styled.select`
  width: 100%;
  padding: 0.75rem;
  background: rgba(0, 0, 0, 0.3);
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius.small};
  color: ${props => props.theme.colors.text.primary};
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;

  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
  }

  option {
    background: ${props => props.theme.colors.background.dark};
  }
`;


const KuulaSphereItem = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
  align-items: flex-start;
`;

const AddButton = styled.button`
  background: transparent;
  border: 1px solid ${props => props.theme.colors.primary};
  color: ${props => props.theme.colors.primary};
  padding: 0.5rem 1rem;
  border-radius: ${props => props.theme.borderRadius.small};
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.3s ease;

  &:hover {
    background: ${props => props.theme.colors.primary}22;
  }
`;

const RemoveButton = styled.button`
  background: transparent;
  border: 1px solid #ff4444;
  color: #ff4444;
  padding: 0.5rem;
  border-radius: ${props => props.theme.borderRadius.small};
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: #ff444422;
  }
`;

const FormActions = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  margin-top: 2rem;
`;

const ActionButton = styled(motion.button)`
  padding: 0.75rem 2rem;
  border-radius: ${props => props.theme.borderRadius.default};
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.3s ease;

  &.primary {
    background: linear-gradient(135deg, ${props => props.theme.colors.primary} 0%, #a0530f 100%);
    color: white;
    border: none;

    &:hover {
      transform: translateY(-2px);
      box-shadow: ${props => props.theme.shadows.large};
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

const FeatureTag = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  background: ${props => props.theme.colors.primary}22;
  border: 1px solid ${props => props.theme.colors.primary};
  color: ${props => props.theme.colors.primary};
  padding: 0.4rem 0.8rem;
  border-radius: 20px;
  font-size: 0.9rem;
  margin: 0.25rem;

  button {
    background: transparent;
    border: none;
    color: inherit;
    cursor: pointer;
    padding: 0;
    margin-left: 0.3rem;
  }
`;

const FeatureInput = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-top: 1rem;

  input {
    flex: 1;
  }
`;

const ListingForm = ({ listing, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    location: '',
    address: '',
    city: '',
    state: 'CA',
    zip_code: '',
    price: '',
    bedrooms: '',
    bathrooms: '',
    square_feet: '',
    lot_size: '',
    year_built: '',
    property_type: 'house',
    main_image_url: '',
    zillow_tour_url: '',
    floor_plan_url: '',
    drone_video_url: '',
    listing_book_pdf_url: '',
    status: 'active',
    featured: false,
    images: [],
    kuula_spheres: [],
    features: []
  });

  const [newFeature, setNewFeature] = useState('');

  useEffect(() => {
    if (listing) {
      // Convert backend image format to frontend format with status='existing'
      const mappedImages = (listing.listing_images || []).map((img, index) => ({
        id: img.id || `existing-${index}`,
        status: 'existing', // Mark as existing from database
        url: img.image_url,
        preview: img.image_url, // Use URL as preview
        path: img.path || img.image_url,
        filename: img.filename || `image-${index}`,
        originalName: img.originalName || img.filename || `Image ${index + 1}`,
        size: img.size,
        mimetype: img.mimetype,
        caption: img.caption || '',
        display_order: img.display_order || index,
        is_main: img.is_main || false,
        file: null // No file object for existing images
      }));

      setFormData({
        ...listing,
        images: mappedImages,
        kuula_spheres: (listing.listing_kuula_spheres || []).map(sphere => ({
          ...sphere,
          image_url: sphere.image_url || sphere.drive_url || sphere.kuula_id // Handle migration
        })),
        features: listing.listing_features || []
      });
    }
  }, [listing]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };


  const handleKuulaAdd = () => {
    setFormData(prev => ({
      ...prev,
      kuula_spheres: [...prev.kuula_spheres, { image_url: '', title: '', description: '' }]
    }));
  };

  const handleKuulaChange = (index, field, value) => {
    setFormData(prev => ({
      ...prev,
      kuula_spheres: prev.kuula_spheres.map((sphere, i) =>
        i === index ? { ...sphere, [field]: value } : sphere
      )
    }));
  };

  const handleKuulaRemove = (index) => {
    setFormData(prev => ({
      ...prev,
      kuula_spheres: prev.kuula_spheres.filter((_, i) => i !== index)
    }));
  };

  const handleFeatureAdd = () => {
    if (newFeature.trim()) {
      setFormData(prev => ({
        ...prev,
        features: [...prev.features, { feature: newFeature.trim(), category: 'general' }]
      }));
      setNewFeature('');
    }
  };

  const handleFeatureRemove = (index) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      console.log('Starting listing submission with batch processing...');

      // Step 1: Upload new images to storage
      const newImages = formData.images.filter(img => img.status === 'new');
      let uploadedImageData = [];

      if (newImages.length > 0) {
        console.log(`Uploading ${newImages.length} new images...`);
        const formDataUpload = new FormData();
        newImages.forEach(img => {
          formDataUpload.append('images', img.file);
        });
        formDataUpload.append('category', 'properties');

        const uploadResponse = await api.postFormData('/upload/images', formDataUpload);
        if (uploadResponse.data.success) {
          uploadedImageData = uploadResponse.data.data;
          console.log(`Successfully uploaded ${uploadedImageData.length} images`);
        }
      }

      // Step 2: Build final images array
      const existingImages = formData.images
        .filter(img => img.status === 'existing')
        .map((img, index) => ({
          url: img.url,
          caption: img.caption || '',
          display_order: img.display_order,
          is_main: img.is_main || false
        }));

      const newlyUploadedImages = uploadedImageData.map((upload, index) => {
        const originalNewImage = newImages[index];
        return {
          url: upload.publicUrl,
          caption: originalNewImage.caption || '',
          display_order: originalNewImage.display_order,
          is_main: originalNewImage.is_main || false
        };
      });

      // Combine and sort by display_order
      const finalImages = [...existingImages, ...newlyUploadedImages]
        .sort((a, b) => a.display_order - b.display_order);

      console.log(`Final images array: ${existingImages.length} existing + ${newlyUploadedImages.length} new = ${finalImages.length} total`);

      // Step 3: Prepare spheres data
      const convertedSpheres = formData.kuula_spheres.map((sphere) => ({
        ...sphere,
        image_url: sphere.image_url
      }));

      // Step 4: Submit listing with complete data
      const submitData = {
        ...formData,
        images: finalImages,
        kuula_spheres: convertedSpheres
      };

      console.log('Submitting listing with', finalImages.length, 'images');
      await onSubmit(submitData);

      // Step 5: Delete marked images from storage (edit mode only)
      if (listing) {
        const deletedImages = formData.images.filter(img => img.status === 'deleted');
        if (deletedImages.length > 0) {
          console.log(`Batch deleting ${deletedImages.length} marked images...`);
          const imageIds = deletedImages
            .filter(img => img.id && !String(img.id).startsWith('new-'))
            .map(img => img.id);

          if (imageIds.length > 0) {
            await api.delete(`/listings/${listing.id}/images/batch`, {
              imageIds: imageIds
            });
            console.log('Successfully batch deleted images');
          }
        }
      }

      console.log('Listing submission complete!');
    } catch (error) {
      console.error('Error submitting form:', error);
      alert(`Failed to save listing: ${error.message || 'Please try again.'}`);
    }
  };


  return (
    <FormContainer>
      <FormHeader>
        <BackButton onClick={onCancel}>
          <FaChevronLeft /> Back to Listings
        </BackButton>
        <h2>{listing ? 'Edit Listing' : 'Create New Listing'}</h2>
      </FormHeader>

      <form onSubmit={handleSubmit}>
        <FormGrid>
          <FormSection>
            <SectionTitle>
              <FaHome /> Basic Information
            </SectionTitle>
            <FormGroup>
              <Label htmlFor="listing-title">Title <span>*</span></Label>
              <Input
                id="listing-title"
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Beautiful Ranch Home in Anza"
                required
              />
            </FormGroup>
            <FormGroup>
              <Label htmlFor="listing-description">Description</Label>
              <TextArea
                id="listing-description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Describe the property..."
              />
            </FormGroup>
            <FormRow>
              <FormGroup>
                <Label htmlFor="property-type">Property Type</Label>
                <Select id="property-type" name="property_type" value={formData.property_type} onChange={handleChange}>
                  <option value="single-family">Single Family Home</option>
                  <option value="manufactured">Manufactured Home</option>
                  <option value="mobile">Mobile Home</option>
                  <option value="townhome">Town Home</option>
                  <option value="condo">Condo</option>
                  <option value="vacant-lot">Vacant Lot</option>
                  <option value="land">Land</option>
                  <option value="ranch">Ranch</option>
                  <option value="farm">Farm</option>
                  <option value="commercial">Commercial</option>
                </Select>
              </FormGroup>
              <FormGroup>
                <Label>Status</Label>
                <Select name="status" value={formData.status} onChange={handleChange}>
                  <option value="active">Active</option>
                  <option value="pending">Pending</option>
                  <option value="sold">Sold</option>
                  <option value="inactive">Inactive</option>
                </Select>
              </FormGroup>
            </FormRow>
          </FormSection>

          <FormSection>
            <SectionTitle>
              <FaMapMarkerAlt /> Location
            </SectionTitle>
            <FormGroup>
              <Label>Address</Label>
              <Input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="123 Main St"
              />
            </FormGroup>
            <FormRow>
              <FormGroup>
                <Label>City <span>*</span></Label>
                <Input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  placeholder="Anza"
                  required
                />
              </FormGroup>
              <FormGroup>
                <Label>State</Label>
                <Input
                  type="text"
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                  placeholder="CA"
                />
              </FormGroup>
              <FormGroup>
                <Label>ZIP Code</Label>
                <Input
                  type="text"
                  name="zip_code"
                  value={formData.zip_code}
                  onChange={handleChange}
                  placeholder="92539"
                />
              </FormGroup>
            </FormRow>
            <FormGroup>
              <Label>Location Description <span>*</span></Label>
              <Input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="Anza Valley"
                required
              />
            </FormGroup>
          </FormSection>

          <FormSection>
            <SectionTitle>
              <FaDollarSign /> Property Details
            </SectionTitle>
            <FormGroup>
              <Label htmlFor="listing-price">Price</Label>
              <Input
                id="listing-price"
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                placeholder="450000"
                step="1000"
              />
            </FormGroup>
            <FormRow>
              <FormGroup>
                <Label>Bedrooms</Label>
                <Input
                  type="number"
                  name="bedrooms"
                  value={formData.bedrooms}
                  onChange={handleChange}
                  placeholder="3"
                />
              </FormGroup>
              <FormGroup>
                <Label>Bathrooms</Label>
                <Input
                  type="number"
                  name="bathrooms"
                  value={formData.bathrooms}
                  onChange={handleChange}
                  placeholder="2.5"
                  step="0.5"
                />
              </FormGroup>
            </FormRow>
            <FormRow>
              <FormGroup>
                <Label>Square Feet</Label>
                <Input
                  type="number"
                  name="square_feet"
                  value={formData.square_feet}
                  onChange={handleChange}
                  placeholder="2500"
                />
              </FormGroup>
              <FormGroup>
                <Label>Lot Size (acres)</Label>
                <Input
                  type="number"
                  name="lot_size"
                  value={formData.lot_size}
                  onChange={handleChange}
                  placeholder="5.5"
                  step="0.1"
                />
              </FormGroup>
            </FormRow>
            <FormGroup>
              <Label>Year Built</Label>
              <Input
                type="number"
                name="year_built"
                value={formData.year_built}
                onChange={handleChange}
                placeholder="2005"
                min="1800"
                max={new Date().getFullYear()}
              />
            </FormGroup>
          </FormSection>

          <FormSection>
            <SectionTitle>Features</SectionTitle>
            <div style={{ display: 'flex', flexWrap: 'wrap', marginBottom: '1rem' }}>
              {formData.features.map((feature, index) => (
                <FeatureTag key={index}>
                  {feature.feature}
                  <button type="button" onClick={() => handleFeatureRemove(index)}>
                    <FaTimes />
                  </button>
                </FeatureTag>
              ))}
            </div>
            <FeatureInput>
              <Input
                type="text"
                value={newFeature}
                onChange={(e) => setNewFeature(e.target.value)}
                placeholder="Add a feature (e.g., Pool, Solar Panels)"
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleFeatureAdd();
                  }
                }}
              />
              <AddButton type="button" onClick={handleFeatureAdd}>
                <FaPlus /> Add
              </AddButton>
            </FeatureInput>
          </FormSection>

          <FormSection className="full-width">
            <SectionTitle>
              <FaUpload /> Property Images
            </SectionTitle>
            <ImageUpload
              images={formData.images}
              onImagesChange={(newImages) => {
                setFormData(prev => ({
                  ...prev,
                  images: newImages,
                  // Set main_image_url from the main image (filter out deleted images)
                  main_image_url: newImages.filter(img => img.status !== 'deleted').find(img => img.is_main)?.url || newImages.filter(img => img.status !== 'deleted')[0]?.url || ''
                }));
              }}
              category="properties"
              maxFiles={50}
            />
          </FormSection>

          <FormSection className="full-width">
            <SectionTitle>
              <FaImage /> Floor Plan & 3D Tours
            </SectionTitle>
            <FormRow>
              <FormGroup>
                <Label>Floor Plan</Label>
                <ImageUpload
                  images={formData.floor_plan_url ? [{
                    id: 'floor-plan',
                    url: formData.floor_plan_url,
                    originalName: 'Floor Plan',
                    is_main: true
                  }] : []}
                  onImagesChange={(newImages) => {
                    setFormData(prev => ({
                      ...prev,
                      floor_plan_url: newImages[0]?.url || ''
                    }));
                  }}
                  category="floor-plans"
                  maxFiles={1}
                />
              </FormGroup>
            </FormRow>
            <FormGroup>
              <Label>Zillow 3D Tour URL</Label>
              <Input
                type="url"
                name="zillow_tour_url"
                value={formData.zillow_tour_url}
                onChange={handleChange}
                placeholder="https://www.zillow.com/view-imx/..."
              />
            </FormGroup>
            <FormGroup className="full-width">
              <Label><FaVideo /> Drone Video (Hero Background)</Label>
              <VideoUpload
                video={formData.drone_video_url ? {
                  url: formData.drone_video_url,
                  originalName: 'Drone Video'
                } : null}
                onVideoChange={(videoData) => {
                  setFormData(prev => ({
                    ...prev,
                    drone_video_url: videoData ? videoData.url : ''
                  }));
                }}
              />
            </FormGroup>
            <FormGroup className="full-width">
              <Label>Listing Book PDF</Label>
              <PdfUpload
                pdf={formData.listing_book_pdf_url ? {
                  url: formData.listing_book_pdf_url,
                  originalName: 'Property Listing Book.pdf'
                } : null}
                onPdfChange={(pdfData) => {
                  setFormData(prev => ({
                    ...prev,
                    listing_book_pdf_url: pdfData ? pdfData.url : ''
                  }));
                }}
              />
            </FormGroup>
          </FormSection>

          <FormSection className="full-width">
            <SectionTitle>
              <FaCube /> 360° Photo Spheres (Google Drive)
            </SectionTitle>
            {formData.kuula_spheres.map((sphere, index) => (
              <KuulaSphereItem key={index}>
                <div style={{ flex: 1 }}>
                  <FormGroup>
                    <Label>Title</Label>
                    <Input
                      type="text"
                      value={sphere.title}
                      onChange={(e) => handleKuulaChange(index, 'title', e.target.value)}
                      placeholder="Living Room"
                    />
                  </FormGroup>
                  <FormGroup>
                    <Label>360° Photo</Label>
                    <ImageUpload
                      images={sphere.image_url ? [{
                        id: `sphere-${index}`,
                        url: sphere.image_url,
                        originalName: sphere.title || '360° Photo',
                        is_main: true
                      }] : []}
                      onImagesChange={(newImages) => {
                        handleKuulaChange(index, 'image_url', newImages[0]?.url || '');
                      }}
                      category="spheres"
                      maxFiles={1}
                    />
                  </FormGroup>
                </div>
                <RemoveButton type="button" onClick={() => handleKuulaRemove(index)}>
                  <FaTrash />
                </RemoveButton>
              </KuulaSphereItem>
            ))}
            <AddButton type="button" onClick={handleKuulaAdd}>
              <FaPlus /> Add 360° Sphere
            </AddButton>
          </FormSection>
        </FormGrid>

        <FormActions>
          <ActionButton
            type="button"
            className="secondary"
            onClick={onCancel}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <FaTimes /> Cancel
          </ActionButton>
          <ActionButton
            type="submit"
            className="primary"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <FaSave /> {listing ? 'Update' : 'Create'} Listing
          </ActionButton>
        </FormActions>
      </form>
    </FormContainer>
  );
};

export default ListingForm;