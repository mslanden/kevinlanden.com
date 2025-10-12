import React, { useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import styled from 'styled-components';
import { FaChevronLeft, FaChevronRight, FaSpinner, FaExclamationTriangle } from 'react-icons/fa';

// Configure PDF.js worker
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

const PdfContainer = styled.div`
  width: 100%;
  background: #525659;
  border-radius: ${props => props.theme.borderRadius.default};
  overflow: hidden;
  margin-bottom: 1rem;
  position: relative;
`;

const PdfDocumentWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 400px;
  background: #525659;

  .react-pdf__Document {
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .react-pdf__Page {
    max-width: 100%;
    canvas {
      max-width: 100%;
      height: auto !important;
    }
  }

  .react-pdf__Page__textContent {
    display: none; /* Hide text layer for cleaner look */
  }
`;

const LoadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 400px;
  color: white;
  gap: 1rem;

  svg {
    font-size: 2rem;
    animation: spin 1s linear infinite;
  }

  @keyframes spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }

  p {
    font-size: 1rem;
    color: rgba(255, 255, 255, 0.8);
  }
`;

const ErrorContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 400px;
  color: #ff6b6b;
  gap: 1rem;
  padding: 2rem;
  text-align: center;

  svg {
    font-size: 3rem;
  }

  h3 {
    color: white;
    margin: 0;
  }

  p {
    color: rgba(255, 255, 255, 0.7);
    margin: 0;
  }
`;

const Controls = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  background: rgba(0, 0, 0, 0.3);
  border-top: 1px solid rgba(255, 255, 255, 0.1);
`;

const NavButton = styled.button`
  background: ${props => props.theme.colors.primary};
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

  &:hover:not(:disabled) {
    background: ${props => props.theme.colors.secondary};
    transform: translateY(-2px);
  }

  &:disabled {
    background: rgba(139, 69, 19, 0.3);
    cursor: not-allowed;
    opacity: 0.5;
  }

  svg {
    font-size: 1rem;
  }

  @media (max-width: ${props => props.theme.breakpoints.sm}) {
    padding: 0.5rem 1rem;
    font-size: 0.9rem;

    span {
      display: none;
    }
  }
`;

const PageInfo = styled.div`
  color: white;
  font-weight: 600;
  font-size: 1rem;
  text-align: center;

  @media (max-width: ${props => props.theme.breakpoints.sm}) {
    font-size: 0.9rem;
  }
`;

const PdfViewer = ({ pdfUrl }) => {
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pageWidth, setPageWidth] = useState(null);

  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
    setLoading(false);
    setError(null);
  };

  const onDocumentLoadError = (error) => {
    console.error('Error loading PDF:', error);
    setError('Failed to load PDF. Please try downloading it instead.');
    setLoading(false);
  };

  const goToPrevPage = () => {
    setPageNumber(page => Math.max(1, page - 1));
  };

  const goToNextPage = () => {
    setPageNumber(page => Math.min(numPages, page + 1));
  };

  // Calculate page width based on container
  React.useEffect(() => {
    const updateWidth = () => {
      const container = document.querySelector('.pdf-container');
      if (container) {
        // Use container width, max 800px for readability
        const width = Math.min(container.offsetWidth - 32, 800);
        setPageWidth(width);
      }
    };

    updateWidth();
    window.addEventListener('resize', updateWidth);
    return () => window.removeEventListener('resize', updateWidth);
  }, []);

  if (!pdfUrl) {
    return (
      <ErrorContainer>
        <FaExclamationTriangle />
        <h3>No PDF Available</h3>
        <p>The property listing book is not available at this time.</p>
      </ErrorContainer>
    );
  }

  return (
    <PdfContainer className="pdf-container">
      <PdfDocumentWrapper>
        {loading && (
          <LoadingContainer>
            <FaSpinner />
            <p>Loading PDF...</p>
          </LoadingContainer>
        )}

        {error && (
          <ErrorContainer>
            <FaExclamationTriangle />
            <h3>Unable to Display PDF</h3>
            <p>{error}</p>
          </ErrorContainer>
        )}

        {!error && (
          <Document
            file={pdfUrl}
            onLoadSuccess={onDocumentLoadSuccess}
            onLoadError={onDocumentLoadError}
            loading={null}
            error={null}
          >
            <Page
              pageNumber={pageNumber}
              width={pageWidth}
              renderTextLayer={false}
              renderAnnotationLayer={true}
            />
          </Document>
        )}
      </PdfDocumentWrapper>

      {!loading && !error && numPages && (
        <Controls>
          <NavButton
            onClick={goToPrevPage}
            disabled={pageNumber <= 1}
            aria-label="Previous page"
          >
            <FaChevronLeft />
            <span>Previous</span>
          </NavButton>

          <PageInfo>
            Page {pageNumber} of {numPages}
          </PageInfo>

          <NavButton
            onClick={goToNextPage}
            disabled={pageNumber >= numPages}
            aria-label="Next page"
          >
            <span>Next</span>
            <FaChevronRight />
          </NavButton>
        </Controls>
      )}
    </PdfContainer>
  );
};

export default PdfViewer;
