import React, { useState, useRef } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { FaNewspaper, FaDownload, FaEye, FaChartBar, FaMapMarkedAlt, FaUpload, FaFileAlt, FaSpinner } from 'react-icons/fa';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, LineElement, PointElement, Title, Tooltip, Legend, ArcElement } from 'chart.js';
import { Chart, Doughnut, Bar, Line } from 'react-chartjs-2';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

ChartJS.register(CategoryScale, LinearScale, BarElement, LineElement, PointElement, Title, Tooltip, Legend, ArcElement, ChartDataLabels);

// Import Google Fonts for western theme
const fontLink = document.createElement('link');
fontLink.href = 'https://fonts.googleapis.com/css2?family=Bodoni+Moda:wght@400;500;600;700&family=Poppins:wght@300;400;500;600;700&display=swap';
fontLink.rel = 'stylesheet';
if (!document.querySelector(`link[href="${fontLink.href}"]`)) {
  document.head.appendChild(fontLink);
}

const NewsletterSection = styled(motion.div)`
  margin-bottom: 3rem;
  background-color: rgba(20, 20, 20, 0.85);
  border: 2px solid ${props => props.theme.colors.primary};
  border-radius: ${props => props.theme.borderRadius.default};
  overflow: hidden;
`;

const NewsletterHeader = styled.div`
  background: linear-gradient(135deg, rgba(139, 69, 19, 0.3) 0%, rgba(184, 134, 11, 0.3) 100%);
  padding: 1.5rem 2rem;
  border-bottom: 1px solid ${props => props.theme.colors.border};
  
  h2 {
    font-family: ${props => props.theme.fonts.heading};
    font-size: 2rem;
    color: ${props => props.theme.colors.text.secondary};
    margin: 0;
    display: flex;
    align-items: center;
    gap: 1rem;
    
    svg {
      color: ${props => props.theme.colors.accent};
    }
  }
`;

const NewsletterContent = styled.div`
  padding: 2rem;
`;

const FormSection = styled.div`
  background-color: rgba(30, 30, 30, 0.5);
  border-radius: ${props => props.theme.borderRadius.default};
  padding: 1.5rem;
  margin-bottom: 2rem;
  border: 1px solid ${props => props.theme.colors.border};
  
  h3 {
    font-family: ${props => props.theme.fonts.heading};
    color: ${props => props.theme.colors.text.secondary};
    margin-bottom: 1rem;
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }
`;

const FormGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-bottom: 1.5rem;
`;

const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  
  label {
    color: ${props => props.theme.colors.text.secondary};
    font-weight: 600;
    font-size: 0.9rem;
  }
  
  input, select, textarea {
    background-color: rgba(255, 255, 255, 0.1);
    border: 1px solid ${props => props.theme.colors.border};
    color: ${props => props.theme.colors.text.primary};
    padding: 0.75rem 1rem;
    border-radius: ${props => props.theme.borderRadius.small};
    font-size: 1rem;
    
    &:focus {
      outline: none;
      border-color: ${props => props.theme.colors.primary};
    }
  }
  
  textarea {
    min-height: 100px;
    resize: vertical;
    font-family: inherit;
  }
`;

const FileUploadArea = styled.div`
  border: 2px dashed ${props => props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius.default};
  padding: 2rem;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;
  background-color: rgba(255, 255, 255, 0.05);
  
  &:hover {
    border-color: ${props => props.theme.colors.primary};
    background-color: rgba(139, 69, 19, 0.1);
  }
  
  &.dragover {
    border-color: ${props => props.theme.colors.primary};
    background-color: rgba(139, 69, 19, 0.2);
  }
  
  input {
    display: none;
  }
  
  .upload-icon {
    font-size: 3rem;
    color: ${props => props.theme.colors.primary};
    margin-bottom: 1rem;
  }
  
  .upload-text {
    color: ${props => props.theme.colors.text.secondary};
    font-size: 1.1rem;
    margin-bottom: 0.5rem;
  }
  
  .upload-hint {
    color: ${props => props.theme.colors.text.muted};
    font-size: 0.9rem;
  }
`;

const UploadedFiles = styled.div`
  margin-top: 1rem;
  
  .file-item {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.5rem;
    background-color: rgba(139, 69, 19, 0.1);
    border-radius: ${props => props.theme.borderRadius.small};
    margin-bottom: 0.5rem;
    
    .file-icon {
      color: ${props => props.theme.colors.primary};
    }
    
    .file-name {
      color: ${props => props.theme.colors.text.primary};
      flex: 1;
    }
    
    .processing-status {
      color: ${props => props.theme.colors.accent};
      font-size: 0.9rem;
    }
  }
`;

const DataVisualization = styled.div`
  margin-top: 2rem;
  
  .charts-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
    gap: 2rem;
    margin-bottom: 2rem;
  }
  
  .chart-container {
    background-color: rgba(30, 30, 30, 0.5);
    border-radius: ${props => props.theme.borderRadius.default};
    padding: 1.5rem;
    border: 1px solid ${props => props.theme.colors.border};
    height: 300px;
    display: flex;
    flex-direction: column;
    
    h4 {
      color: ${props => props.theme.colors.text.secondary};
      margin-bottom: 1rem;
      text-align: center;
      font-family: ${props => props.theme.fonts.heading};
      flex-shrink: 0;
    }
    
    canvas {
      max-height: 250px !important;
      flex: 1;
    }
  }
`;

const DataTable = styled.div`
  background-color: rgba(30, 30, 30, 0.5);
  border-radius: ${props => props.theme.borderRadius.default};
  border: 1px solid ${props => props.theme.colors.border};
  overflow: hidden;
  margin-bottom: 2rem;
  
  .table-header {
    background-color: rgba(139, 69, 19, 0.2);
    padding: 1rem;
    
    h4 {
      color: ${props => props.theme.colors.text.secondary};
      margin: 0;
      font-family: ${props => props.theme.fonts.heading};
    }
  }
  
  .table-content {
    max-height: 400px;
    overflow-y: auto;
    
    table {
      width: 100%;
      border-collapse: collapse;
      
      th, td {
        padding: 0.75rem;
        text-align: left;
        border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        color: ${props => props.theme.colors.text.primary};
        font-size: 0.85rem;
      }
      
      th {
        background-color: rgba(0, 0, 0, 0.3);
        color: ${props => props.theme.colors.text.secondary};
        font-weight: 600;
        position: sticky;
        top: 0;
      }
      
      tr:hover {
        background-color: rgba(255, 255, 255, 0.05);
      }
    }
  }
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
  justify-content: center;
  margin-top: 2rem;
`;

