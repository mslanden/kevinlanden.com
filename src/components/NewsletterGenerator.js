import React, { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { FaNewspaper, FaDownload, FaEye, FaChartBar, FaMapMarkedAlt, FaFileAlt } from 'react-icons/fa';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, LineElement, PointElement, Title, Tooltip, Legend, ArcElement } from 'chart.js';
import { Doughnut, Bar, Line } from 'react-chartjs-2';
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
  background-color: ${props => {
    if (props.variant === 'preview') return props.theme.colors.secondary;
    if (props.variant === 'edit') return '#28a745';
    return props.theme.colors.primary;
  }};
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
  background: transparent;
  border: none;
  padding: 1rem;
  margin-top: 2rem;
  width: 100%;
  display: flex;
  justify-content: center;
  overflow: visible;
  
  @media (max-width: 768px) {
    padding: 0.5rem;
    margin-top: 1rem;
  }
`;

const NewsletterPreview = styled.div`
  width: 800px; /* Fixed width for consistent capture */
  max-width: 100%;
  background: white;
  font-family: "Poppins", sans-serif;
  border: 1px solid #ddd;
  box-shadow: 0 4px 20px rgba(0,0,0,0.1);
  line-height: 1.6;
  color: #333;
  margin: 0 auto;
  position: relative;
  
  @media (max-width: 900px) {
    width: 95%;
    max-width: calc(100vw - 2rem);
    box-shadow: 0 2px 10px rgba(0,0,0,0.1);
  }
  
  @media (max-width: 768px) {
    width: 100%;
    max-width: calc(100vw - 1rem);
    margin: 0 auto;
    box-shadow: 0 2px 10px rgba(0,0,0,0.1);
  }
  
  /* PDF page break controls matching buyers guide */
  .page-break-avoid {
    page-break-inside: avoid;
    break-inside: avoid;
  }
  
  .page-break-before {
    page-break-before: always !important;
    break-before: page !important;
    page-break-inside: avoid !important;
    break-inside: avoid !important;
  }
  
  /* No page breaks - continuous document */
  .charts-section {
    margin-top: 2rem;
  }
  
  .properties-section {
    margin-top: 2rem;
  }
  
  .page-break-after {
    page-break-after: always;
    break-after: page;
  }
  
  .header {
    background: linear-gradient(135deg, #8b4513 0%, #a0522d 100%);
    color: white;
    text-align: center;
    padding: 3rem 2rem;
    position: relative;
    overflow: hidden;
    
    &::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: url('/images/pdf_cow.png') center/cover;
      opacity: 0.2;
      z-index: 1;
    }
    
    .header-content {
      position: relative;
      z-index: 2;
      text-align: center;
    }
    
    .logo-container {
      width: 200px;
      height: 120px;
      margin: 0 auto 1.5rem;
      display: flex;
      align-items: center;
      justify-content: center;
      
      .hero-logo {
        max-width: 100%;
        max-height: 100%;
        filter: brightness(1.1);
      }
      
      .text-logo {
        font-family: "Bodoni Moda", serif;
        font-size: 2rem;
        font-weight: 700;
        color: white;
        text-transform: uppercase;
        letter-spacing: 2px;
        text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
      }
    }
    
    h1 {
      font-family: "Bodoni Moda", serif;
      font-size: 2.5rem;
      font-weight: 700;
      margin-bottom: 0.5rem;
      text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
      color: white;
    }
    
    .subtitle {
      font-size: 1.1rem;
      opacity: 0.9;
      margin-bottom: 1rem;
    }
    
    .contact-info {
      margin-top: 1.5rem;
      padding-top: 1.5rem;
      border-top: 1px solid rgba(255,255,255,0.3);
      
      h2 {
        font-family: "Bodoni Moda", serif;
        font-size: 1.5rem;
        margin-bottom: 1rem;
        color: white;
        text-shadow: 2px 2px 4px rgba(0,0,0,0.8);
      }
      
      .contact-details {
        display: flex;
        justify-content: center;
        gap: 2rem;
        flex-wrap: wrap;
        
        .contact-item {
          text-align: center;
          
          strong {
            display: block;
            margin-bottom: 0.25rem;
          }
        }
      }
    }
  }
  
  .content {
    padding: 2rem;
    
    h2 {
      font-family: "Bodoni Moda", serif;
      color: #8b4513;
      font-size: 1.8rem;
      margin: 2rem 0 1rem 0;
      padding-bottom: 0.5rem;
      border-bottom: 2px solid #d2b48c;
    }
    
    h3 {
      font-family: "Bodoni Moda", serif;
      color: #a0522d;
      font-size: 1.3rem;
      margin: 1.5rem 0 0.5rem 0;
    }
    
    p {
      margin-bottom: 1rem;
      text-align: justify;
    }
    
    .main-grid {
      display: grid;
      grid-template-columns: 1fr 350px;
      gap: 2rem;
      margin-bottom: 2rem;
      
      @media (max-width: 768px) {
        grid-template-columns: 1fr;
        gap: 1rem;
        margin-bottom: 1rem;
      }
    }
    
    .left-column {
      .quick-analysis {
        background: #f9f9f9;
        border-left: 4px solid #8b4513;
        padding: 1.5rem;
        margin: 1.5rem 0;
        border-radius: 0 8px 8px 0;
        
        h3 {
          margin-top: 0;
          color: #8b4513;
          font-family: "Bodoni Moda", serif;
          font-size: 1.3rem;
        }
        
        .analysis-text {
          font-size: 1rem;
          line-height: 1.6;
          color: #333;
          text-align: justify;
        }
      }
      
      .summary-section {
        background: linear-gradient(135deg, #8b4513 0%, #a0522d 100%);
        color: white;
        padding: 1.5rem;
        border-radius: 8px;
        margin: 1.5rem 0;
        
        h3 {
          color: white;
          margin-top: 0;
          font-family: "Bodoni Moda", serif;
          font-size: 1.3rem;
        }
        
        .summary-text {
          font-size: 1rem;
          line-height: 1.6;
          color: white;
          text-align: justify;
        }
      }
    }
    
    .right-column {
      .key-stats {
        background: #f8f8f8;
        border: 1px solid #e0e0e0;
        padding: 1.5rem;
        border-radius: 8px;
        
        h3 {
          color: #8b4513;
          font-family: "Bodoni Moda", serif;
          font-size: 1.3rem;
          margin-top: 0;
          margin-bottom: 1rem;
        }
        
        .stats-table {
          width: 100%;
          border-collapse: collapse;
          font-size: 0.9rem;
          
          th {
            background: #8b4513;
            color: white;
            padding: 0.8rem;
            text-align: left;
            font-weight: 600;
            font-size: 0.9rem;
          }
          
          td {
            padding: 0.8rem;
            border-bottom: 1px solid #e0e0e0;
            color: #333;
          }
          
          .year-col {
            background: #f8f8f8;
            font-weight: 600;
            color: #8b4513;
          }
          
          tr:hover {
            background: #f0f0f0;
          }
        }
      }
      
      .buyers-sellers {
        margin-top: 1.5rem;
        background: #f8f8f8;
        border: 1px solid #e0e0e0;
        padding: 1.5rem;
        border-radius: 8px;
        
        h3 {
          color: #8b4513;
          font-family: "Bodoni Moda", serif;
          font-size: 1.3rem;
          margin-top: 0;
          margin-bottom: 1rem;
          text-align: center;
        }
        
        .gauge-container {
          height: 180px;
          display: flex;
          justify-content: center;
          align-items: center;
        }
      }
    }
    
    .charts-section {
      margin-top: 2rem;
      
      h2 {
        font-family: "Bodoni Moda", serif;
        color: #8b4513;
        font-size: 1.8rem;
        margin: 2rem 0 1rem 0;
        padding-bottom: 0.5rem;
        border-bottom: 2px solid #d2b48c;
        text-align: center;
      }
      
      .chart-title {
        color: #8b4513;
        font-family: "Bodoni Moda", serif;
        font-size: 1.3rem;
        margin-bottom: 1rem;
        text-align: center;
      }
      
      .chart-grid {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 2rem;
        margin-bottom: 2rem;
        
        @media (max-width: 768px) {
          grid-template-columns: 1fr;
          gap: 1rem;
          margin-bottom: 1rem;
        }
      }
      
      .single-chart {
        margin-bottom: 2rem;
        background: #f9f9f9;
        border-left: 4px solid #8b4513;
        padding: 1.5rem;
        border-radius: 0 8px 8px 0;
        
        .chart-container {
          height: 300px;
          margin-top: 1rem;
        }
      }
      
      .chart-item {
        background: #f8f8f8;
        border: 1px solid #e0e0e0;
        padding: 1.5rem;
        border-radius: 8px;
        
        .chart-container {
          height: 220px;
          margin-top: 1rem;
        }
      }
    }
    
    .properties-section {
      margin-top: 2rem;
      page-break-inside: avoid;
      
      h3 {
        color: #8b4513;
        font-family: "Bodoni Moda", serif;
        font-size: 1.8rem;
        margin: 2rem 0 1rem 0;
        padding-bottom: 0.5rem;
        border-bottom: 2px solid #d2b48c;
        text-align: center;
      }
      
      .properties-table {
        width: 100%;
        border-collapse: collapse;
        font-size: 0.8rem;
        margin-top: 1rem;
        
        @media (max-width: 768px) {
          font-size: 0.7rem;
          overflow-x: auto;
          display: block;
          white-space: nowrap;
        }
        
        th {
          background: #8b4513;
          color: white;
          padding: 0.8rem 0.5rem;
          text-align: left;
          font-weight: 600;
          font-size: 0.8rem;
          border-bottom: 1px solid #a0522d;
          
          @media (max-width: 768px) {
            padding: 0.5rem 0.3rem;
            font-size: 0.7rem;
          }
        }
        
        td {
          padding: 0.7rem 0.5rem;
          border-bottom: 1px solid #e0e0e0;
          color: #333;
          
          @media (max-width: 768px) {
            padding: 0.4rem 0.3rem;
          }
        }
        
        tr:nth-child(even) {
          background: #f8f8f8;
        }
        
        tr:hover {
          background: #f0f0f0;
        }
        
        .mls-col { width: 8%; text-align: center; }
        .status-col { width: 8%; text-align: center; }
        .price-col { width: 12%; font-weight: 600; color: #8b4513; text-align: right; }
        .address-col { width: 35%; }
        .beds-col { width: 6%; text-align: center; }
        .baths-col { width: 6%; text-align: center; }
        .sqft-col { width: 10%; text-align: right; }
        .year-col { width: 8%; text-align: center; }
        
        @media (max-width: 768px) {
          .mls-col { width: 10%; }
          .status-col { width: 10%; }
          .price-col { width: 15%; }
          .address-col { width: 30%; }
          .beds-col { width: 8%; }
          .baths-col { width: 8%; }
          .sqft-col { width: 12%; }
          .year-col { width: 10%; }
        }
      }
    }
    
    /* Print-specific styles matching buyers guide */
    @media print {
      background: white !important;
      font-size: 12pt;
      line-height: 1.4;
      
      .header {
        background: white !important;
        color: #333 !important;
        padding: 1rem !important;
        page-break-inside: avoid;
      }
      
      h1 {
        color: #8b4513 !important;
        font-size: 24pt !important;
        text-shadow: none !important;
      }
      
      h2 {
        color: #8b4513 !important;
        font-size: 16pt !important;
        page-break-after: avoid;
        margin-top: 1.5rem !important;
      }
      
      h3 {
        color: #a0522d !important;
        font-size: 14pt !important;
        page-break-after: avoid;
      }
      
      .quick-analysis,
      .summary-section,
      .chart-item,
      .single-chart {
        background: white !important;
        border: 1px solid #ddd !important;
        color: #333 !important;
        page-break-inside: avoid;
        margin: 1rem 0 !important;
      }
      
      .properties-table th {
        background: #8b4513 !important;
        color: white !important;
      }
      
      .properties-table tr:nth-child(even) {
        background: #f8f8f8 !important;
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
  const [extractedData, setExtractedData] = useState(null);
  const [logoError, setLogoError] = useState(false);
  const [marketData, setMarketData] = useState({
    pricePerSqft: [],
    daysOnMarket: []
  });
  const [editableData, setEditableData] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const previewRef = useRef();

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
  
  // Fetch initial market data
  useEffect(() => {
    fetchMarketData();
  }, []);
  
  // Re-fetch data when community, month, or year changes
  useEffect(() => {
    fetchMarketData();
  }, [newsletterData.community, newsletterData.month, newsletterData.year]);
  
  // Debug when marketData changes
  useEffect(() => {
    console.log('MarketData state updated:', marketData);
    console.log('Charts should render if data > 0:', {
      priceLength: marketData.pricePerSqft?.length || 0,
      daysLength: marketData.daysOnMarket?.length || 0
    });
  }, [marketData]);
  
  // Create chart data matching MLS format
  const createChartData = useCallback(() => {
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

    // Define months array for chart labels
    const chartMonths = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];

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
                backgroundColor: ['#b8860b', '#daa520', '#8b4513'], // Better contrast: dark goldenrod, goldenrod, saddle brown
                borderWidth: 2,
                borderColor: '#fff',
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
        
        // Removed Current Market Status Distribution chart as requested
        
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
        })(),
        
        // Market Data Trend Charts (using marketData from backend)
        pricePerSqftTrendChart: (() => {
          const hasData = marketData.pricePerSqft && marketData.pricePerSqft.length > 0;
          console.log('Price per sqft chart creation:', { hasData, dataLength: marketData.pricePerSqft?.length });
          return hasData ? {
            data: {
              labels: marketData.pricePerSqft.map(item => 
                `${chartMonths[item.month - 1] ? chartMonths[item.month - 1].substring(0, 3) : 'Unknown'} ${item.year}`
              ),
              datasets: [{
                label: 'Price per Sq Ft',
                data: marketData.pricePerSqft.map(item => item.price_per_sqft),
                borderColor: '#8b4513',
                backgroundColor: 'rgba(139, 69, 19, 0.1)',
                borderWidth: 2,
                pointRadius: 4,
                pointBackgroundColor: '#8b4513',
                tension: 0.1
              }]
            },
            options: {
              ...baseOptions,
              responsive: true,
              maintainAspectRatio: false,
              scales: {
                x: {
                  grid: { display: false },
                  ticks: { font: { size: 10 }, color: '#333' }
                },
                y: {
                  grid: { color: '#e0e0e0' },
                  ticks: { 
                    font: { size: 10 }, 
                    color: '#333',
                    callback: function(value) {
                      return '$' + value;
                    }
                  }
                }
              },
              plugins: {
                ...baseOptions.plugins,
                title: {
                  display: true,
                  text: 'Price per Sq Ft',
                  font: { size: 12 },
                  color: '#333'
                }
              }
            }
          } : null;
        })(),
        
        medianSoldPriceChart: (() => {
          const hasData = marketData.pricePerSqft && marketData.pricePerSqft.length > 0;
          console.log('Median sold price chart creation:', { hasData, dataLength: marketData.pricePerSqft?.length });
          return hasData ? {
            data: {
              labels: marketData.pricePerSqft.map(item => 
                `${chartMonths[item.month - 1] ? chartMonths[item.month - 1].substring(0, 3) : 'Unknown'} ${item.year}`
              ),
              datasets: [{
                label: 'Median Sold Price',
                data: marketData.pricePerSqft.map(item => item.average_price || 0),
                borderColor: '#8b4513',
                backgroundColor: 'rgba(139, 69, 19, 0.1)',
                borderWidth: 2,
                pointRadius: 4,
                pointBackgroundColor: '#8b4513',
                tension: 0.1
              }]
            },
            options: {
              ...baseOptions,
              responsive: true,
              maintainAspectRatio: false,
              scales: {
                x: {
                  grid: { display: false },
                  ticks: { font: { size: 10 }, color: '#333' }
                },
                y: {
                  grid: { color: '#e0e0e0' },
                  ticks: { 
                    font: { size: 10 }, 
                    color: '#333',
                    callback: function(value) {
                      return '$' + (value / 1000).toFixed(0) + 'k';
                    }
                  }
                }
              },
              plugins: {
                ...baseOptions.plugins,
                title: {
                  display: true,
                  text: 'Median Sold Price',
                  font: { size: 12 },
                  color: '#333'
                }
              }
            }
          } : null;
        })(),
        
        daysOnMarketTrendChart: (() => {
          const hasData = marketData.daysOnMarket && marketData.daysOnMarket.length > 0;
          console.log('Days on market chart creation:', { hasData, dataLength: marketData.daysOnMarket?.length });
          return hasData ? {
            data: {
              labels: marketData.daysOnMarket.map(item => 
                `${chartMonths[item.month - 1] ? chartMonths[item.month - 1].substring(0, 3) : 'Unknown'} ${item.year}`
              ),
              datasets: [{
                label: 'Average Days on Market',
                data: marketData.daysOnMarket.map(item => item.average_days_on_market),
                borderColor: '#8b4513',
                backgroundColor: 'rgba(139, 69, 19, 0.1)',
                borderWidth: 2,
                pointRadius: 4,
                pointBackgroundColor: '#8b4513',
                tension: 0.1
              }]
            },
            options: {
              ...baseOptions,
              responsive: true,
              maintainAspectRatio: false,
              scales: {
                x: {
                  grid: { display: false },
                  ticks: { font: { size: 10 }, color: '#333' }
                },
                y: {
                  grid: { color: '#e0e0e0' },
                  ticks: { 
                    font: { size: 10 }, 
                    color: '#333',
                    callback: function(value) {
                      return value + ' days';
                    }
                  }
                }
              },
              plugins: {
                ...baseOptions.plugins,
                title: {
                  display: true,
                  text: 'Average Days on Market',
                  font: { size: 12 },
                  color: '#333'
                }
              }
            }
          } : null;
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
      },
      
      // New: Price per Sq Ft 6-Month Trend Chart
      pricePerSqftTrendChart: (() => {
        const hasData = marketData.pricePerSqft && marketData.pricePerSqft.length > 0;
        console.log('Price per sqft chart creation:', { hasData, dataLength: marketData.pricePerSqft?.length });
        return hasData ? {
          data: {
            labels: marketData.pricePerSqft.map(item => 
              `${chartMonths[item.month - 1] ? chartMonths[item.month - 1].substring(0, 3) : 'Unknown'} ${item.year}`
            ),
            datasets: [{
              label: 'Price per Sq Ft',
              data: marketData.pricePerSqft.map(item => item.price_per_sqft),
              borderColor: '#8b4513',
              backgroundColor: 'rgba(139, 69, 19, 0.1)',
              borderWidth: 2,
              pointRadius: 4,
              pointBackgroundColor: '#8b4513',
              tension: 0.1
            }]
          },
          options: {
            ...baseOptions,
            responsive: true,
            maintainAspectRatio: false,
            scales: {
              x: {
                grid: { display: false },
                ticks: { font: { size: 10 }, color: '#333' }
              },
              y: {
                grid: { color: '#e0e0e0' },
                ticks: { 
                  font: { size: 10 }, 
                  color: '#333',
                  callback: function(value) {
                    return '$' + value;
                  }
                }
              }
            },
            plugins: {
              ...baseOptions.plugins,
              title: {
                display: true,
                text: 'Price per Sq Ft',
                font: { size: 12 },
                color: '#333'
              }
            }
          }
        } : null;
      })(),
      
      // New: Median Sold Price Chart
      medianSoldPriceChart: (() => {
        const hasData = marketData.pricePerSqft && marketData.pricePerSqft.length > 0;
        console.log('Median sold price chart creation:', { hasData, dataLength: marketData.pricePerSqft?.length });
        return hasData ? {
          data: {
            labels: marketData.pricePerSqft.map(item => 
              `${chartMonths[item.month - 1] ? chartMonths[item.month - 1].substring(0, 3) : 'Unknown'} ${item.year}`
            ),
            datasets: [{
              label: 'Median Sold Price',
              data: marketData.pricePerSqft.map(item => item.average_price || 0),
              borderColor: '#8b4513',
              backgroundColor: 'rgba(139, 69, 19, 0.1)',
              borderWidth: 2,
              pointRadius: 4,
              pointBackgroundColor: '#8b4513',
              tension: 0.1
            }]
          },
          options: {
            ...baseOptions,
            responsive: true,
            maintainAspectRatio: false,
            scales: {
              x: {
                grid: { display: false },
                ticks: { font: { size: 10 }, color: '#333' }
              },
              y: {
                grid: { color: '#e0e0e0' },
                ticks: { 
                  font: { size: 10 }, 
                  color: '#333',
                  callback: function(value) {
                    return '$' + (value / 1000).toFixed(0) + 'k';
                  }
                }
              }
            },
            plugins: {
              ...baseOptions.plugins,
              title: {
                display: true,
                text: 'Median Sold Price',
                font: { size: 12 },
                color: '#333'
              }
            }
          }
        } : null;
      })(),
      
      // New: Average Days on Market Chart
      daysOnMarketTrendChart: (() => {
        const hasData = marketData.daysOnMarket && marketData.daysOnMarket.length > 0;
        console.log('Days on market chart creation:', { hasData, dataLength: marketData.daysOnMarket?.length });
        return hasData ? {
          data: {
            labels: marketData.daysOnMarket.map(item => 
              `${chartMonths[item.month - 1] ? chartMonths[item.month - 1].substring(0, 3) : 'Unknown'} ${item.year}`
            ),
            datasets: [{
              label: 'Average Days on Market',
              data: marketData.daysOnMarket.map(item => item.average_days_on_market),
              borderColor: '#8b4513',
              backgroundColor: 'rgba(139, 69, 19, 0.1)',
              borderWidth: 2,
              pointRadius: 4,
              pointBackgroundColor: '#8b4513',
              tension: 0.1
            }]
          },
          options: {
            ...baseOptions,
            responsive: true,
            maintainAspectRatio: false,
            scales: {
              x: {
                grid: { display: false },
                ticks: { font: { size: 10 }, color: '#333' }
              },
              y: {
                grid: { color: '#e0e0e0' },
                ticks: { 
                  font: { size: 10 }, 
                  color: '#333',
                  callback: function(value) {
                    return value + ' days';
                  }
                }
              }
            },
            plugins: {
              ...baseOptions.plugins,
              title: {
                display: true,
                text: 'Average Days on Market',
                font: { size: 12 },
                color: '#333'
              }
            }
          }
        } : null;
      })()
    };
  }, [marketData, extractedData, newsletterData.unitSales, newsletterData.inventory]);
  
  // Memoize chart data to prevent excessive re-calculations
  const chartData = useMemo(() => {
    console.log('Creating chart data - memoized');
    return createChartData();
  }, [createChartData]);

  const handleInputChange = (field, value) => {
    setNewsletterData(prev => ({
      ...prev,
      [field]: value
    }));
  };
  
  const handleTokenExpiration = () => {
    // Clear token and redirect to login
    localStorage.removeItem('adminToken');
    alert('Your session has expired. Please log in again.');
    window.location.href = '/admin'; // Redirect to admin login
  };

  const fetchMarketData = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:3001/api'}/market-data/newsletter-data?community=${newsletterData.community}&month=${newsletterData.month}&year=${newsletterData.year}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
        }
      });
      
      if (response.status === 401) {
        handleTokenExpiration();
        return;
      }
      
      if (response.ok) {
        const result = await response.json();
        const newMarketData = {
          pricePerSqft: result.data.pricePerSqft || [],
          daysOnMarket: result.data.daysOnMarket || []
        };
        setMarketData(newMarketData);
        
        console.log('Setting new market data:', newMarketData);
        console.log('New price per sqft length:', newMarketData.pricePerSqft.length);
        console.log('New days on market length:', newMarketData.daysOnMarket.length);
        
        // Set extracted data with MLS listings for newsletter preview
        if (result.data.mlsListings && result.data.mlsListings.length > 0) {
          setExtractedData({
            listings: result.data.mlsListings.map(listing => ({
              mls: listing.mls_number || listing.mls,
              status: listing.status,
              price: listing.price ? `$${listing.price.toLocaleString()}` : 'N/A',
              address: listing.address,
              beds: listing.beds,
              baths: listing.baths,
              sqft: listing.sqft,
              daysInMarket: listing.days_in_market,
              yearBuilt: listing.year_built
            })),
            summary: {
              quickAnalysis: `Market data for ${result.data.community} showing ${result.data.mlsListings.length} property listings for ${newsletterData.month}/${newsletterData.year}.`
            },
            statusSummary: {
              active: result.data.mlsListings.filter(l => l.status === 'active').length,
              pending: result.data.mlsListings.filter(l => l.status === 'pending').length,
              closed: result.data.mlsListings.filter(l => ['closed', 'sold'].includes(l.status)).length,
              other: result.data.mlsListings.filter(l => !['active', 'pending', 'closed', 'sold'].includes(l.status)).length
            }
          });
        } else {
          console.log('No MLS listings found for the selected period');
          setExtractedData(null);
        }
        
        console.log('Market data fetched for community:', newsletterData.community, result.data);
      } else {
        console.error('Failed to fetch market data:', response.status, response.statusText);
      }
    } catch (error) {
      console.error('Error fetching market data:', error);
    }
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

      console.log('Starting PDF generation with html2canvas...');

      // Create PDF
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
        compress: true
      });

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const margin = 10;
      const contentWidth = pdfWidth - (2 * margin);

      // Wait for all images to load
      const images = element.querySelectorAll('img');
      console.log(`Found ${images.length} images, waiting for them to load...`);
      
      await Promise.all(Array.from(images).map(img => {
        if (img.complete) return Promise.resolve();
        return new Promise((resolve) => {
          img.onload = resolve;
          img.onerror = resolve;
          setTimeout(resolve, 2000);
        });
      }));

      console.log('All images loaded, capturing canvas...');

      // Capture the element as canvas
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
        logging: false,
        windowWidth: 1200,
        windowHeight: element.scrollHeight,
        onclone: (clonedDoc) => {
          // Ensure all styles are copied
          const originalStyles = document.head.querySelectorAll('style, link[rel="stylesheet"]');
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

          // Find the newsletter preview element and optimize for PDF
          const previewElement = clonedDoc.querySelector('[class*="NewsletterPreview"]');
          if (previewElement) {
            previewElement.style.width = '750px';
            previewElement.style.maxWidth = 'none';
            previewElement.style.margin = '0 auto';
            previewElement.style.padding = '20px';
            previewElement.style.backgroundColor = '#ffffff';
            previewElement.style.color = '#333333';
            previewElement.style.fontSize = '14px';
            previewElement.style.lineHeight = '1.5';
          }

          // Ensure charts are visible
          const charts = clonedDoc.querySelectorAll('canvas');
          charts.forEach(chart => {
            chart.style.maxWidth = '100%';
            chart.style.height = 'auto';
          });

          // Optimize tables
          const tables = clonedDoc.querySelectorAll('table');
          tables.forEach(table => {
            table.style.width = '100%';
            table.style.fontSize = '12px';
          });
        }
      });

      // Convert canvas to image and add to PDF
      const imgData = canvas.toDataURL('image/jpeg', 0.95);
      const imgWidth = contentWidth;
      const imgHeight = (canvas.height * contentWidth) / canvas.width;
      
      // Check if we need multiple pages
      const totalPages = Math.ceil(imgHeight / (pdfHeight - 2 * margin));
      
      for (let i = 0; i < totalPages; i++) {
        if (i > 0) {
          pdf.addPage();
        }
        
        const yOffset = -(i * (pdfHeight - 2 * margin));
        pdf.addImage(imgData, 'JPEG', margin, margin + yOffset, imgWidth, imgHeight);
      }

      // Generate filename and save
      const community = communities[newsletterData.community] || 'Unknown';
      const month = months[newsletterData.month - 1] || 'Unknown';
      const year = newsletterData.year;
      const filename = `${community}-Newsletter-${month}-${year}.pdf`;
      
      pdf.save(filename);
      console.log('PDF generated and downloaded successfully!');

    } catch (error) {
      console.error('Error generating PDF:', error);
      alert(`Error generating PDF: ${error.message}. Please check the console for details and try again.`);
    } finally {
      setIsGenerating(false);
    }
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

        {/* MLS Data Information */}
        <FormSection style={{ backgroundColor: 'rgba(72, 133, 237, 0.1)', border: '1px solid #4885ed' }}>
          <h3 style={{ color: '#4885ed' }}>
            <FaFileAlt />
            MLS Data Information
          </h3>
          <p style={{ color: '#a0a0a0', margin: 0, lineHeight: '1.6' }}>
            📋 <strong>MLS data is now managed separately!</strong> To upload and process MLS reports, 
            please go to the <strong>Market Data Manager</strong> section above. Once uploaded there, 
            the data will automatically be available for newsletter generation and charts will populate based on your selected community, month, and year.
          </p>
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
                        <th>DIM</th>
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
                          <td>{listing.daysInMarket || listing.dim || 'N/A'}</td>
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

        {/* Editable Data Section */}
        {isEditing && (
          <div style={{
            backgroundColor: 'rgba(40, 167, 69, 0.1)',
            border: '1px solid #28a745',
            borderRadius: '8px',
            padding: '1.5rem',
            marginTop: '2rem'
          }}>
            <h3 style={{ color: '#28a745', marginBottom: '1rem' }}>Edit Newsletter Data</h3>
            
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '1rem',
              marginBottom: '1rem'
            }}>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#333' }}>
                  Quick Analysis
                </label>
                <textarea
                  value={newsletterData.quickAnalysis}
                  onChange={(e) => handleInputChange('quickAnalysis', e.target.value)}
                  style={{
                    width: '100%',
                    minHeight: '100px',
                    padding: '0.75rem',
                    border: '1px solid #ddd',
                    borderRadius: '4px',
                    fontSize: '0.9rem'
                  }}
                  placeholder="Enter market analysis..."
                />
              </div>
              
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#333' }}>
                  Summary
                </label>
                <textarea
                  value={newsletterData.summary}
                  onChange={(e) => handleInputChange('summary', e.target.value)}
                  style={{
                    width: '100%',
                    minHeight: '100px',
                    padding: '0.75rem',
                    border: '1px solid #ddd',
                    borderRadius: '4px',
                    fontSize: '0.9rem'
                  }}
                  placeholder="Enter summary..."
                />
              </div>
            </div>
            
            {/* Market Data Editing */}
            {marketData.pricePerSqft.length > 0 && (
              <div>
                <h4 style={{ color: '#28a745', marginBottom: '1rem' }}>Edit Market Data</h4>
                <div style={{ overflowX: 'auto' }}>
                  <table style={{
                    width: '100%',
                    borderCollapse: 'collapse',
                    fontSize: '0.85rem'
                  }}>
                    <thead>
                      <tr style={{ backgroundColor: '#f8f9fa' }}>
                        <th style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'left' }}>Month</th>
                        <th style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'left' }}>Location</th>
                        <th style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'right' }}>Price/Sq Ft</th>
                        <th style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'right' }}>Avg Price</th>
                        <th style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'right' }}>Total Sales</th>
                      </tr>
                    </thead>
                    <tbody>
                      {marketData.pricePerSqft
                        .filter(item => item.location === newsletterData.community)
                        .map((item, index) => (
                        <tr key={`edit-${item.location}-${item.month}-${item.year}`}>
                          <td style={{ border: '1px solid #ddd', padding: '8px' }}>
                            {months[item.month - 1]} {item.year}
                          </td>
                          <td style={{ border: '1px solid #ddd', padding: '8px', textTransform: 'capitalize' }}>
                            {item.location.replace('_', ' ')}
                          </td>
                          <td style={{ border: '1px solid #ddd', padding: '4px' }}>
                            <input
                              type="number"
                              value={editableData[`price_${index}`] || item.price_per_sqft}
                              onChange={(e) => setEditableData(prev => ({
                                ...prev,
                                [`price_${index}`]: e.target.value
                              }))}
                              style={{
                                width: '80px',
                                padding: '4px',
                                border: '1px solid #ccc',
                                borderRadius: '3px',
                                textAlign: 'right'
                              }}
                            />
                          </td>
                          <td style={{ border: '1px solid #ddd', padding: '4px' }}>
                            <input
                              type="number"
                              value={editableData[`avgprice_${index}`] || item.average_price || ''}
                              onChange={(e) => setEditableData(prev => ({
                                ...prev,
                                [`avgprice_${index}`]: e.target.value
                              }))}
                              style={{
                                width: '100px',
                                padding: '4px',
                                border: '1px solid #ccc',
                                borderRadius: '3px',
                                textAlign: 'right'
                              }}
                            />
                          </td>
                          <td style={{ border: '1px solid #ddd', padding: '4px' }}>
                            <input
                              type="number"
                              value={editableData[`sales_${index}`] || item.total_sales || ''}
                              onChange={(e) => setEditableData(prev => ({
                                ...prev,
                                [`sales_${index}`]: e.target.value
                              }))}
                              style={{
                                width: '60px',
                                padding: '4px',
                                border: '1px solid #ccc',
                                borderRadius: '3px',
                                textAlign: 'right'
                              }}
                            />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}

        <ActionButtons>
          <ActionButton variant="edit" onClick={() => setIsEditing(!isEditing)}>
            <FaFileAlt />
            {isEditing ? 'Save Edits' : 'Edit Data'}
          </ActionButton>
          
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
                <div className="header-content">
                  <div className="logo-container">
                    {!logoError ? (
                      <img 
                        src="/logo/logo_2.png" 
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
                  <h1>Monthly Market Summary</h1>
                  <p className="subtitle">
                    {communities[newsletterData.community]}, CA - Single Family | {months[newsletterData.month - 1]} {newsletterData.year}
                  </p>
                  
                  <div className="contact-info">
                    <h2>Outrider Real Estate</h2>
                    <div className="contact-details">
                      <div className="contact-item">
                        <strong>Phone</strong>
                        (951) 491-4890
                      </div>
                      <div className="contact-item">
                        <strong>Email</strong>
                        kevin@outriderrealestate.com
                      </div>
                      <div className="contact-item">
                        <strong>Website</strong>
                        outriderrealestate.com
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="content">
                <div className="main-grid">
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
                            <td className="year-col">Price per Sq Ft</td>
                            <td>${marketData.pricePerSqft.find(item => 
                              item.location === newsletterData.community && 
                              item.month === newsletterData.month && 
                              item.year === newsletterData.year
                            )?.price_per_sqft || 'N/A'}</td>
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
                            <td>${marketData.pricePerSqft.find(item => 
                              item.location === newsletterData.community && 
                              item.month === newsletterData.month && 
                              item.year === newsletterData.year
                            )?.average_price ? Math.round(marketData.pricePerSqft.find(item => 
                              item.location === newsletterData.community && 
                              item.month === newsletterData.month && 
                              item.year === newsletterData.year
                            ).average_price).toLocaleString() : (extractedData?.summary?.medianPrice || newsletterData.medianPrice || 'N/A')}</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                    
                    <div className="buyers-sellers">
                      <h3>Buyers/Sellers Market</h3>
                      <div className="gauge-container">
                        {chartData?.marketGauge && (
                          <Doughnut {...chartData.marketGauge} />
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="charts-section">
                  {/* Full width chart for Average Days on Market */}
                  {(() => {
                    const hasChart = !!chartData?.daysOnMarketTrendChart;
                    console.log('Rendering days on market chart:', { hasChart, chartData: !!chartData });
                    return hasChart;
                  })() && (
                    <div className="chart-item page-break-avoid" style={{ width: '100%', marginBottom: '2rem' }}>
                      <div className="chart-title">Average Days on Market - 6 Month Trend</div>
                      <div className="chart-container">
                        <Line {...chartData.daysOnMarketTrendChart} />
                      </div>
                    </div>
                  )}
                  
                  {/* Two charts in grid layout */}
                  {(chartData?.medianSoldPriceChart || chartData?.pricePerSqftTrendChart) && (
                    <div className="chart-grid">
                      {chartData?.medianSoldPriceChart && (
                        <div className="chart-item page-break-avoid">
                          <div className="chart-title">Median Sold Price - 6 Month Trend</div>
                          <div className="chart-container">
                            <Line {...chartData.medianSoldPriceChart} />
                          </div>
                        </div>
                      )}
                      
                      {chartData?.pricePerSqftTrendChart && (
                        <div className="chart-item page-break-avoid">
                          <div className="chart-title">Price per Sq Ft - 6 Month Trend</div>
                          <div className="chart-container">
                            <Line {...chartData.pricePerSqftTrendChart} />
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
                
                {/* Market Data Table - Outside charts section to appear on same page as charts */}
                {marketData.pricePerSqft.filter(item => item.location === newsletterData.community).length > 0 ? (
                  <div className="market-data-table-section page-break-avoid" style={{ marginTop: '2rem' }}>
                    <h3>Market Data - Last 6 Months</h3>
                    <table className="market-data-table" style={{
                      width: '100%',
                      borderCollapse: 'collapse',
                      marginTop: '1rem',
                      fontSize: '0.85rem'
                    }}>
                      <thead>
                        <tr style={{ backgroundColor: '#f8f9fa' }}>
                          <th style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'left' }}>Month</th>
                          <th style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'left' }}>Location</th>
                          <th style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'right' }}>Price/Sq Ft</th>
                          <th style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'right' }}>Avg Price</th>
                          <th style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'right' }}>Total Sales</th>
                          <th style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'right' }}>Avg Days on Market</th>
                        </tr>
                      </thead>
                      <tbody>
                        {marketData.pricePerSqft
                          .filter(item => item.location === newsletterData.community)
                          .map((priceItem, index) => {
                          const daysItem = marketData.daysOnMarket.find(d => 
                            d.location === priceItem.location && 
                            d.month === priceItem.month && 
                            d.year === priceItem.year
                          );
                          
                          // Use edited values if available, otherwise use original values
                          const pricePerSqft = editableData[`price_${index}`] || priceItem.price_per_sqft;
                          const avgPrice = editableData[`avgprice_${index}`] || priceItem.average_price;
                          const totalSales = editableData[`sales_${index}`] || priceItem.total_sales;
                          
                          return (
                            <tr key={`${priceItem.location}-${priceItem.month}-${priceItem.year}`}>
                              <td style={{ border: '1px solid #ddd', padding: '8px' }}>
                                {months[priceItem.month - 1]} {priceItem.year}
                              </td>
                              <td style={{ border: '1px solid #ddd', padding: '8px', textTransform: 'capitalize' }}>
                                {priceItem.location.replace('_', ' ')}
                              </td>
                              <td style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'right' }}>
                                ${pricePerSqft}
                              </td>
                              <td style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'right' }}>
                                {avgPrice ? `$${parseInt(avgPrice).toLocaleString()}` : 'N/A'}
                              </td>
                              <td style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'right' }}>
                                {totalSales || 'N/A'}
                              </td>
                              <td style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'right' }}>
                                {daysItem?.average_days_on_market || 'N/A'}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="market-data-table-section page-break-avoid" style={{ marginTop: '2rem', textAlign: 'center', padding: '2rem' }}>
                    <p style={{ color: '#a0522d', fontSize: '1.1rem' }}>
                      No market data available for {communities[newsletterData.community]} in the last 6 months.
                    </p>
                  </div>
                )}
                
                {extractedData?.listings && (
                  <div className="properties-section">
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
                          <th className="dim-col">DIM</th>
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
                            <td>{listing.daysInMarket || listing.dim || 'N/A'}</td>
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