import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FaCloud,
  FaUpload,
  FaTimes,
  FaImage,
  FaSpinner,
  FaCheckCircle,
  FaExclamationCircle
} from 'react-icons/fa';
import api from '../../utils/api';

const DropzoneContainer = styled.div`
  border: 2px dashed ${props => props.isDragActive ? props.theme.colors.primary : props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius.default};
  padding: 2rem;
  text-align: center;
  background: ${props => props.isDragActive ? `${props.theme.colors.primary}11` : 'rgba(20, 20, 20, 0.3)'};
  transition: all 0.3s ease;
  cursor: pointer;
  margin-bottom: 1.5rem;

  &:hover {
    border-color: ${props => props.theme.colors.secondary};
    background: rgba(20, 20, 20, 0.5);
  }
`;

const DropzoneContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;

  svg {
    font-size: 3rem;
    color: ${props => props.theme.colors.text.muted};
  }

  h4 {
    color: ${props => props.theme.colors.text.secondary};
    font-size: 1.2rem;
    margin: 0;
  }

  p {
    color: ${props => props.theme.colors.text.muted};
    margin: 0;
    font-size: 0.95rem;
  }
`;

const FileInput = styled.input`
  display: none;
`;

const UploadButton = styled.button`
  background: linear-gradient(135deg, ${props => props.theme.colors.primary} 0%, #a0530f 100%);
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: ${props => props.theme.borderRadius.default};
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.95rem;
  font-weight: 600;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: ${props => props.theme.shadows.medium};
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }
`;

const PreviewGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 1rem;
  margin-top: 1.5rem;
`;

const PreviewCard = styled(motion.div)`
  position: relative;
  background: rgba(20, 20, 20, 0.85);
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius.default};
  overflow: hidden;

  &:hover .overlay {
    opacity: 1;
  }
`;

const PreviewImage = styled.div`
  aspect-ratio: 16 / 9;
  background: ${props => props.src ? `url(${props.src})` : 'linear-gradient(135deg, #333 0%, #1a1a1a 100%)'};
  background-size: cover;
  background-position: center;
  position: relative;

  ${props => !props.src && `
    display: flex;
    align-items: center;
    justify-content: center;

    svg {
      font-size: 2rem;
      color: #666;
    }
  `}
`;

const PreviewOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  opacity: 0;
  transition: opacity 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
`;

const ActionButton = styled.button`
  background: rgba(255, 255, 255, 0.1);
  color: white;
  border: none;
  padding: 0.5rem;
  border-radius: 50%;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.2);
    transform: scale(1.1);
  }

  &.danger:hover {
    background: rgba(255, 0, 0, 0.3);
  }
`;

const PreviewInfo = styled.div`
  padding: 1rem;
`;

const FileName = styled.div`
  color: ${props => props.theme.colors.text.primary};
  font-size: 0.9rem;
  font-weight: 500;
  margin-bottom: 0.5rem;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const FileSize = styled.div`
  color: ${props => props.theme.colors.text.muted};
  font-size: 0.8rem;
`;

const StatusIndicator = styled.div`
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
  padding: 0.3rem;
  border-radius: 50%;
  background: ${props => {
    switch (props.status) {
      case 'uploading': return 'rgba(255, 193, 7, 0.9)';
      case 'success': return 'rgba(40, 167, 69, 0.9)';
      case 'error': return 'rgba(220, 53, 69, 0.9)';
      default: return 'transparent';
    }
  }};
  color: white;

  svg {
    font-size: 0.9rem;
    ${props => props.status === 'uploading' && `
      animation: spin 1s linear infinite;
    `}
  }

  @keyframes spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }
`;

const ErrorMessage = styled(motion.div)`
  background: rgba(220, 53, 69, 0.1);
  border: 1px solid rgba(220, 53, 69, 0.3);
  color: #dc3545;
  padding: 1rem;
  border-radius: ${props => props.theme.borderRadius.default};
  margin-top: 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;

  svg {
    color: #dc3545;
  }
`;

const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

