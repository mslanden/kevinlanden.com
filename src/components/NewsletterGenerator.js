import React, { useState, useRef } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { FaNewspaper, FaDownload, FaEye, FaChartBar, FaMapMarkedAlt, FaUpload, FaFileAlt, FaSpinner } from 'react-icons/fa';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, LineElement, PointElement, Title, Tooltip, Legend, ArcElement } from 'chart.js';
import { Chart, Doughnut, Bar, Line } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, BarElement, LineElement, PointElement, Title, Tooltip, Legend, ArcElement);

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
  font-family: 'Poppins', sans-serif;
  min-height: 400px;
  box-shadow: 0 10px 30px rgba(0,0,0,0.3);
`;

const NewsletterPreview = styled.div`
  max-width: 800px;
  margin: 0 auto;
  background: white;
  
  .header {
    background: linear-gradient(135deg, #8b4513 0%, #a0522d 100%);
    color: white;
    text-align: center;
    padding: 2rem;
    position: relative;
    
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
    }
    
    h1 {
      font-family: 'Bodoni Moda', serif;
      font-size: 2.5rem;
      margin-bottom: 0.5rem;
      text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
    }
    
    .location {
      font-size: 1.1rem;
      opacity: 0.9;
    }
  }
  
  .content {
    padding: 2rem;
    
    .section {
      margin-bottom: 2rem;
      
      h2 {
        color: #8b4513;
        font-family: 'Bodoni Moda', serif;
        font-size: 1.5rem;
        margin-bottom: 1rem;
        border-bottom: 2px solid #d2b48c;
        padding-bottom: 0.5rem;
      }
      
      .stats-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        gap: 1rem;
        margin: 1rem 0;
      }
      
      .stat-card {
        background: #f8f8f8;
        padding: 1rem;
        border-radius: 8px;
        text-align: center;
        border: 1px solid #e0e0e0;
        
        .value {
          font-size: 1.5rem;
          font-weight: bold;
          color: #8b4513;
        }
        
        .label {
          color: #666;
          font-size: 0.9rem;
        }
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
    unitSales: '',
    medianPrice: '',
    inventory: '',
    daysOnMarket: '',
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
      const response = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:3001/api'}/newsletter/process-mls`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
        },
        body: formData
      });
      
      if (response.ok) {
        const data = await response.json();
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

  // Create chart data from extracted MLS data
  const createChartData = () => {
    if (!extractedData) return null;
    
    const chartOptions = {
      responsive: true,
      plugins: {
        legend: {
          labels: {
            color: '#d2b48c'
          }
        }
      },
      scales: {
        x: {
          ticks: { color: '#d2b48c' },
          grid: { color: 'rgba(210, 180, 140, 0.2)' }
        },
        y: {
          ticks: { color: '#d2b48c' },
          grid: { color: 'rgba(210, 180, 140, 0.2)' }
        }
      }
    };

    return {
      statusChart: {
        data: {
          labels: ['Active', 'Pending', 'Closed', 'Other'],
          datasets: [{
            data: [
              extractedData.statusSummary?.active || 0,
              extractedData.statusSummary?.pending || 0,
              extractedData.statusSummary?.closed || 0,
              extractedData.statusSummary?.other || 0
            ],
            backgroundColor: [
              '#8b4513',
              '#d2b48c',
              '#a0522d',
              '#deb887'
            ],
            borderColor: '#1a1a1a',
            borderWidth: 2
          }]
        },
        options: {
          responsive: true,
          plugins: {
            legend: {
              position: 'bottom',
              labels: { color: '#d2b48c' }
            }
          }
        }
      },
      priceChart: {
        data: {
          labels: extractedData.priceRanges?.map(range => range.label) || [],
          datasets: [{
            label: 'Number of Properties',
            data: extractedData.priceRanges?.map(range => range.count) || [],
            backgroundColor: 'rgba(139, 69, 19, 0.7)',
            borderColor: '#8b4513',
            borderWidth: 1
          }]
        },
        options: chartOptions
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
              accept=".pdf"
              onChange={(e) => handleFileUpload(e.target.files)}
            />
            <div className="upload-icon">
              {isProcessing ? <FaSpinner style={{ animation: 'spin 1s linear infinite' }} /> : <FaUpload />}
            </div>
            <div className="upload-text">
              {isProcessing ? 'Processing files...' : 'Drop MLS PDF files here or click to browse'}
            </div>
            <div className="upload-hint">
              Upload housing stats, listings, and market data PDFs
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
                <div className="header-content">
                  <h1>MONTHLY MARKET SUMMARY</h1>
                  <div className="location">
                    {communities[newsletterData.community].toUpperCase()}, CA - SINGLE FAMILY<br/>
                    {months[newsletterData.month - 1].toUpperCase()}, {newsletterData.year}
                  </div>
                </div>
              </div>
              
              <div className="content">
                <div className="section">
                  <h2>Quick Analysis</h2>
                  <p>{newsletterData.quickAnalysis || 'Enter your market analysis above to see it here...'}</p>
                </div>
                
                <div className="section">
                  <h2>Key Statistics</h2>
                  <div className="stats-grid">
                    <div className="stat-card">
                      <div className="value">{newsletterData.unitSales || '--'}</div>
                      <div className="label">Unit Sales</div>
                    </div>
                    <div className="stat-card">
                      <div className="value">{newsletterData.medianPrice || '--'}</div>
                      <div className="label">Median Sale Price</div>
                    </div>
                    <div className="stat-card">
                      <div className="value">{newsletterData.inventory || '--'}</div>
                      <div className="label">Inventory</div>
                    </div>
                    <div className="stat-card">
                      <div className="value">{newsletterData.daysOnMarket || '--'}</div>
                      <div className="label">Days on Market</div>
                    </div>
                  </div>
                </div>
                
                <div className="section">
                  <h2>Market Summary</h2>
                  <p>{newsletterData.summary || 'Enter your market summary above to see it here...'}</p>
                </div>
              </div>
            </NewsletterPreview>
          </PreviewContainer>
        )}
      </NewsletterContent>
    </NewsletterSection>
  );
};

export default NewsletterGenerator;