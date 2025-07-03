import React, { useState } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { FaUpload, FaImage, FaCheckCircle, FaSpinner, FaExclamationTriangle, FaTrash, FaFilePdf } from 'react-icons/fa';
import AdminCard from './AdminCard';

const UploadContainer = styled.div`
  display: grid;
  gap: 2rem;
`;

const UploadZone = styled.div`
  border: 2px dashed ${props => props.isDragOver ? props.theme.colors.primary : props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius.default};
  padding: 3rem;
  text-align: center;
  background-color: ${props => props.isDragOver ? 'rgba(139, 69, 19, 0.1)' : 'rgba(255, 255, 255, 0.02)'};
  transition: all 0.3s ease;
  cursor: pointer;
  
  &:hover {
    border-color: ${props => props.theme.colors.primary};
    background-color: rgba(139, 69, 19, 0.05);
  }
`;

const UploadIcon = styled.div`
  font-size: 3rem;
  color: ${props => props.theme.colors.primary};
  margin-bottom: 1rem;
`;

const UploadText = styled.div`
  h3 {
    color: ${props => props.theme.colors.text.secondary};
    margin-bottom: 0.5rem;
  }
  
  p {
    color: ${props => props.theme.colors.text.muted};
    font-size: 0.9rem;
  }
`;

const HiddenInput = styled.input`
  display: none;
`;

const ImagePreview = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1rem;
  margin-top: 2rem;
`;

const PreviewCard = styled.div`
  background-color: rgba(255, 255, 255, 0.03);
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius.small};
  padding: 1rem;
  position: relative;
`;

const PreviewImage = styled.img`
  width: 100%;
  height: 200px;
  object-fit: contain;
  border-radius: ${props => props.theme.borderRadius.small};
  margin-bottom: 1rem;
`;

const PdfPreview = styled.div`
  width: 100%;
  height: 200px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: rgba(255, 255, 255, 0.05);
  border-radius: ${props => props.theme.borderRadius.small};
  margin-bottom: 1rem;
  border: 2px dashed ${props => props.theme.colors.border};
  
  svg {
    font-size: 3rem;
    color: #dc3545;
    margin-bottom: 0.5rem;
  }
  
  span {
    color: ${props => props.theme.colors.text.muted};
    font-size: 0.9rem;
  }
`;

const PreviewInfo = styled.div`
  h4 {
    color: ${props => props.theme.colors.text.secondary};
    font-size: 0.9rem;
    margin-bottom: 0.5rem;
  }
  
  p {
    color: ${props => props.theme.colors.text.muted};
    font-size: 0.8rem;
    margin-bottom: 0.25rem;
  }
`;

const StatusIndicator = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-top: 0.5rem;
  
  svg {
    font-size: 1rem;
  }
  
  &.uploading {
    color: ${props => props.theme.colors.primary};
  }
  
  &.success {
    color: #4CAF50;
  }
  
  &.error {
    color: #ff6b6b;
  }
`;

const RemoveButton = styled.button`
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
  background-color: #ff6b6b;
  color: white;
  border: none;
  border-radius: 50%;
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    background-color: #ff5252;
    transform: scale(1.1);
  }
`;

const ProcessButton = styled.button`
  background-color: ${props => props.theme.colors.primary};
  color: white;
  border: none;
  padding: 1rem 2rem;
  border-radius: ${props => props.theme.borderRadius.small};
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 600;
  transition: all 0.3s ease;
  font-size: 1rem;
  margin-top: 2rem;
  
  &:hover:not(:disabled) {
    background-color: ${props => props.theme.colors.tertiary};
    transform: translateY(-2px);
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const ResultsSection = styled.div`
  margin-top: 2rem;
`;

const DataTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-top: 1rem;
  
  th, td {
    text-align: left;
    padding: 0.75rem;
    border-bottom: 1px solid ${props => props.theme.colors.border};
  }
  
  th {
    background-color: rgba(139, 69, 19, 0.1);
    color: ${props => props.theme.colors.text.secondary};
    font-weight: 600;
  }
  
  td {
    color: ${props => props.theme.colors.text.primary};
  }
`;