const ImageUpload = ({
  images = [],
  onImagesChange,
  onImageDelete = null, // Optional: callback when image is deleted (for batch tracking)
  category = 'general',
  maxFiles = 50,
  accept = { 'image/*': ['.jpeg', '.jpg', '.png', '.webp'] },
  listingId = null // Optional: if provided, will delete from database immediately
}) => {
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState({});
  const [error, setError] = useState(null);

  const onDrop = useCallback(async (acceptedFiles) => {
    if (acceptedFiles.length === 0) return;

    setError(null);
    setUploading(true);

    // Initialize upload progress for each file
    const progress = {};
    acceptedFiles.forEach((file, index) => {
      progress[index] = { status: 'uploading', file };
    });
    setUploadProgress(progress);

    try {
      const formData = new FormData();
      acceptedFiles.forEach((file) => {
        formData.append('images', file);
      });
      formData.append('category', category);

      const response = await api.postFormData('/upload/images', formData);

      if (response.data.success) {
        const newImages = response.data.data.map((uploadResult, index) => ({
          id: Date.now() + index, // Temporary ID
          url: uploadResult.publicUrl,
          path: uploadResult.path,
          filename: uploadResult.filename,
          originalName: uploadResult.originalName,
          size: uploadResult.size,
          mimetype: uploadResult.mimetype,
          caption: '',
          display_order: images.length + index,
          is_main: images.length === 0 && index === 0 // First image is main if no existing images
        }));

        onImagesChange([...images, ...newImages]);

        // Update progress to success
        const successProgress = {};
        acceptedFiles.forEach((_, index) => {
          successProgress[index] = { status: 'success' };
        });
        setUploadProgress(successProgress);

        // Clear progress after delay
        setTimeout(() => {
          setUploadProgress({});
        }, 2000);

      } else {
        throw new Error('Upload failed');
      }
    } catch (error) {
      console.error('Upload error:', error);
      setError(error.response?.data?.error || 'Failed to upload images');

      // Update progress to error
      const errorProgress = {};
      acceptedFiles.forEach((_, index) => {
        errorProgress[index] = { status: 'error' };
      });
      setUploadProgress(errorProgress);
    } finally {
      setUploading(false);
    }
  }, [images, onImagesChange, category]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept,
    maxFiles: maxFiles - images.length,
    disabled: uploading || images.length >= maxFiles
  });

  const handleRemove = async (index) => {
    const imageToRemove = images[index];

    // Remove from local state immediately (optimistic update)
    const newImages = images.filter((_, i) => i !== index);
    onImagesChange(newImages);

    try {
      // If callback provided, use it to track deletion for batch processing
      if (onImageDelete && imageToRemove.id) {
        onImageDelete(imageToRemove.id);
      }
      // Otherwise, delete immediately (for single image uploads or immediate deletion)
      else if (listingId && imageToRemove.id && !imageToRemove.id.toString().startsWith('existing-')) {
        console.log('Deleting image from database:', imageToRemove.id);
        await api.delete(`/listings/${listingId}/image/${imageToRemove.id}`);
      }
    } catch (error) {
      console.error('Error removing image:', error);
      // Already removed from UI, so no rollback needed
    }
  };

  const handleCaptionChange = (index, caption) => {
    const newImages = [...images];
    newImages[index] = { ...newImages[index], caption };
    onImagesChange(newImages);
  };

  const handleSetMain = (index) => {
    const newImages = images.map((img, i) => ({
      ...img,
      is_main: i === index
    }));
    onImagesChange(newImages);
  };

  return (
    <div>
      {images.length < maxFiles && (
        <DropzoneContainer {...getRootProps()} isDragActive={isDragActive}>
          <FileInput {...getInputProps()} />
          <DropzoneContent>
            <FaCloud />
            <h4>
              {isDragActive
                ? 'Drop images here...'
                : 'Drag & drop images here'
              }
            </h4>
            <p>
              or <strong>click to browse</strong>
            </p>
            <p>
              Supports JPEG, PNG, WebP • Max {formatFileSize(10 * 1024 * 1024)} each • Up to {maxFiles} images
            </p>
            <UploadButton type="button" disabled={uploading}>
              {uploading ? <FaSpinner className="spin" /> : <FaUpload />}
              {uploading ? 'Uploading...' : 'Choose Files'}
            </UploadButton>
          </DropzoneContent>
        </DropzoneContainer>
      )}

      <AnimatePresence>
        {error && (
          <ErrorMessage
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            <FaExclamationCircle />
            {error}
          </ErrorMessage>
        )}
      </AnimatePresence>

      {(images.length > 0 || Object.keys(uploadProgress).length > 0) && (
        <PreviewGrid>
          {/* Existing images */}
          {images.map((image, index) => (
            <PreviewCard
              key={image.id || index}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
            >
              <PreviewImage src={image.url}>
                {image.is_main && (
                  <StatusIndicator status="main">
                    <FaCheckCircle />
                  </StatusIndicator>
                )}
                <PreviewOverlay className="overlay">
                  <ActionButton
                    type="button"
                    onClick={() => handleSetMain(index)}
                    title="Set as main image"
                  >
                    <FaCheckCircle />
                  </ActionButton>
                  <ActionButton
                    type="button"
                    className="danger"
                    onClick={() => handleRemove(index)}
                    title="Remove image"
                  >
                    <FaTimes />
                  </ActionButton>
                </PreviewOverlay>
              </PreviewImage>
              <PreviewInfo>
                <FileName>{image.originalName || image.filename}</FileName>
                <FileSize>{image.size ? formatFileSize(image.size) : ''}</FileSize>
                <input
                  type="text"
                  value={image.caption || ''}
                  onChange={(e) => handleCaptionChange(index, e.target.value)}
                  placeholder="Add caption (optional)"
                  style={{
                    width: '100%',
                    background: 'rgba(0, 0, 0, 0.3)',
                    border: '1px solid #333',
                    borderRadius: '4px',
                    padding: '0.5rem',
                    color: '#fff',
                    fontSize: '0.85rem',
                    marginTop: '0.5rem'
                  }}
                />
              </PreviewInfo>
            </PreviewCard>
          ))}

          {/* Upload progress indicators */}
          {Object.entries(uploadProgress).map(([index, progress]) => (
            <PreviewCard
              key={`progress-${index}`}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
            >
              <PreviewImage>
                <FaImage />
                <StatusIndicator status={progress.status}>
                  {progress.status === 'uploading' && <FaSpinner />}
                  {progress.status === 'success' && <FaCheckCircle />}
                  {progress.status === 'error' && <FaExclamationCircle />}
                </StatusIndicator>
              </PreviewImage>
              <PreviewInfo>
                <FileName>{progress.file?.name}</FileName>
                <FileSize>
                  {progress.file?.size ? formatFileSize(progress.file.size) : ''}
                </FileSize>
              </PreviewInfo>
            </PreviewCard>
          ))}
        </PreviewGrid>
      )}
    </div>
  );
};

export default ImageUpload;