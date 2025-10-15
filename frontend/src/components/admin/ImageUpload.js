import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { arrayMove } from '@dnd-kit/sortable';
import {
  FaCloud,
  FaUpload,
  FaTimes,
  FaImage,
  FaCheckCircle,
  FaExclamationCircle,
  FaArrowLeft,
  FaArrowRight,
  FaStar
} from 'react-icons/fa';

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
  border: 1px solid ${props => {
    if (props.$isDeleted) return 'rgba(220, 53, 69, 0.5)';
    if (props.$isNew) return 'rgba(13, 110, 253, 0.5)';
    return props.theme.colors.border;
  }};
  border-radius: ${props => props.theme.borderRadius.default};
  overflow: hidden;
  opacity: ${props => props.$isDeleted ? 0.5 : 1};
  transition: all 0.2s ease;

  &:hover .overlay {
    opacity: 1;
  }
`;

const PreviewImage = styled.div`
  aspect-ratio: 16 / 9;
  background: ${props => props.$src ? `url(${props.$src})` : 'linear-gradient(135deg, #333 0%, #1a1a1a 100%)'};
  background-size: cover;
  background-position: center;
  position: relative;

  ${props => !props.$src && `
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
  background: ${props => props.$isDeleted ? 'rgba(220, 53, 69, 0.8)' : 'rgba(0, 0, 0, 0.7)'};
  opacity: ${props => props.$isDeleted ? 1 : 0};
  transition: opacity 0.3s ease;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
`;

const DeletedText = styled.div`
  color: white;
  font-weight: 600;
  font-size: 1rem;
  text-transform: uppercase;
  letter-spacing: 1px;
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-top: 0.5rem;
`;

const ActionButton = styled.button`
  background: rgba(255, 255, 255, 0.1);
  color: white;
  border: none;
  padding: 0.5rem;
  border-radius: 50%;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    background: rgba(255, 255, 255, 0.2);
    transform: scale(1.1);
  }

  &.danger:hover {
    background: rgba(255, 0, 0, 0.3);
  }

  &.primary:hover {
    background: ${props => props.theme.colors.primary};
  }

  &:disabled {
    opacity: 0.4;
    cursor: not-allowed;
    transform: none;
  }
`;

const OrderBadge = styled.div`
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
  background: ${props => props.$isMain ? 'rgba(255, 255, 255, 0.9)' : 'rgba(0, 0, 0, 0.7)'};
  color: ${props => props.$isMain ? '#000' : '#fff'};
  padding: 0.4rem 0.7rem;
  border-radius: 4px;
  font-size: 0.85rem;
  font-weight: 600;
  z-index: 2;
  display: flex;
  align-items: center;
  gap: 0.3rem;
  backdrop-filter: blur(4px);
  border: ${props => props.$isMain ? '1px solid rgba(0, 0, 0, 0.2)' : 'none'};

  svg {
    font-size: 0.75rem;
  }
`;

const StatusBadge = styled.div`
  position: absolute;
  bottom: 0.5rem;
  left: 0.5rem;
  background: ${props => props.$status === 'new' ? 'rgba(13, 110, 253, 0.9)' : 'rgba(220, 53, 69, 0.9)'};
  color: white;
  padding: 0.3rem 0.7rem;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  z-index: 2;
  letter-spacing: 0.5px;
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
  margin-bottom: 0.5rem;
`;

const ReorderButtons = styled.div`
  display: flex;
  gap: 0.3rem;
  margin-top: 0.5rem;
`;

const ReorderButton = styled.button`
  flex: 1;
  background: transparent;
  border: 1px solid ${props => props.theme.colors.border};
  color: ${props => props.theme.colors.text.primary};
  padding: 0.4rem;
  border-radius: ${props => props.theme.borderRadius.small};
  cursor: pointer;
  font-size: 0.8rem;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.3rem;

  &:hover:not(:disabled) {
    background: ${props => props.theme.colors.primary}22;
    border-color: ${props => props.theme.colors.primary};
  }

  &:disabled {
    opacity: 0.3;
    cursor: not-allowed;
  }
`;

const PendingChanges = styled.div`
  background: rgba(255, 193, 7, 0.1);
  border: 1px solid rgba(255, 193, 7, 0.3);
  border-radius: ${props => props.theme.borderRadius.default};
  padding: 1rem;
  margin-bottom: 1rem;
  color: #ffc107;
  font-size: 0.9rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;

  svg {
    font-size: 1.2rem;
  }

  strong {
    font-weight: 600;
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

// Simple image item component (no drag-and-drop)
const ImageItem = ({ image, index, totalImages, onRemove, onRestore, onCaptionChange, onSetMain, onMoveLeft, onMoveRight }) => {
  const isDeleted = image.status === 'deleted';
  const isNew = image.status === 'new';
  const displayOrder = index + 1;

  return (
    <PreviewCard
      $isDeleted={isDeleted}
      $isNew={isNew}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
    >
      <OrderBadge $isMain={image.is_main}>
        {image.is_main && <FaStar />}
        #{displayOrder}
      </OrderBadge>

      {(isNew || isDeleted) && (
        <StatusBadge $status={isNew ? 'new' : 'deleted'}>
          {isNew ? 'New' : 'Deleted'}
        </StatusBadge>
      )}

      <PreviewImage $src={image.url || image.preview}>
        {(!image.url && !image.preview) && <FaImage />}
        <PreviewOverlay className="overlay" $isDeleted={isDeleted}>
          {isDeleted ? (
            <>
              <DeletedText>Will be deleted</DeletedText>
              <ActionButtons>
                <ActionButton type="button" onClick={() => onRestore(index)} title="Restore image">
                  <FaCheckCircle />
                </ActionButton>
              </ActionButtons>
            </>
          ) : (
            <ActionButtons>
              <ActionButton
                type="button"
                onClick={() => onSetMain(index)}
                className="primary"
                title="Set as main image"
              >
                <FaStar />
              </ActionButton>
              <ActionButton
                type="button"
                onClick={() => onRemove(index)}
                className="danger"
                title="Remove image"
              >
                <FaTimes />
              </ActionButton>
            </ActionButtons>
          )}
        </PreviewOverlay>
      </PreviewImage>

      <PreviewInfo>
        <FileName>{image.originalName || image.filename}</FileName>
        <FileSize>{image.size ? formatFileSize(image.size) : ''}</FileSize>

        {!isDeleted && (
          <>
            <input
              type="text"
              value={image.caption || ''}
              onChange={(e) => onCaptionChange(index, e.target.value)}
              placeholder="Add caption (optional)"
              style={{
                width: '100%',
                background: 'rgba(0, 0, 0, 0.3)',
                border: '1px solid #333',
                borderRadius: '4px',
                padding: '0.5rem',
                color: '#fff',
                fontSize: '0.85rem',
                marginBottom: '0.5rem'
              }}
            />

            <ReorderButtons>
              <ReorderButton
                type="button"
                onClick={() => onMoveLeft(index)}
                disabled={index === 0}
                title="Move left"
              >
                <FaArrowLeft />
              </ReorderButton>
              <ReorderButton
                type="button"
                onClick={() => onMoveRight(index)}
                disabled={index === totalImages - 1}
                title="Move right"
              >
                <FaArrowRight />
              </ReorderButton>
            </ReorderButtons>
          </>
        )}
      </PreviewInfo>
    </PreviewCard>
  );
};

const ImageUpload = ({
  images = [],
  onImagesChange,
  onImageDelete = null, // Legacy - not used in batch mode
  category = 'general',
  maxFiles = 50,
  accept = { 'image/*': ['.jpeg', '.jpg', '.png', '.webp'] },
  listingId = null // Legacy - not used in batch mode
}) => {
  const [error, setError] = useState(null);

  // Stage files locally instead of uploading immediately
  const onDrop = useCallback((acceptedFiles) => {
    if (acceptedFiles.length === 0) return;

    setError(null);

    const stagedImages = acceptedFiles.map((file, index) => ({
      id: `new-${Date.now()}-${index}`,
      status: 'new',
      file: file,
      preview: URL.createObjectURL(file),
      url: null, // Will be set after upload on form submit
      filename: file.name,
      originalName: file.name,
      size: file.size,
      mimetype: file.type,
      caption: '',
      display_order: images.length + index,
      is_main: images.length === 0 && index === 0
    }));

    onImagesChange([...images, ...stagedImages]);
  }, [images, onImagesChange]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept,
    maxFiles: maxFiles - images.filter(img => img.status !== 'deleted').length,
    disabled: images.filter(img => img.status !== 'deleted').length >= maxFiles
  });

  const handleRemove = (index) => {
    const newImages = [...images];
    if (newImages[index].status === 'new') {
      // New image - just remove from array
      newImages.splice(index, 1);
      // Re-index remaining images
      newImages.forEach((img, i) => {
        img.display_order = i;
      });
    } else {
      // Existing image - mark for deletion
      newImages[index] = { ...newImages[index], status: 'deleted' };
    }
    onImagesChange(newImages);
  };

  const handleRestore = (index) => {
    const newImages = [...images];
    newImages[index] = { ...newImages[index], status: 'existing' };
    onImagesChange(newImages);
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

  const handleMoveLeft = (index) => {
    if (index === 0) return;
    const reordered = arrayMove(images, index, index - 1);
    const updated = reordered.map((img, i) => ({
      ...img,
      display_order: i
    }));
    onImagesChange(updated);
  };

  const handleMoveRight = (index) => {
    if (index === images.length - 1) return;
    const reordered = arrayMove(images, index, index + 1);
    const updated = reordered.map((img, i) => ({
      ...img,
      display_order: i
    }));
    onImagesChange(updated);
  };

  // Calculate pending changes
  const newImagesCount = images.filter(img => img.status === 'new').length;
  const deletedImagesCount = images.filter(img => img.status === 'deleted').length;
  const hasPendingChanges = newImagesCount > 0 || deletedImagesCount > 0;

  const activeImages = images.filter(img => img.status !== 'deleted');

  return (
    <div>
      {hasPendingChanges && (
        <PendingChanges>
          <FaExclamationCircle />
          <div>
            <strong>Pending Changes:</strong> {newImagesCount > 0 && `${newImagesCount} new image(s)`}
            {newImagesCount > 0 && deletedImagesCount > 0 && ', '}
            {deletedImagesCount > 0 && `${deletedImagesCount} to delete`}
            {' • Changes will be saved when you submit the form'}
          </div>
        </PendingChanges>
      )}

      {activeImages.length < maxFiles && (
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
            <UploadButton type="button">
              <FaUpload />
              Choose Files
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

      {images.length > 0 && (
        <PreviewGrid>
          {images.map((image, index) => (
            <ImageItem
              key={image.id}
              image={image}
              index={index}
              totalImages={images.length}
              onRemove={handleRemove}
              onRestore={handleRestore}
              onCaptionChange={handleCaptionChange}
              onSetMain={handleSetMain}
              onMoveLeft={handleMoveLeft}
              onMoveRight={handleMoveRight}
            />
          ))}
        </PreviewGrid>
      )}
    </div>
  );
};

export default ImageUpload;
