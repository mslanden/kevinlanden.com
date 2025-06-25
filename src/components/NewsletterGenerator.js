import React, { useState, useRef } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { FaNewspaper, FaDownload, FaEye, FaChartBar, FaMapMarkedAlt, FaUpload, FaFileAlt, FaSpinner } from 'react-icons/fa';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, LineElement, PointElement, Title, Tooltip, Legend, ArcElement } from 'chart.js';
import { Chart, Doughnut, Bar, Line } from 'react-chartjs-2';
import ChartDataLabels from 'chartjs-plugin-datalabels';

ChartJS.register(CategoryScale, LinearScale, BarElement, LineElement, PointElement, Title, Tooltip, Legend, ArcElement, ChartDataLabels);

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
    
    h4 {
      color: ${props => props.theme.colors.text.secondary};
      margin-bottom: 1rem;
      text-align: center;
      font-family: ${props => props.theme.fonts.heading};
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
  background: white;
  font-family: Arial, sans-serif;
  
  .header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    padding: 1.5rem;
    border-bottom: 2px solid #003366;
    
    .title-section {
      flex: 1;
      
      h1 {
        color: #003366;
        font-size: 1.8rem;
        font-weight: bold;
        margin: 0 0 0.25rem 0;
        text-transform: uppercase;
      }
      
      .location {
        color: #003366;
        font-size: 0.9rem;
        font-weight: normal;
        text-transform: uppercase;
      }
    }
    
    .logo-section {
      text-align: right;
      
      .logo {
        color: #003366;
        font-size: 1.5rem;
        font-weight: bold;
        margin-bottom: 0.25rem;
      }
      
      .tagline {
        color: #666;
        font-size: 0.7rem;
        text-transform: uppercase;
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
        
        h3 {
          color: #003366;
          font-size: 0.9rem;
          font-weight: bold;
          margin-bottom: 0.5rem;
          text-transform: uppercase;
        }
        
        .analysis-text {
          font-size: 0.75rem;
          line-height: 1.4;
          color: #333;
        }
      }
      
      .summary-section {
        h3 {
          color: #003366;
          font-size: 0.9rem;
          font-weight: bold;
          margin-bottom: 0.5rem;
          text-transform: uppercase;
        }
        
        .summary-text {
          font-size: 0.75rem;
          line-height: 1.4;
          color: #333;
        }
      }
    }
    
    .right-column {
      .key-stats {
        h3 {
          color: #003366;
          font-size: 0.9rem;
          font-weight: bold;
          margin-bottom: 0.75rem;
          text-transform: uppercase;
        }
        
        .stats-table {
          width: 100%;
          border-collapse: collapse;
          font-size: 0.7rem;
          
          th {
            background: #f0f0f0;
            padding: 0.4rem 0.5rem;
            text-align: center;
            border: 1px solid #ddd;
            font-weight: bold;
          }
          
          td {
            padding: 0.4rem 0.5rem;
            text-align: center;
            border: 1px solid #ddd;
          }
          
          .year-col {
            background: #f8f8f8;
          }
        }
      }
      
      .buyers-sellers {
        margin-top: 1.5rem;
        text-align: center;
        
        h3 {
          color: #003366;
          font-size: 0.9rem;
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
      
      .chart-title {
        color: #003366;
        font-size: 0.9rem;
        font-weight: bold;
        margin-bottom: 0.75rem;
        text-transform: uppercase;
      }
      
      .chart-grid {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 2rem;
        margin-bottom: 2rem;
      }
      
      .single-chart {
        margin-bottom: 2rem;
        
        .chart-container {
          height: 300px;
          margin-top: 0.5rem;
        }
      }
      
      .chart-item {
        .chart-container {
          height: 200px;
          margin-top: 0.5rem;
        }
      }
    }
    
    .properties-section {
      margin-top: 2rem;
      page-break-inside: avoid;
      
      h3 {
        color: #003366;
        font-size: 0.9rem;
        font-weight: bold;
        margin-bottom: 0.75rem;
        text-transform: uppercase;
      }
      
      .properties-table {
        width: 100%;
        border-collapse: collapse;
        font-size: 0.65rem;
        
        th {
          background: #f0f0f0;
          padding: 0.4rem 0.3rem;
          text-align: left;
          border: 1px solid #ddd;
          font-weight: bold;
        }
        
        td {
          padding: 0.4rem 0.3rem;
          border: 1px solid #ddd;
        }
        
        .mls-col { width: 8%; }
        .status-col { width: 8%; }
        .price-col { width: 12%; }
        .address-col { width: 35%; }
        .beds-col { width: 6%; }
        .baths-col { width: 6%; }
        .sqft-col { width: 8%; }
        .year-col { width: 8%; }
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
    unitSales: '89',
    medianPrice: '$620k',
    inventory: '447',
    daysOnMarket: '63',
    summary: ''
  });
  
  const [showPreview, setShowPreview] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [extractedData, setExtractedData] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
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
          unitSales: data.summary?.unitSales || '',
          medianPrice: data.summary?.medianPrice || '',
          inventory: data.summary?.inventory || '',
          daysOnMarket: data.summary?.daysOnMarket || '',
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
    setIsGenerating(true);
    
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:3001/api'}/newsletter/generate-pdf`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
        },
        body: JSON.stringify({
          newsletterData,
          extractedData
        })
      });
      
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${communities[newsletterData.community]}-Newsletter-${months[newsletterData.month - 1]}-${newsletterData.year}.pdf`;
        a.click();
        window.URL.revokeObjectURL(url);
      } else {
        throw new Error('Failed to generate PDF');
      }
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
      return {
        statusChart: {
          data: {
            labels: ['Active', 'Pending', 'Closed', 'Other'],
            datasets: [{
              data: [statusData.active, statusData.pending, statusData.closed, statusData.other],
              backgroundColor: ['#87CEEB', '#FFD700', '#32CD32', '#FF6347'],
              borderWidth: 2,
              borderColor: '#fff'
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
              backgroundColor: '#4682B4',
              borderColor: '#87CEEB',
              borderWidth: 1
            }]
          },
          options: {
            ...baseOptions,
            responsive: true,
            maintainAspectRatio: true,
            aspectRatio: 2,
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
        } : null
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
            backgroundColor: ['#FFD700', '#32CD32', '#4169E1'],
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
              backgroundColor: '#87CEEB',
              borderColor: '#4682B4',
              borderWidth: 1,
              yAxisID: 'y'
            },
            {
              type: 'line',
              label: 'Median Sale Price',
              data: medianPriceData,
              borderColor: '#FF6347',
              backgroundColor: 'transparent',
              borderWidth: 2,
              pointRadius: 4,
              pointBackgroundColor: '#FF6347',
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
            <FaChartBar />
            Market Statistics
          </h3>
          <FormGrid>
            <InputGroup>
              <label>Unit Sales</label>
              <input 
                type="number"
                value={newsletterData.unitSales}
                onChange={(e) => handleInputChange('unitSales', e.target.value)}
                placeholder="89"
              />
            </InputGroup>
            
            <InputGroup>
              <label>Median Sale Price</label>
              <input 
                type="text"
                value={newsletterData.medianPrice}
                onChange={(e) => handleInputChange('medianPrice', e.target.value)}
                placeholder="$620k"
              />
            </InputGroup>
            
            <InputGroup>
              <label>Inventory</label>
              <input 
                type="number"
                value={newsletterData.inventory}
                onChange={(e) => handleInputChange('inventory', e.target.value)}
                placeholder="447"
              />
            </InputGroup>
            
            <InputGroup>
              <label>Days on Market</label>
              <input 
                type="number"
                value={newsletterData.daysOnMarket}
                onChange={(e) => handleInputChange('daysOnMarket', e.target.value)}
                placeholder="63"
              />
            </InputGroup>
          </FormGrid>
          
          <InputGroup>
            <label>Market Summary</label>
            <textarea 
              value={newsletterData.summary}
              onChange={(e) => handleInputChange('summary', e.target.value)}
              placeholder="Detailed analysis of sales, prices, inventory, and market conditions..."
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
              <div className="header">
                <div className="title-section">
                  <h1>Monthly Market Summary</h1>
                  <div className="location">
                    {communities[newsletterData.community]}, CA - Single Family<br/>
                    {months[newsletterData.month - 1]}, {newsletterData.year}
                  </div>
                </div>
                <div className="logo-section">
                  <div className="logo">CDAR</div>
                  <div className="tagline">Serving the Greater<br/>Palm Springs Area</div>
                </div>
              </div>
              
              <div className="content">
                <div className="main-grid">
                  <div className="left-column">
                    <div className="quick-analysis">
                      <h3>Quick Analysis</h3>
                      <div className="analysis-text">
                        {newsletterData.quickAnalysis || `Market activity in ${communities[newsletterData.community]} shows steady performance with ${newsletterData.unitSales || '89'} unit sales and a median price of ${newsletterData.medianPrice || '$620k'}. Days on market averaging ${newsletterData.daysOnMarket || '63'} days indicates balanced market conditions.`}
                      </div>
                    </div>
                    
                    <div className="summary-section">
                      <h3>Summary</h3>
                      <div className="summary-text">
                        {newsletterData.summary || `Sales activity in ${communities[newsletterData.community]} for ${months[newsletterData.month - 1]} ${newsletterData.year} demonstrates market stability. Inventory levels at ${newsletterData.inventory || '447'} units provide adequate selection for buyers while maintaining pricing strength. Market trends indicate continued steady performance in the region.`}
                      </div>
                    </div>
                  </div>
                  
                  <div className="right-column">
                    <div className="key-stats">
                      <h3>Key Stats</h3>
                      <table className="stats-table">
                        <thead>
                          <tr>
                            <th></th>
                            <th>2023</th>
                            <th>2024</th>
                            <th>Chg</th>
                            <th>Prev Mo</th>
                            <th>Chg</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td className="year-col">Unit Sales</td>
                            <td>89</td>
                            <td>105</td>
                            <td>-15.2%</td>
                            <td>78</td>
                            <td>14.1%</td>
                          </tr>
                          <tr>
                            <td className="year-col">Median Sale Price</td>
                            <td>$620k</td>
                            <td>$630k</td>
                            <td>-4.8%</td>
                            <td>$644k</td>
                            <td>-3.7%</td>
                          </tr>
                          <tr>
                            <td className="year-col">Inventory</td>
                            <td>447</td>
                            <td>389</td>
                            <td>14.9%</td>
                            <td>424</td>
                            <td>5.4%</td>
                          </tr>
                          <tr>
                            <td className="year-col">Months of Supply</td>
                            <td>5.8</td>
                            <td>5.2</td>
                            <td>11.5%</td>
                            <td>6.1</td>
                            <td>-4.9%</td>
                          </tr>
                          <tr>
                            <td className="year-col">Days on Market</td>
                            <td>63</td>
                            <td>52</td>
                            <td>21.2%</td>
                            <td>61</td>
                            <td>3.3%</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                    
                    <div className="buyers-sellers">
                      <h3>Buyers/Sellers Market</h3>
                      <div className="gauge-container">
                        {createChartData()?.marketGauge && (
                          <Doughnut {...createChartData().marketGauge} />
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="charts-section">
                  <div className="single-chart">
                    <div className="chart-title">Unit Sales and Median Prices</div>
                    <div className="chart-container">
                      {createChartData()?.unitSalesChart && (
                        <Chart type="bar" {...createChartData().unitSalesChart} />
                      )}
                    </div>
                  </div>
                  
                  <div className="chart-grid">
                    <div className="chart-item">
                      <div className="chart-title">Inventory</div>
                      <div className="chart-container">
                        {createChartData()?.inventoryChart && (
                          <Bar {...createChartData().inventoryChart} />
                        )}
                      </div>
                    </div>
                    
                    <div className="chart-item">
                      <div className="chart-title">Median Sale Price / Sq Ft</div>
                      <div className="chart-container">
                        {createChartData()?.pricePerSqFtChart && (
                          <Line {...createChartData().pricePerSqFtChart} />
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                
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
                          <th className="year-col">Year</th>
                        </tr>
                      </thead>
                      <tbody>
                        {extractedData.listings.slice(0, 25).map((listing, index) => (
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