const ActionButton = styled.button`
  background-color: ${props => props.variant === 'preview' ? props.theme.colors.secondary : props.theme.colors.primary};
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: ${props => props.theme.borderRadius.small};
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 600;
  transition: all 0.3s ease;
  font-size: 1rem;
  
  &:hover {
    background-color: ${props => props.variant === 'preview' ? '#a0522d' : props.theme.colors.tertiary};
    transform: translateY(-2px);
  }
  
  &:active {
    transform: translateY(0);
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const PreviewContainer = styled.div`
  background-color: white;
  border-radius: ${props => props.theme.borderRadius.default};
  padding: 2rem;
  margin-top: 2rem;
  color: #333;
  font-family: 'Arial', sans-serif;
  min-height: 800px;
  box-shadow: 0 10px 30px rgba(0,0,0,0.3);
  max-width: 1200px;
  margin-left: auto;
  margin-right: auto;
`;

const NewsletterPreview = styled.div`
  width: 100%;
  background: #f5f5f5;
  font-family: "Poppins", sans-serif;
  border: 2px solid #8b4513;
  border-radius: 8px;
  overflow: hidden;
  
  /* PDF page break controls */
  .page-break-avoid {
    page-break-inside: avoid;
    break-inside: avoid;
  }
  
  .page-break-before {
    page-break-before: always;
    break-before: page;
  }
  
  .page-break-after {
    page-break-after: always;
    break-after: page;
  }
  
  .header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    padding: 1.5rem;
    background: linear-gradient(135deg, #8b4513 0%, #a0522d 100%);
    color: #f5f5f5;
    border-bottom: 3px solid #d2b48c;
    
    .title-section {
      flex: 1;
      
      h1 {
        color: #f5f5f5;
        font-family: "Bodoni Moda", serif;
        font-size: 1.8rem;
        font-weight: 700;
        margin: 0 0 0.5rem 0;
        text-transform: uppercase;
        text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
      }
      
      .location {
        color: #deb394;
        font-size: 0.9rem;
        font-weight: 500;
        text-transform: uppercase;
        letter-spacing: 0.5px;
      }
    }
    
    .logo-section {
      text-align: right;
      display: flex;
      flex-direction: column;
      align-items: flex-end;
      
      .logo-container {
        margin-bottom: 0.5rem;
        
        .hero-logo {
          height: 80px;
          width: auto;
          max-width: 200px;
          filter: brightness(1.1) contrast(1.1);
          background: rgba(255, 255, 255, 0.1);
          border-radius: 8px;
          padding: 0.5rem;
        }
        
        .text-logo {
          font-family: "Bodoni Moda", serif;
          font-size: 2.5rem;
          font-weight: 700;
          color: #f5f5f5;
          text-transform: uppercase;
          letter-spacing: 3px;
          text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
          margin: 0;
          padding: 0.5rem;
        }
      }
      
      .brand-name {
        color: #deb394;
        font-size: 0.8rem;
        font-weight: 600;
        margin-bottom: 0.5rem;
        text-transform: uppercase;
      }
      
      .tagline {
        color: #d2b48c;
        font-size: 0.7rem;
        margin-bottom: 0.5rem;
        font-weight: 500;
      }
      
      .contact-info {
        font-size: 0.65rem;
        color: #deb394;
        font-weight: 400;
        
        div {
          margin-bottom: 0.2rem;
        }
      }
    }
  }
  
  .content {
    padding: 1.5rem;
    
    .main-grid {
      display: grid;
      grid-template-columns: 1fr 300px;
      gap: 2rem;
      margin-bottom: 2rem;
    }
    
    .left-column {
      .quick-analysis {
        margin-bottom: 1.5rem;
        background: rgba(139, 69, 19, 0.05);
        padding: 1rem;
        border-radius: 8px;
        border-left: 4px solid #8b4513;
        
        h3 {
          color: #8b4513;
          font-family: "Bodoni Moda", serif;
          font-size: 1rem;
          font-weight: bold;
          margin-bottom: 0.5rem;
          text-transform: uppercase;
        }
        
        .analysis-text {
          font-size: 0.85rem;
          line-height: 1.5;
          color: #3a200c;
        }
      }
      
      .summary-section {
        background: rgba(210, 180, 140, 0.1);
        padding: 1rem;
        border-radius: 8px;
        border-left: 4px solid #d2b48c;
        
        h3 {
          color: #8b4513;
          font-family: "Bodoni Moda", serif;
          font-size: 1rem;
          font-weight: bold;
          margin-bottom: 0.5rem;
          text-transform: uppercase;
        }
        
        .summary-text {
          font-size: 0.85rem;
          line-height: 1.5;
          color: #3a200c;
        }
      }
    }
    
    .right-column {
      .key-stats {
        background: rgba(160, 82, 45, 0.05);
        padding: 1rem;
        border-radius: 8px;
        border: 1px solid rgba(139, 69, 19, 0.2);
        
        h3 {
          color: #8b4513;
          font-family: "Bodoni Moda", serif;
          font-size: 1rem;
          font-weight: bold;
          margin-bottom: 0.75rem;
          text-transform: uppercase;
        }
        
        .stats-table {
          width: 100%;
          border-collapse: collapse;
          font-size: 0.75rem;
          border-radius: 6px;
          overflow: hidden;
          
          th {
            background: linear-gradient(135deg, #8b4513, #a0522d);
            color: #f5f5f5;
            padding: 0.6rem 0.5rem;
            text-align: center;
            font-weight: bold;
            font-size: 0.7rem;
          }
          
          td {
            padding: 0.5rem;
            text-align: center;
            border-bottom: 1px solid rgba(139, 69, 19, 0.1);
            color: #3a200c;
          }
          
          .year-col {
            background: rgba(210, 180, 140, 0.15);
            font-weight: 600;
            color: #8b4513;
          }
          
          tr:hover {
            background: rgba(210, 180, 140, 0.1);
          }
        }
      }
      
      .buyers-sellers {
        margin-top: 1.5rem;
        text-align: center;
        background: rgba(210, 180, 140, 0.05);
        padding: 1rem;
        border-radius: 8px;
        border: 1px solid rgba(210, 180, 140, 0.3);
        
        h3 {
          color: #8b4513;
          font-family: "Bodoni Moda", serif;
          font-size: 1rem;
          font-weight: bold;
          margin-bottom: 0.75rem;
          text-transform: uppercase;
        }
        
        .gauge-container {
          height: 150px;
          display: flex;
          justify-content: center;
          align-items: center;
        }
      }
    }
    
    .charts-section {
      margin-top: 2rem;
      background: rgba(139, 69, 19, 0.02);
      padding: 1.5rem;
      border-radius: 8px;
      border: 1px solid rgba(139, 69, 19, 0.1);
      
      .chart-title {
        color: #8b4513;
        font-family: "Bodoni Moda", serif;
        font-size: 1.1rem;
        font-weight: bold;
        margin-bottom: 0.75rem;
        text-transform: uppercase;
        text-align: center;
      }
      
      .chart-grid {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 2rem;
        margin-bottom: 2rem;
      }
      
      .single-chart {
        margin-bottom: 2rem;
        background: rgba(210, 180, 140, 0.05);
        padding: 1rem;
        border-radius: 6px;
        
        .chart-container {
          height: 300px;
          margin-top: 0.5rem;
        }
      }
      
      .chart-item {
        background: rgba(210, 180, 140, 0.05);
        padding: 1rem;
        border-radius: 6px;
        
        .chart-container {
          height: 200px;
          margin-top: 0.5rem;
        }
      }
    }
    
    .properties-section {
      margin-top: 2rem;
      page-break-inside: avoid;
      background: rgba(160, 82, 45, 0.02);
      padding: 1.5rem;
      border-radius: 8px;
      border: 1px solid rgba(139, 69, 19, 0.1);
      
      h3 {
        color: #8b4513;
        font-family: "Bodoni Moda", serif;
        font-size: 1.1rem;
        font-weight: bold;
        margin-bottom: 0.75rem;
        text-transform: uppercase;
        text-align: center;
      }
      
      .properties-table {
        width: 100%;
        border-collapse: collapse;
        font-size: 0.7rem;
        border-radius: 6px;
        overflow: hidden;
        
        th {
          background: linear-gradient(135deg, #8b4513, #a0522d);
          color: #f5f5f5;
          padding: 0.6rem 0.4rem;
          text-align: left;
          font-weight: bold;
          font-size: 0.65rem;
        }
        
        td {
          padding: 0.5rem 0.4rem;
          border-bottom: 1px solid rgba(139, 69, 19, 0.1);
          color: #3a200c;
        }
        
        tr:nth-child(even) {
          background: rgba(210, 180, 140, 0.05);
        }
        
        tr:hover {
          background: rgba(210, 180, 140, 0.1);
        }
        
        .mls-col { width: 8%; }
        .status-col { width: 8%; }
        .price-col { width: 12%; font-weight: 600; color: #8b4513; }
        .address-col { width: 35%; }
        .beds-col { width: 6%; text-align: center; }
        .baths-col { width: 6%; text-align: center; }
        .sqft-col { width: 8%; text-align: center; }
        .year-col { width: 8%; text-align: center; }
      }
    }
  }
`;

const NewsletterGenerator = () => {
  const [newsletterData, setNewsletterData] = useState({
    community: 'anza',
    month: new Date().getMonth() + 1,
    year: new Date().getFullYear(),
    quickAnalysis: '',
    summary: ''
  });
  
  const [showPreview, setShowPreview] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [extractedData, setExtractedData] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [logoError, setLogoError] = useState(false);
  const previewRef = useRef();
  const fileInputRef = useRef();

  const communities = {
    'anza': 'Anza',
    'aguanga': 'Aguanga', 
    'idyllwild': 'Idyllwild',
    'mountain-center': 'Mountain Center'
  };

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const handleInputChange = (field, value) => {
    setNewsletterData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleFileUpload = async (files) => {
    setIsProcessing(true);
    
    const newFiles = Array.from(files).map(file => ({
      id: Date.now() + Math.random(),
      file,
      name: file.name,
      status: 'processing'
    }));
    
    setUploadedFiles(prev => [...prev, ...newFiles]);
    
    try {
      // Process files with LlamaParse
      const formData = new FormData();
      newFiles.forEach(fileItem => {
        formData.append('files', fileItem.file);
      });
      formData.append('community', newsletterData.community);
      
      // Send to backend for processing
      console.log('Sending files to backend for processing...');
      const response = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:3001/api'}/newsletter/process-mls`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
        },
        body: formData
      });
      
      console.log('Received response from backend:', response.status);
      
      if (response.ok) {
        console.log('Parsing JSON response...');
        const data = await response.json();
        console.log('Received data from backend:', data);
        setExtractedData(data);
        
        // Auto-populate form with extracted data
        setNewsletterData(prev => ({
          ...prev,
          quickAnalysis: data.summary?.quickAnalysis || ''
        }));
        
        // Update file status
        console.log('Updating file status to completed');
        setUploadedFiles(prev => 
          prev.map(f => newFiles.find(nf => nf.id === f.id) 
            ? { ...f, status: 'completed' } 
            : f
          )
        );
      } else {
        throw new Error('Failed to process files');
      }
    } catch (error) {
      console.error('Error processing files:', error);
      // Update file status to error
      setUploadedFiles(prev => 
        prev.map(f => newFiles.find(nf => nf.id === f.id) 
          ? { ...f, status: 'error' } 
          : f
        )
      );
      alert('Error processing MLS files. Please try again.');
    } finally {
      console.log('Processing finished, setting isProcessing to false');
      setIsProcessing(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileUpload(files);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const generatePreview = () => {
    setShowPreview(true);
  };

  const generatePDF = async () => {
    if (!showPreview) {
      alert('Please generate a preview first before creating PDF');
      return;
    }

    setIsGenerating(true);
    
    try {
      const element = previewRef.current;
      if (!element) {
        throw new Error('Preview element not found');
      }

      // Create PDF
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();

      // Find all major sections to capture separately
      const header = element.querySelector('.header');
      const mainGrid = element.querySelector('.main-grid');
      const chartsSection = element.querySelector('.charts-section');
      const propertiesSection = element.querySelector('.properties-section');

      let currentY = 0;

      // Wait for logo image to load
      const logoImg = element.querySelector('.hero-logo');
      if (logoImg && !logoImg.complete) {
        await new Promise((resolve, reject) => {
          logoImg.onload = resolve;
          logoImg.onerror = reject;
          setTimeout(resolve, 3000); // Timeout after 3 seconds
        }).catch(err => console.warn('Logo load timeout:', err));
      }

      // Capture header
      if (header) {
        try {
          const headerCanvas = await html2canvas(header, {
            scale: 1.3,
            useCORS: true,
            allowTaint: false,
            backgroundColor: '#ffffff',
            logging: false,
            imageTimeout: 5000,
            proxy: undefined
          });
          const headerImgData = headerCanvas.toDataURL('image/png');
          const headerHeight = (headerCanvas.height * pdfWidth) / headerCanvas.width;
          
          pdf.addImage(headerImgData, 'PNG', 0, currentY, pdfWidth, headerHeight);
          currentY += headerHeight;
        } catch (headerError) {
          console.warn('Error capturing header, skipping section:', headerError);
        }
      }

      // Capture main grid (analysis + stats)
      if (mainGrid) {
        try {
          const mainCanvas = await html2canvas(mainGrid, {
            scale: 1.3,
            useCORS: true,
            allowTaint: false,
            backgroundColor: '#ffffff',
            logging: false,
            imageTimeout: 5000
          });
          const mainImgData = mainCanvas.toDataURL('image/png');
          const mainHeight = (mainCanvas.height * pdfWidth) / mainCanvas.width;
          
          // Check if we need a new page
          if (currentY + mainHeight > pdfHeight) {
            pdf.addPage();
            currentY = 0;
          }
          
          pdf.addImage(mainImgData, 'PNG', 0, currentY, pdfWidth, mainHeight);
          currentY += mainHeight;
        } catch (mainError) {
          console.warn('Error capturing main grid, skipping section:', mainError);
        }
      }

      // Capture charts section on new page
      if (chartsSection) {
        try {
          pdf.addPage();
          currentY = 0;
          
          const chartsCanvas = await html2canvas(chartsSection, {
            scale: 1.3,
            useCORS: true,
            allowTaint: true,
            backgroundColor: '#ffffff',
            logging: false
          });
          const chartsImgData = chartsCanvas.toDataURL('image/png');
          const chartsHeight = (chartsCanvas.height * pdfWidth) / chartsCanvas.width;
          
          pdf.addImage(chartsImgData, 'PNG', 0, currentY, pdfWidth, chartsHeight);
        } catch (chartsError) {
          console.warn('Error capturing charts, skipping section:', chartsError);
        }
      }

      // Capture properties section with smart table pagination
      if (propertiesSection && extractedData?.listings && extractedData.listings.length > 0) {
        try {
          pdf.addPage();
          currentY = 0;
          
          // Use simpler approach - capture entire properties section and split if needed
          const propertiesCanvas = await html2canvas(propertiesSection, {
            scale: 1.3,
            useCORS: true,
            allowTaint: true,
            backgroundColor: '#ffffff',
            logging: false,
            onclone: function(clonedDoc) {
              // Ensure all styles are available in cloned document
              const originalStyles = document.querySelectorAll('style, link[rel="stylesheet"]');
              originalStyles.forEach(style => {
                if (style.tagName === 'STYLE') {
                  const clonedStyle = clonedDoc.createElement('style');
                  clonedStyle.textContent = style.textContent;
                  clonedDoc.head.appendChild(clonedStyle);
                } else if (style.tagName === 'LINK') {
                  const clonedLink = clonedDoc.createElement('link');
                  clonedLink.rel = 'stylesheet';
                  clonedLink.href = style.href;
                  clonedDoc.head.appendChild(clonedLink);
                }
              });
            }
          });
          
          const propertiesImgData = propertiesCanvas.toDataURL('image/png');
          const propertiesHeight = (propertiesCanvas.height * pdfWidth) / propertiesCanvas.width;
          
          // If table is too long, split it across multiple pages
          if (propertiesHeight > pdfHeight) {
            let remainingHeight = propertiesHeight;
            let sourceY = 0;
            
            while (remainingHeight > 0) {
              const pageHeight = Math.min(remainingHeight, pdfHeight);
              
              // Create a canvas for this page section
              const pageCanvas = document.createElement('canvas');
              const pageCtx = pageCanvas.getContext('2d');
              pageCanvas.width = propertiesCanvas.width;
              pageCanvas.height = (pageHeight * propertiesCanvas.width) / pdfWidth;
              
              // Draw the appropriate section of the original canvas
              pageCtx.drawImage(
                propertiesCanvas,
                0, sourceY * propertiesCanvas.height / propertiesHeight,
                propertiesCanvas.width, pageCanvas.height,
                0, 0,
                pageCanvas.width, pageCanvas.height
              );
              
              const pageImgData = pageCanvas.toDataURL('image/png');
              pdf.addImage(pageImgData, 'PNG', 0, 0, pdfWidth, pageHeight);
              
              remainingHeight -= pdfHeight;
              sourceY += pdfHeight;
              
              if (remainingHeight > 0) {
                pdf.addPage();
              }
            }
          } else {
            pdf.addImage(propertiesImgData, 'PNG', 0, currentY, pdfWidth, propertiesHeight);
          }
        } catch (tableError) {
          console.warn('Error capturing properties table, skipping section:', tableError);
          // Continue without the properties section rather than failing entirely
        }
      }

      // Ensure we have at least one page with content
      if (pdf.internal.pages.length === 1) {
        // Add a simple text page if no sections were captured
        pdf.setFontSize(16);
        pdf.text('Newsletter Generation Error', 20, 30);
        pdf.setFontSize(12);
        pdf.text('Unable to capture newsletter content. Please try again.', 20, 50);
        pdf.text('If the problem persists, please contact support.', 20, 70);
      }

      // Download the PDF
      const fileName = `${communities[newsletterData.community]}-Newsletter-${months[newsletterData.month - 1]}-${newsletterData.year}.pdf`;
      pdf.save(fileName);

    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Error generating PDF. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  // Create chart data matching MLS format
  const createChartData = () => {
    const baseOptions = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false
        },
        datalabels: {
          display: false
        }
      }
    };

    // If we have extracted data, use it for charts
    if (extractedData && extractedData.statusSummary) {
      console.log('Using extracted data for charts:', extractedData);
      const statusData = extractedData.statusSummary;
      
      // Calculate key metrics from extracted data
      const totalListings = statusData.active + statusData.pending + statusData.closed + statusData.other;
      const avgListPrice = extractedData.summary?.medianPrice ? 
        parseInt(extractedData.summary.medianPrice.replace(/[^\d]/g, '')) * 1000 : 567500;
      const avgDaysOnMarket = extractedData.summary?.daysOnMarket ? 
        parseInt(extractedData.summary.daysOnMarket.replace(/[^\d]/g, '')) : 63;
      
      // Generate realistic historical trend data based on current market
      const months = ['Jan 23', 'Jul 23', 'Jan 24', 'Jul 24', 'Current'];
      const salesHistoryData = [
        Math.floor(statusData.closed * 1.2), 
        Math.floor(statusData.closed * 1.5), 
        Math.floor(statusData.closed * 0.8), 
        Math.floor(statusData.closed * 1.1), 
        statusData.closed
      ];
      const priceHistoryData = [
        avgListPrice * 0.92, 
        avgListPrice * 0.96, 
        avgListPrice * 0.94, 
        avgListPrice * 0.98, 
        avgListPrice
      ];
      const inventoryHistoryData = [
        Math.floor(totalListings * 0.85), 
        Math.floor(totalListings * 0.92), 
        Math.floor(totalListings * 0.88), 
        Math.floor(totalListings * 0.95), 
        totalListings
      ];
      
      // Calculate price per sq ft trend (realistic range for area)
      const pricePerSqFtData = [350, 365, 358, 372, 376];

      return {
        statusChart: {
          data: {
            labels: ['Active', 'Pending', 'Closed', 'Other'],
            datasets: [{
              data: [statusData.active, statusData.pending, statusData.closed, statusData.other],
              backgroundColor: ['#8b4513', '#d2b48c', '#a0522d', '#deb394'],
              borderWidth: 2,
              borderColor: '#fff'
            }]
          },
          options: {
            ...baseOptions,
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              ...baseOptions.plugins,
              legend: {
                display: true,
                position: 'bottom',
                labels: {
                  usePointStyle: true,
                  font: { size: 12 },
                  color: '#333'
                }
              }
            }
          }
        },
        priceChart: extractedData.priceRanges && extractedData.priceRanges.some(range => range.count > 0) ? {
          data: {
            labels: extractedData.priceRanges.map(range => range.label),
            datasets: [{
              data: extractedData.priceRanges.map(range => range.count),
              backgroundColor: '#8b4513',
              borderColor: '#d2b48c',
              borderWidth: 1
            }]
          },
          options: {
            ...baseOptions,
            responsive: true,
            maintainAspectRatio: false,
            scales: {
              y: {
                beginAtZero: true,
                grid: { color: '#e0e0e0' },
                ticks: { 
                  font: { size: 10 }, 
                  color: '#333',
                  stepSize: 1
                }
              },
              x: {
                grid: { display: false },
                ticks: { font: { size: 10 }, color: '#333' }
              }
            }
          }
        } : null,
        
        // Buyers/Sellers Market Gauge (calculated from extracted data)
        marketGauge: (() => {
          // Calculate market conditions based on extracted data
          const activeListings = statusData.active;
          const recentSales = statusData.closed + statusData.pending;
          const totalMarketListings = statusData.active + statusData.pending + statusData.closed + statusData.other;
          
          // Market indicators:
          // - High active inventory + low sales = Buyers market
          // - Low active inventory + high sales = Sellers market
          // - Balanced = everything else
          
          let sellersMarket = 20;
          let balanced = 60;
          let buyersMarket = 20;
          
          if (totalMarketListings > 0) {
            const inventoryToSalesRatio = activeListings / Math.max(recentSales, 1);
            
            if (inventoryToSalesRatio < 2) {
              // Low inventory relative to sales = Sellers market
              sellersMarket = 70;
              balanced = 20;
              buyersMarket = 10;
            } else if (inventoryToSalesRatio > 5) {
              // High inventory relative to sales = Buyers market
              sellersMarket = 10;
              balanced = 20;
              buyersMarket = 70;
            } else {
              // Moderate inventory = Balanced market
              sellersMarket = 25;
              balanced = 50;
              buyersMarket = 25;
            }
          }
          
          return {
            data: {
              labels: ['Sellers', 'Balanced', 'Buyers'],
              datasets: [{
                data: [sellersMarket, balanced, buyersMarket],
                backgroundColor: ['#8b4513', '#d2b48c', '#a0522d'],
                borderWidth: 0,
                cutout: '70%',
                circumference: 180,
                rotation: 270
              }]
            },
            options: {
              ...baseOptions,
              plugins: {
                ...baseOptions.plugins,
                legend: {
                  display: true,
                  position: 'bottom',
                  labels: {
                    usePointStyle: true,
                    font: { size: 10 },
                    color: '#333'
                  }
                }
              }
            }
          };
        })(),
        
        // Current Market Status Distribution
        unitSalesChart: {
          data: {
            labels: ['Active Listings', 'Pending Sales', 'Recently Closed', 'Other'],
            datasets: [{
              label: 'Current Market Status',
              data: [statusData.active, statusData.pending, statusData.closed, statusData.other],
              backgroundColor: ['#8b4513', '#d2b48c', '#a0522d', '#deb394'],
              borderColor: '#fff',
              borderWidth: 2
            }]
          },
          options: {
            ...baseOptions,
            responsive: true,
            plugins: {
              ...baseOptions.plugins,
              legend: {
                display: true,
                position: 'bottom',
                labels: {
                  usePointStyle: true,
                  font: { size: 10 },
                  color: '#333'
                }
              },
              title: {
                display: true,
                text: `Total: ${statusData.active + statusData.pending + statusData.closed + statusData.other} Properties`,
                font: { size: 12 },
                color: '#333'
              }
            },
            scales: {
              y: {
                beginAtZero: true,
                grid: { color: '#e0e0e0' },
                ticks: { font: { size: 10 }, color: '#333' }
              },
              x: {
                grid: { display: false },
                ticks: { font: { size: 10 }, color: '#333' }
              }
            }
          }
        },
        
        // Price Distribution Chart (uses extracted priceRanges data)
        inventoryChart: extractedData.priceRanges && extractedData.priceRanges.length > 0 ? {
          data: {
            labels: extractedData.priceRanges.map(range => range.label),
            datasets: [{
              label: 'Properties by Price Range',
              data: extractedData.priceRanges.map(range => range.count),
              backgroundColor: '#8b4513',
              borderColor: '#a0522d',
              borderWidth: 1
            }]
          },
          options: {
            ...baseOptions,
            responsive: true,
            scales: {
              x: {
                grid: { display: false },
                ticks: { 
                  font: { size: 9 }, 
                  color: '#333',
                  maxRotation: 45
                }
              },
              y: {
                beginAtZero: true,
                grid: { color: '#e0e0e0' },
                ticks: { 
                  font: { size: 10 }, 
                  color: '#333',
                  stepSize: 1
                }
              }
            },
            plugins: {
              ...baseOptions.plugins,
              title: {
                display: true,
                text: 'Current Market Distribution',
                font: { size: 12 },
                color: '#333'
              }
            }
          }
        } : {
          data: {
            labels: ['No Price Data'],
            datasets: [{
              data: [0],
              backgroundColor: '#8b4513'
            }]
          },
          options: baseOptions
        },
        
        // Property Statistics from Current Listings
        pricePerSqFtChart: (() => {
          // Calculate actual statistics from current listings
          const validListings = extractedData.listings.filter(listing => 
            listing.sqft && listing.sqft > 0 && 
            listing.price && !isNaN(parseFloat(listing.price.replace(/[^\d.]/g, '')))
          );
          
          if (validListings.length === 0) {
            return {
              data: {
                labels: ['No Data Available'],
                datasets: [{
                  data: [0],
                  backgroundColor: '#8b4513'
                }]
              },
              options: baseOptions
            };
          }
          
          // Group listings by bedroom count
          const bedCounts = {};
          validListings.forEach(listing => {
            const beds = listing.beds || 0;
            const price = parseFloat(listing.price.replace(/[^\d.]/g, ''));
            const pricePerSqFt = listing.sqft > 0 ? price / listing.sqft : 0;
            
            if (!bedCounts[beds]) {
              bedCounts[beds] = [];
            }
            bedCounts[beds].push(pricePerSqFt);
          });
          
          // Calculate average price per sq ft for each bedroom count
          const bedLabels = Object.keys(bedCounts).sort((a, b) => a - b);
          const avgPricePerSqFt = bedLabels.map(beds => {
            const prices = bedCounts[beds];
            return prices.reduce((sum, price) => sum + price, 0) / prices.length;
          });
          
          return {
            data: {
              labels: bedLabels.map(beds => `${beds} Bed${beds !== '1' ? 's' : ''}`),
              datasets: [{
                label: 'Avg Price per Sq Ft',
                data: avgPricePerSqFt,
                backgroundColor: '#8b4513',
                borderColor: '#a0522d',
                borderWidth: 1
              }]
            },
            options: {
              ...baseOptions,
              responsive: true,
              scales: {
                x: {
                  grid: { display: false },
                  ticks: { font: { size: 10 }, color: '#333' }
                },
                y: {
                  beginAtZero: true,
                  grid: { color: '#e0e0e0' },
                  ticks: { 
                    font: { size: 10 }, 
                    color: '#333',
                    callback: function(value) {
                      return '$' + Math.round(value);
                    }
                  }
                }
              },
              plugins: {
                ...baseOptions.plugins,
                title: {
                  display: true,
                  text: 'Current Market - Price per Sq Ft by Bedroom Count',
                  font: { size: 11 },
                  color: '#333'
                }
              }
            }
          };
        })()
      };
    }

    // Generate sample data for charts
    const months = ['Jan 23', 'Jul 23', 'Jan 24', 'Jul 24', 'Jan 25'];
    const unitSalesData = [120, 140, 110, 150, parseInt(newsletterData.unitSales) || 89];
    const medianPriceData = [580000, 620000, 590000, 640000, 620000];
    const inventoryData = [400, 420, 380, 450, parseInt(newsletterData.inventory) || 447];
    const pricePerSqFtData = [280, 290, 285, 295, 290];

    return {
      // Buyers/Sellers Market Gauge
      marketGauge: {
        data: {
          labels: ['Sellers', 'Balanced', 'Buyers'],
          datasets: [{
            data: [40, 20, 40],
            backgroundColor: ['#8b4513', '#d2b48c', '#a0522d'],
            borderWidth: 0,
            cutout: '70%',
            circumference: 180,
            rotation: 270
          }]
        },
        options: {
          ...baseOptions,
          plugins: {
            ...baseOptions.plugins,
            legend: {
              display: true,
              position: 'bottom',
              labels: {
                usePointStyle: true,
                font: { size: 10 },
                color: '#333'
              }
            }
          }
        }
      },
      
      // Unit Sales and Median Prices (Combined Bar + Line)
      unitSalesChart: {
        data: {
          labels: months,
          datasets: [
            {
              type: 'bar',
              label: 'Unit Sales',
              data: unitSalesData,
              backgroundColor: '#8b4513',
              borderColor: '#a0522d',
              borderWidth: 1,
              yAxisID: 'y'
            },
            {
              type: 'line',
              label: 'Median Sale Price',
              data: medianPriceData,
              borderColor: '#d2b48c',
              backgroundColor: 'transparent',
              borderWidth: 2,
              pointRadius: 4,
              pointBackgroundColor: '#d2b48c',
              yAxisID: 'y1'
            }
          ]
        },
        options: {
          ...baseOptions,
          scales: {
            x: {
              grid: { display: false },
              ticks: { font: { size: 10 }, color: '#333' }
            },
            y: {
              type: 'linear',
              display: true,
              position: 'left',
              max: 200,
              grid: { color: '#e0e0e0' },
              ticks: { font: { size: 10 }, color: '#333' }
            },
            y1: {
              type: 'linear',
              display: true,
              position: 'right',
              min: 500000,
              max: 700000,
              grid: { drawOnChartArea: false },
              ticks: { 
                font: { size: 10 }, 
                color: '#333',
                callback: function(value) {
                  return '$' + (value / 1000) + 'k';
                }
              }
            }
          },
          plugins: {
            ...baseOptions.plugins,
            legend: {
              display: true,
              position: 'bottom',
              labels: {
                usePointStyle: true,
                font: { size: 10 },
                color: '#333'
              }
            }
          }
        }
      },
      
      // Inventory Chart
      inventoryChart: {
        data: {
          labels: months,
          datasets: [{
            label: 'Inventory',
            data: inventoryData,
            backgroundColor: '#87CEEB',
            borderColor: '#4682B4',
            borderWidth: 1
          }]
        },
        options: {
          ...baseOptions,
          scales: {
            x: {
              grid: { display: false },
              ticks: { font: { size: 10 }, color: '#333' }
            },
            y: {
              max: 500,
              grid: { color: '#e0e0e0' },
              ticks: { font: { size: 10 }, color: '#333' }
            }
          }
        }
      },
      
      // Median Sale Price per Sq Ft
      pricePerSqFtChart: {
        data: {
          labels: months,
          datasets: [{
            label: 'Price per Sq Ft',
            data: pricePerSqFtData,
            borderColor: '#FF6347',
            backgroundColor: 'transparent',
            borderWidth: 2,
            pointRadius: 4,
            pointBackgroundColor: '#FF6347',
            fill: false
          }]
        },
        options: {
          ...baseOptions,
          scales: {
            x: {
              grid: { display: false },
              ticks: { font: { size: 10 }, color: '#333' }
            },
            y: {
              min: 250,
              max: 350,
              grid: { color: '#e0e0e0' },
              ticks: { 
                font: { size: 10 }, 
                color: '#333',
                callback: function(value) {
                  return '$' + value;
                }
              }
            }
          }
        }
      }
    };
  };

  return (
    <NewsletterSection>
      <NewsletterHeader>
        <h2>
          <FaNewspaper />
          Monthly Newsletter Generator
        </h2>
      </NewsletterHeader>
      <NewsletterContent>
        <FormSection>
          <h3>
            <FaMapMarkedAlt />
            Newsletter Details
          </h3>
          <FormGrid>
            <InputGroup>
              <label>Community</label>
              <select 
                value={newsletterData.community}
                onChange={(e) => handleInputChange('community', e.target.value)}
              >
                {Object.entries(communities).map(([key, name]) => (
                  <option key={key} value={key}>{name}</option>
                ))}
              </select>
            </InputGroup>
            
            <InputGroup>
              <label>Month</label>
              <select 
                value={newsletterData.month}
                onChange={(e) => handleInputChange('month', parseInt(e.target.value))}
              >
                {months.map((month, index) => (
                  <option key={index} value={index + 1}>{month}</option>
                ))}
              </select>
            </InputGroup>
            
            <InputGroup>
              <label>Year</label>
              <input 
                type="number"
                value={newsletterData.year}
                onChange={(e) => handleInputChange('year', parseInt(e.target.value))}
                min="2020"
                max="2030"
              />
            </InputGroup>
          </FormGrid>
          
          <InputGroup>
            <label>Quick Analysis Summary</label>
            <textarea 
              value={newsletterData.quickAnalysis}
              onChange={(e) => handleInputChange('quickAnalysis', e.target.value)}
              placeholder="Brief market overview and key insights..."
            />
          </InputGroup>
        </FormSection>


        <FormSection>
          <h3>
            <FaUpload />
            Upload MLS Data (PDF Files)
          </h3>
          <FileUploadArea
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onClick={() => fileInputRef.current?.click()}
          >
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept=".pdf,.jpg,.jpeg,.png,.webp,image/*"
              onChange={(e) => handleFileUpload(e.target.files)}
            />
            <div className="upload-icon">
              {isProcessing ? <FaSpinner style={{ animation: 'spin 1s linear infinite' }} /> : <FaUpload />}
            </div>
            <div className="upload-text">
              {isProcessing ? 'Processing files...' : 'Drop MLS files here or click to browse'}
            </div>
            <div className="upload-hint">
              Supports PDF, JPEG, PNG, and WebP files
            </div>
          </FileUploadArea>
          
          {uploadedFiles.length > 0 && (
            <UploadedFiles>
              {uploadedFiles.map(file => (
                <div key={file.id} className="file-item">
                  <FaFileAlt className="file-icon" />
                  <span className="file-name">{file.name}</span>
                  <span className="processing-status">
                    {file.status === 'processing' && <FaSpinner style={{ animation: 'spin 1s linear infinite' }} />}
                    {file.status === 'completed' && '✓ Processed'}
                    {file.status === 'error' && '✗ Error'}
                  </span>
                </div>
              ))}
            </UploadedFiles>
          )}
        </FormSection>

        {extractedData && (
          <>
            <DataVisualization>
              <h3 style={{ color: '#d2b48c', marginBottom: '1.5rem', fontFamily: 'Bodoni Moda, serif' }}>
                <FaChartBar style={{ marginRight: '0.5rem' }} />
                Market Data Visualization
              </h3>
              
              <div className="charts-grid">
                {createChartData()?.statusChart && (
                  <div className="chart-container">
                    <h4>Listings by Status</h4>
                    <Doughnut {...createChartData().statusChart} />
                  </div>
                )}
                
                {createChartData()?.priceChart && (
                  <div className="chart-container">
                    <h4>Price Distribution</h4>
                    <Bar {...createChartData().priceChart} />
                  </div>
                )}
              </div>
            </DataVisualization>

            {extractedData.listings && (
              <DataTable>
                <div className="table-header">
                  <h4>Property Listings ({extractedData.listings.length} properties)</h4>
                </div>
                <div className="table-content">
                  <table>
                    <thead>
                      <tr>
                        <th>MLS #</th>
                        <th>Status</th>
                        <th>Price</th>
                        <th>Address</th>
                        <th>Beds</th>
                        <th>Baths</th>
                        <th>Sq Ft</th>
                        <th>Year Built</th>
                      </tr>
                    </thead>
                    <tbody>
                      {extractedData.listings.slice(0, 50).map((listing, index) => (
                        <tr key={index}>
                          <td>{listing.mls}</td>
                          <td>{listing.status}</td>
                          <td>{listing.price}</td>
                          <td>{listing.address}</td>
                          <td>{listing.beds}</td>
                          <td>{listing.baths}</td>
                          <td>{listing.sqft}</td>
                          <td>{listing.yearBuilt}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </DataTable>
            )}
          </>
        )}

        <ActionButtons>
          <ActionButton variant="preview" onClick={generatePreview}>
            <FaEye />
            Preview Newsletter
          </ActionButton>
          
          <ActionButton onClick={generatePDF} disabled={isGenerating}>
            <FaDownload />
            {isGenerating ? 'Generating...' : 'Generate PDF'}
          </ActionButton>
        </ActionButtons>

        {showPreview && (
          <PreviewContainer ref={previewRef}>
            <NewsletterPreview>
              <div className="header page-break-avoid">
                <div className="title-section">
                  <h1>Monthly Market Summary</h1>
                  <div className="location">
                    {communities[newsletterData.community]}, CA - Single Family<br/>
                    {months[newsletterData.month - 1]}, {newsletterData.year}
                  </div>
                </div>
                <div className="logo-section">
                  <div className="logo-container">
                    {!logoError ? (
                      <img 
                        src="/logo/logo_2.svg" 
                        alt="Outrider Real Estate Logo" 
                        className="hero-logo"
                        crossOrigin="anonymous"
                        onLoad={() => setLogoError(false)}
                        onError={(e) => {
                          console.warn('Logo failed to load, using text fallback');
                          setLogoError(true);
                        }}
                      />
                    ) : (
                      <div className="text-logo">OUTRIDER</div>
                    )}
                  </div>
                  <div className="brand-name">Real Estate</div>
                  <div className="tagline">Serving Anza • Aguanga • Idyllwild • Mountain Center</div>
                  <div className="contact-info">
                    <div>kevin@outriderrealestate.com</div>
                    <div>(951) 491-4890</div>
                  </div>
                </div>
              </div>
              
              <div className="content">
                <div className="main-grid page-break-avoid">
                  <div className="left-column">
                    <div className="quick-analysis page-break-avoid">
                      <h3>Quick Analysis</h3>
                      <div className="analysis-text">
                        {extractedData?.summary?.quickAnalysis || newsletterData.quickAnalysis || (extractedData?.statusSummary ? 
                          `Current market data shows ${extractedData.statusSummary.active} active listings, ${extractedData.statusSummary.pending} pending sales, and ${extractedData.statusSummary.closed} recently closed properties in ${communities[newsletterData.community]}. ${extractedData.summary?.medianPrice ? `Median list price is ${extractedData.summary.medianPrice}.` : ''} Market activity indicates ${extractedData.statusSummary.active > extractedData.statusSummary.pending + extractedData.statusSummary.closed ? 'an active sellers market with strong inventory levels' : 'balanced market conditions with steady transaction activity'}.` :
                          `Market activity in ${communities[newsletterData.community]} shows current performance trends. Analysis will be updated once MLS data is processed.`
                        )}
                      </div>
                    </div>
                    
                    <div className="summary-section page-break-avoid">
                      <h3>Summary</h3>
                      <div className="summary-text">
                        {newsletterData.summary || (extractedData?.statusSummary ? 
                          `The ${communities[newsletterData.community]} real estate market for ${months[newsletterData.month - 1]} ${newsletterData.year} shows a total of ${extractedData.statusSummary.active + extractedData.statusSummary.pending + extractedData.statusSummary.closed + extractedData.statusSummary.other} properties in the MLS system. With ${extractedData.statusSummary.active} active listings available, buyers have a ${extractedData.statusSummary.active > 50 ? 'good' : 'limited'} selection of properties. Recent sales activity of ${extractedData.statusSummary.closed} closed transactions demonstrates ${extractedData.statusSummary.closed > 10 ? 'robust' : 'moderate'} market movement in the area.` :
                          `Market summary will be generated once MLS data is processed and analyzed.`
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="right-column">
                    <div className="key-stats page-break-avoid">
                      <h3>Market Summary</h3>
                      <table className="stats-table">
                        <thead>
                          <tr>
                            <th>Metric</th>
                            <th>Count</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td className="year-col">Active Listings</td>
                            <td>{extractedData?.statusSummary?.active || 'N/A'}</td>
                          </tr>
                          <tr>
                            <td className="year-col">Pending Sales</td>
                            <td>{extractedData?.statusSummary?.pending || 'N/A'}</td>
                          </tr>
                          <tr>
                            <td className="year-col">Closed Sales</td>
                            <td>{extractedData?.statusSummary?.closed || 'N/A'}</td>
                          </tr>
                          <tr>
                            <td className="year-col">Total Listings</td>
                            <td>{extractedData?.statusSummary ? (extractedData.statusSummary.active + extractedData.statusSummary.pending + extractedData.statusSummary.closed + extractedData.statusSummary.other) : 'N/A'}</td>
                          </tr>
                          <tr>
                            <td className="year-col">Median List Price</td>
                            <td>{extractedData?.summary?.medianPrice || newsletterData.medianPrice || 'N/A'}</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                    
                    <div className="buyers-sellers page-break-avoid">
                      <h3>Buyers/Sellers Market</h3>
                      <div className="gauge-container">
                        {createChartData()?.marketGauge && (
                          <Doughnut {...createChartData().marketGauge} />
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="charts-section page-break-before">
                  <div className="single-chart page-break-avoid">
                    <div className="chart-title">Current Market Status Distribution</div>
                    <div className="chart-container">
                      {createChartData()?.unitSalesChart && (
                        <Bar {...createChartData().unitSalesChart} />
                      )}
                    </div>
                  </div>
                  
                  <div className="chart-grid">
                    <div className="chart-item page-break-avoid">
                      <div className="chart-title">Price Range Distribution</div>
                      <div className="chart-container">
                        {createChartData()?.inventoryChart && (
                          <Bar {...createChartData().inventoryChart} />
                        )}
                      </div>
                    </div>
                    
                    <div className="chart-item page-break-avoid">
                      <div className="chart-title">Price Per Sq Ft by Bedroom Count</div>
                      <div className="chart-container">
                        {createChartData()?.pricePerSqFtChart && (
                          <Bar {...createChartData().pricePerSqFtChart} />
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                
                {extractedData?.listings && (
                  <div className="properties-section page-break-before">
                    <h3>Property Listings ({extractedData.listings.length} Properties)</h3>
                    <table className="properties-table">
                      <thead>
                        <tr>
                          <th className="mls-col">MLS #</th>
                          <th className="status-col">Status</th>
                          <th className="price-col">Price</th>
                          <th className="address-col">Address</th>
                          <th className="beds-col">Beds</th>
                          <th className="baths-col">Baths</th>
                          <th className="sqft-col">Sq Ft</th>
                          <th className="year-col">Year</th>
                        </tr>
                      </thead>
                      <tbody>
                        {extractedData.listings.map((listing, index) => (
                          <tr key={index}>
                            <td>{listing.mls}</td>
                            <td>{listing.status}</td>
                            <td>{listing.price}</td>
                            <td>{listing.address}</td>
                            <td>{listing.beds}</td>
                            <td>{listing.baths}</td>
                            <td>{listing.sqft?.toLocaleString()}</td>
                            <td>{listing.yearBuilt}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </NewsletterPreview>
          </PreviewContainer>
        )}
      </NewsletterContent>
    </NewsletterSection>
  );
};

export default NewsletterGenerator;