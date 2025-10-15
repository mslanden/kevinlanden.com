import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FaFilePdf,
  FaUpload,
  FaTimes,
  FaDownload,
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

const PdfPreview = styled.div`
  margin-top: 1.5rem;
  border-radius: ${props => props.theme.borderRadius.default};
  overflow: hidden;
  background: rgba(20, 20, 20, 0.85);
  border: 1px solid ${props => props.theme.colors.border};
`;

const PdfHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.5rem;
  background: rgba(0, 0, 0, 0.3);
  border-bottom: 1px solid ${props => props.theme.colors.border};
`;

const PdfIcon = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;

  svg {
    font-size: 2.5rem;
    color: ${props => props.theme.colors.primary};
  }
`;

const PdfInfo = styled.div`
  flex: 1;
`;

const FileName = styled.div`
  color: ${props => props.theme.colors.text.secondary};
  font-size: 1rem;
  font-weight: 600;
  margin-bottom: 0.25rem;
`;

const FileSize = styled.div`
  color: ${props => props.theme.colors.text.muted};
  font-size: 0.85rem;
`;

const PdfActions = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const ActionButton = styled.button`
  background: ${props => props.danger ? 'rgba(220, 53, 69, 0.2)' : 'rgba(255, 255, 255, 0.1)'};
  color: ${props => props.danger ? '#dc3545' : props.theme.colors.text.primary};
  border: 1px solid ${props => props.danger ? 'rgba(220, 53, 69, 0.3)' : props.theme.colors.border};
  padding: 0.75rem;
  border-radius: ${props => props.theme.borderRadius.small};
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    background: ${props => props.danger ? 'rgba(220, 53, 69, 0.3)' : 'rgba(255, 255, 255, 0.2)'};
    transform: scale(1.05);
  }

  svg {
    font-size: 1rem;
  }
`;

const PdfViewer = styled.div`
  width: 100%;
  height: 400px;
  background: #525659;
  display: flex;
  align-items: center;
  justify-content: center;

  iframe {
    width: 100%;
    height: 100%;
    border: none;
  }
`;

const UploadProgress = styled.div`
  margin-top: 1rem;
  padding: 1rem;
  background: rgba(20, 20, 20, 0.5);
  border-radius: ${props => props.theme.borderRadius.default};
`;

const ProgressBar = styled.div`
  width: 100%;
  height: 4px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 2px;
  overflow: hidden;
  margin-top: 0.5rem;
`;

const ProgressFill = styled.div`
  height: 100%;
  background: ${props => props.theme.colors.primary};
  transition: width 0.3s ease;
  width: ${props => props.$progress || 0}%;
`;

const ProgressText = styled.div`
  color: ${props => props.theme.colors.text.muted};
  font-size: 0.85rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
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

const PdfUpload = ({ pdf, onPdfChange, accept = { 'application/pdf': ['.pdf'] } }) => {
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState(null);

  const onDrop = useCallback(async (acceptedFiles) => {
    if (acceptedFiles.length === 0) return;

    const file = acceptedFiles[0]; // Only handle one PDF
    setError(null);
    setUploading(true);
    setUploadProgress(0);

    // Validate file size (max 50MB)
    const maxSize = 50 * 1024 * 1024; // 50MB in bytes
    if (file.size > maxSize) {
      setError('File size exceeds 50MB limit');
      setUploading(false);
      return;
    }

    try {
      const formData = new FormData();
      formData.append('pdf', file);
      formData.append('category', 'listing-pdfs');

      const response = await api.postFormData('/upload/pdf', formData, {
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setUploadProgress(percentCompleted);
        }
      });

      if (response.data.success) {
        const pdfData = {
          url: response.data.data.publicUrl,
          path: response.data.data.path,
          filename: response.data.data.filename,
          originalName: response.data.data.originalName,
          size: response.data.data.size,
          mimetype: response.data.data.mimetype
        };

        onPdfChange(pdfData);
        setUploadProgress(100);
      } else {
        throw new Error('Upload failed');
      }
    } catch (error) {
      console.error('PDF upload error:', error);
      setError(error.response?.data?.error || 'Failed to upload PDF');
      setUploadProgress(0);
    } finally {
      setUploading(false);
    }
  }, [onPdfChange]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept,
    maxFiles: 1,
    disabled: uploading || pdf
  });

  const handleRemove = async () => {
    if (pdf?.path) {
      try {
        await api.delete('/upload/pdf', { path: pdf.path });
      } catch (error) {
        console.error('Error removing PDF:', error);
      }
    }
    onPdfChange(null);
  };

  const handleDownload = () => {
    if (pdf?.url) {
      window.open(pdf.url, '_blank');
    }
  };

  return (
    <div>
      {!pdf && (
        <DropzoneContainer {...getRootProps()} isDragActive={isDragActive}>
          <input {...getInputProps()} />
          <DropzoneContent>
            <FaFilePdf />
            <h4>
              {isDragActive
                ? 'Drop PDF here...'
                : 'Drag & drop listing book PDF here'
              }
            </h4>
            <p>
              or <strong>click to browse</strong>
            </p>
            <p>
              PDF files only • Max 50MB
            </p>
          </DropzoneContent>
        </DropzoneContainer>
      )}

      {uploading && (
        <UploadProgress>
          <ProgressText>
            <span>Uploading PDF...</span>
            <span>{uploadProgress}%</span>
          </ProgressText>
          <ProgressBar>
            <ProgressFill $progress={uploadProgress} />
          </ProgressBar>
        </UploadProgress>
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

      {pdf && (
        <PdfPreview>
          <PdfHeader>
            <PdfIcon>
              <FaFilePdf />
              <PdfInfo>
                <FileName>{pdf.originalName || pdf.filename || 'Listing Book.pdf'}</FileName>
                <FileSize>{pdf.size ? formatFileSize(pdf.size) : ''}</FileSize>
              </PdfInfo>
            </PdfIcon>
            <PdfActions>
              <ActionButton onClick={handleDownload} title="Download PDF">
                <FaDownload />
              </ActionButton>
              <ActionButton danger onClick={handleRemove} title="Remove PDF">
                <FaTimes />
              </ActionButton>
            </PdfActions>
          </PdfHeader>
          <PdfViewer>
            <iframe src={`${pdf.url}#toolbar=0`} title="PDF Preview" />
          </PdfViewer>
        </PdfPreview>
      )}
    </div>
  );
};

export default PdfUpload;