const SaveButton = styled.button`
  background-color: #4CAF50;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: ${props => props.theme.borderRadius.small};
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 600;
  transition: all 0.3s ease;
  margin-top: 1rem;
  
  &:hover:not(:disabled) {
    background-color: #45a049;
    transform: translateY(-2px);
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const SpinningIcon = styled.svg`
  animation: spin 1s linear infinite;
  
  @keyframes spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }
`;

const ImageDataUploader = ({ onDataExtracted }) => {
  const [images, setImages] = useState([]);
  const [isDragOver, setIsDragOver] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [extractedData, setExtractedData] = useState(null);
  const [error, setError] = useState(null);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    const files = Array.from(e.dataTransfer.files);
    handleFiles(files);
  };

  const handleFileInput = (e) => {
    const files = Array.from(e.target.files);
    handleFiles(files);
  };

  const handleFiles = (files) => {
    const validFiles = files.filter(file => 
      file.type.startsWith('image/') || file.type === 'application/pdf'
    );
    
    validFiles.forEach(file => {
      if (file.type === 'application/pdf') {
        // For PDFs, we don't need a preview
        const newImage = {
          id: Date.now() + Math.random(),
          file,
          preview: null,
          name: file.name,
          size: file.size,
          status: 'pending'
        };
        setImages(prev => [...prev, newImage]);
      } else {
        // For images, create a preview
        const reader = new FileReader();
        reader.onload = (e) => {
          const newImage = {
            id: Date.now() + Math.random(),
            file,
            preview: e.target.result,
            name: file.name,
            size: file.size,
            status: 'pending'
          };
          setImages(prev => [...prev, newImage]);
        };
        reader.readAsDataURL(file);
      }
    });
  };

  const removeImage = (imageId) => {
    setImages(prev => prev.filter(img => img.id !== imageId));
  };

  const processImages = async () => {
    if (images.length === 0) return;
    
    setIsProcessing(true);
    setError(null);
    
    try {
      const formData = new FormData();
      images.forEach((image, index) => {
        formData.append(`images`, image.file);
      });
      
      const response = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:3001/api'}/market-data/extract-from-images`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
        },
        body: formData
      });
      
      if (!response.ok) {
        throw new Error('Failed to process images');
      }
      
      const data = await response.json();
      setExtractedData(data.data);
      
      // Update image statuses
      setImages(prev => prev.map(img => ({ ...img, status: 'success' })));
      
    } catch (err) {
      setError(err.message);
      setImages(prev => prev.map(img => ({ ...img, status: 'error' })));
    } finally {
      setIsProcessing(false);
    }
  };

  const saveExtractedData = async () => {
    if (!extractedData) return;
    
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:3001/api'}/market-data/save-extracted`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
        },
        body: JSON.stringify(extractedData)
      });
      
      if (!response.ok) {
        throw new Error('Failed to save data');
      }
      
      // Reset form
      setImages([]);
      setExtractedData(null);
      
      if (onDataExtracted) {
        onDataExtracted();
      }
      
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <AdminCard
      title="Upload Market Data Images"
      icon={FaImage}
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <UploadContainer>
        <UploadZone
          isDragOver={isDragOver}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => document.getElementById('imageInput').click()}
        >
          <UploadIcon>
            <FaUpload />
          </UploadIcon>
          <UploadText>
            <h3>Upload Market Statistics Files</h3>
            <p>Drag and drop images or PDFs here, or click to select files</p>
            <p>Supports: PNG, JPG, JPEG, PDF (Max 10MB each)</p>
          </UploadText>
          <HiddenInput
            id="imageInput"
            type="file"
            multiple
            accept="image/*,application/pdf"
            onChange={handleFileInput}
          />
        </UploadZone>

        {images.length > 0 && (
          <ImagePreview>
            {images.map(image => (
              <PreviewCard key={image.id}>
                <RemoveButton onClick={() => removeImage(image.id)}>
                  <FaTrash size={12} />
                </RemoveButton>
                {image.file.type === 'application/pdf' ? (
                  <PdfPreview>
                    <FaFilePdf />
                    <span>PDF Document</span>
                  </PdfPreview>
                ) : (
                  <PreviewImage src={image.preview} alt={image.name} />
                )}
                <PreviewInfo>
                  <h4>{image.name}</h4>
                  <p>Size: {(image.size / 1024 / 1024).toFixed(2)} MB</p>
                  <StatusIndicator className={image.status}>
                    {image.status === 'pending' && <span>Ready to process</span>}
                    {image.status === 'uploading' && (
                      <>
                        <SpinningIcon as={FaSpinner} />
                        <span>Processing...</span>
                      </>
                    )}
                    {image.status === 'success' && (
                      <>
                        <FaCheckCircle />
                        <span>Processed successfully</span>
                      </>
                    )}
                    {image.status === 'error' && (
                      <>
                        <FaExclamationTriangle />
                        <span>Processing failed</span>
                      </>
                    )}
                  </StatusIndicator>
                </PreviewInfo>
              </PreviewCard>
            ))}
          </ImagePreview>
        )}

        {images.length > 0 && !extractedData && (
          <ProcessButton
            onClick={processImages}
            disabled={isProcessing}
          >
            {isProcessing ? (
              <>
                <SpinningIcon as={FaSpinner} />
                Processing Images...
              </>
            ) : (
              <>
                <FaUpload />
                Extract Data from Images
              </>
            )}
          </ProcessButton>
        )}

        {error && (
          <div style={{ 
            color: '#ff6b6b', 
            background: 'rgba(255, 107, 107, 0.1)', 
            padding: '1rem', 
            borderRadius: '8px',
            marginTop: '1rem'
          }}>
            <FaExclamationTriangle style={{ marginRight: '0.5rem' }} />
            {error}
          </div>
        )}

        {extractedData && (
          <ResultsSection>
            <AdminCard
              title="Extracted Market Data"
              icon={FaCheckCircle}
              iconColor="#4CAF50"
            >
              {extractedData.pricePerSqft && (
                <div>
                  <h4 style={{ color: '#8b4513', marginBottom: '1rem' }}>Price Per Square Foot Data</h4>
                  <DataTable>
                    <thead>
                      <tr>
                        <th>Location</th>
                        <th>Month</th>
                        <th>Year</th>
                        <th>Price/Sq Ft</th>
                        <th>Avg Price</th>
                        <th>Total Sales</th>
                      </tr>
                    </thead>
                    <tbody>
                      {extractedData.pricePerSqft.map((row, index) => (
                        <tr key={index}>
                          <td>{row.location}</td>
                          <td>{row.month}</td>
                          <td>{row.year}</td>
                          <td>${row.pricePerSqft}</td>
                          <td>${row.averagePrice?.toLocaleString()}</td>
                          <td>{row.totalSales}</td>
                        </tr>
                      ))}
                    </tbody>
                  </DataTable>
                </div>
              )}

              {extractedData.daysOnMarket && (
                <div style={{ marginTop: '2rem' }}>
                  <h4 style={{ color: '#8b4513', marginBottom: '1rem' }}>Days on Market Data</h4>
                  <DataTable>
                    <thead>
                      <tr>
                        <th>Location</th>
                        <th>Month</th>
                        <th>Year</th>
                        <th>Avg Days</th>
                        <th>Median Days</th>
                        <th>Properties Sold</th>
                      </tr>
                    </thead>
                    <tbody>
                      {extractedData.daysOnMarket.map((row, index) => (
                        <tr key={index}>
                          <td>{row.location}</td>
                          <td>{row.month}</td>
                          <td>{row.year}</td>
                          <td>{row.averageDaysOnMarket}</td>
                          <td>{row.medianDaysOnMarket}</td>
                          <td>{row.totalPropertiesSold}</td>
                        </tr>
                      ))}
                    </tbody>
                  </DataTable>
                </div>
              )}

              <SaveButton onClick={saveExtractedData}>
                <FaCheckCircle />
                Save Data to Database
              </SaveButton>
            </AdminCard>
          </ResultsSection>
        )}
      </UploadContainer>
    </AdminCard>
  );
};

export default ImageDataUploader;