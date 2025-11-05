import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { FaChartLine, FaSave, FaCalendarAlt, FaMapMarkedAlt, FaImage, FaTable, FaFileAlt, FaUpload } from 'react-icons/fa';
import { Line, Bar } from 'react-chartjs-2';
import ImageDataUploader from './admin/ImageDataUploader';

const MarketDataSection = styled(motion.div)`
  margin-bottom: 3rem;
  background-color: rgba(20, 20, 20, 0.85);
  border: 2px solid ${props => props.theme.colors.primary};
  border-radius: ${props => props.theme.borderRadius.default};
  overflow: hidden;
`;

const SectionHeader = styled.div`
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

const SectionContent = styled.div`
  padding: 2rem;
`;

const TabContainer = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
  border-bottom: 2px solid ${props => props.theme.colors.border};
`;

const Tab = styled.button`
  background: ${props => props.active ? props.theme.colors.primary : 'transparent'};
  color: ${props => props.active ? 'white' : props.theme.colors.text.primary};
  border: none;
  padding: 0.75rem 1.5rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  border-radius: ${props => props.theme.borderRadius.small} ${props => props.theme.borderRadius.small} 0 0;
  
  &:hover {
    background: ${props => props.active ? props.theme.colors.primary : 'rgba(139, 69, 19, 0.2)'};
  }
`;

const FormGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
`;

const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  
  label {
    color: ${props => props.theme.colors.text.secondary};
    font-weight: 600;
    font-size: 0.9rem;
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }
  
  input, select {
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
`;

const ActionButton = styled.button`
  background-color: ${props => props.theme.colors.primary};
  color: white;
  border: none;
  padding: 0.75rem 2rem;
  border-radius: ${props => props.theme.borderRadius.small};
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 600;
  transition: all 0.3s ease;
  font-size: 1rem;
  
  &:hover {
    background-color: ${props => props.theme.colors.tertiary};
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

const ChartContainer = styled.div`
  background-color: rgba(30, 30, 30, 0.5);
  border-radius: ${props => props.theme.borderRadius.default};
  padding: 1.5rem;
  margin-top: 2rem;
  
  h3 {
    color: ${props => props.theme.colors.text.secondary};
    margin-bottom: 1rem;
    text-align: center;
  }
  
  .chart-wrapper {
    height: 300px;
    position: relative;
  }
`;

const DataTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-top: 2rem;
  
  thead {
    tr {
      border-bottom: 2px solid ${props => props.theme.colors.border};
    }
    
    th {
      text-align: left;
      padding: 1rem;
      color: ${props => props.theme.colors.text.secondary};
      font-weight: 600;
    }
  }
  
  tbody {
    tr {
      border-bottom: 1px solid rgba(255, 255, 255, 0.1);
      
      &:hover {
        background-color: rgba(255, 255, 255, 0.05);
      }
    }
    
    td {
      padding: 1rem;
      color: ${props => props.theme.colors.text.primary};
    }
  }
`;

const SuccessMessage = styled.div`
  background-color: rgba(81, 207, 102, 0.1);
  border: 1px solid rgba(81, 207, 102, 0.3);
  color: #51cf66;
  padding: 1rem;
  border-radius: ${props => props.theme.borderRadius.small};
  margin-top: 1rem;
  text-align: center;
`;

const ErrorMessage = styled.div`
  background-color: rgba(255, 107, 107, 0.1);
  border: 1px solid rgba(255, 107, 107, 0.3);
  color: #ff6b6b;
  padding: 1rem;
  border-radius: ${props => props.theme.borderRadius.small};
  margin-top: 1rem;
  text-align: center;
`;

const MarketDataManager = () => {
  const [activeTab, setActiveTab] = useState('price-per-sqft');
  const [selectedLocation, setSelectedLocation] = useState('anza');
  const [marketData, setMarketData] = useState({
    pricePerSqft: [],
    daysOnMarket: []
  });
  const [allLocationData, setAllLocationData] = useState({
    pricePerSqft: [],
    daysOnMarket: []
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  
  // Form data
  const [priceFormData, setPriceFormData] = useState({
    month: new Date().getMonth() + 1,
    year: new Date().getFullYear(),
    price_per_sqft: '',
    average_price: '',
    total_sales: '',
    median_days_on_market: ''
  });
  
  const [daysFormData, setDaysFormData] = useState({
    month: new Date().getMonth() + 1,
    year: new Date().getFullYear(),
    average_days_on_market: '',
    median_days_on_market: ''
  });

  // MLS Upload state
  const [mlsUploadFiles, setMlsUploadFiles] = useState([]);
  const [mlsProcessing, setMlsProcessing] = useState(false);
  const [mlsExtractedData, setMlsExtractedData] = useState(null);
  const [mlsFormData, setMlsFormData] = useState({
    month: new Date().getMonth() + 1,
    year: new Date().getFullYear(),
    location: 'anza'
  });

  // CSV Upload state
  const [csvFile, setCsvFile] = useState(null);
  const [csvUploading, setCsvUploading] = useState(false);
  const [csvFormData, setCsvFormData] = useState({
    month: new Date().getMonth() + 1,
    year: new Date().getFullYear(),
    location: 'anza'
  });

  const locations = {
    'anza': 'Anza',
    'aguanga': 'Aguanga',
    'idyllwild': 'Idyllwild',
    'mountain_center': 'Mountain Center'
  };
  
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  
  useEffect(() => {
    fetchMarketData();
    if (activeTab === 'view-data') {
      fetchAllLocationData();
    }
  }, [selectedLocation, activeTab]);
  
  const fetchMarketData = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL || 'http://localhost:3001/api'}/market-data/all/${selectedLocation}?limit=12`,
        {
          credentials: 'include'
        }
      );
      
      if (response.ok) {
        const data = await response.json();
        setMarketData({
          pricePerSqft: data.pricePerSqft || [],
          daysOnMarket: data.daysOnMarket || []
        });
      }
    } catch (error) {
      console.error('Error fetching market data:', error);
      setMessage({ type: 'error', text: 'Failed to fetch market data' });
    } finally {
      setLoading(false);
    }
  };
  
  const fetchAllLocationData = async () => {
    setLoading(true);
    try {
      console.log('Fetching data for location:', selectedLocation);
      const url = `${process.env.REACT_APP_API_URL || 'http://localhost:3001/api'}/market-data/all/${selectedLocation}?limit=20`;
      console.log('API URL:', url);
      
      const response = await fetch(url, {
        credentials: 'include'
      });
      
      console.log('Response status:', response.status);
      
      if (response.ok) {
        const data = await response.json();
        console.log('Received data:', data);
        setAllLocationData({
          pricePerSqft: data.pricePerSqft || [],
          daysOnMarket: data.daysOnMarket || []
        });
      } else {
        const errorData = await response.text();
        console.error('API Error:', errorData);
        setMessage({ type: 'error', text: 'Failed to fetch location data' });
      }
    } catch (error) {
      console.error('Error fetching location data:', error);
      setMessage({ type: 'error', text: 'Failed to fetch location data' });
    } finally {
      setLoading(false);
    }
  };
  
  const handlePriceSubmit = async () => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL || 'http://localhost:3001/api'}/market-data/price-per-sqft`,
        {
          method: 'POST',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            location: selectedLocation,
            ...priceFormData
          })
        }
      );
      
      if (response.ok) {
        setMessage({ type: 'success', text: 'Price per sq ft data saved successfully!' });
        fetchMarketData();
        setTimeout(() => setMessage({ type: '', text: '' }), 3000);
      } else {
        throw new Error('Failed to save data');
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to save price data' });
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    }
  };
  
  const handleDaysSubmit = async () => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL || 'http://localhost:3001/api'}/market-data/days-on-market`,
        {
          method: 'POST',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            location: selectedLocation,
            ...daysFormData
          })
        }
      );
      
      if (response.ok) {
        setMessage({ type: 'success', text: 'Days on market data saved successfully!' });
        fetchMarketData();
        setTimeout(() => setMessage({ type: '', text: '' }), 3000);
      } else {
        throw new Error('Failed to save data');
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to save days on market data' });
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    }
  };

  // MLS Upload Handlers
  const handleMlsFileUpload = (event) => {
    const files = Array.from(event.target.files);
    const newFiles = files.map(file => ({
      id: Date.now() + Math.random(),
      file,
      name: file.name,
      status: 'ready'
    }));
    setMlsUploadFiles(newFiles);
  };

  const handleMlsProcessing = async () => {
    setMlsProcessing(true);
    setMessage({ type: '', text: '' });
    
    try {
      // Update file status to processing
      setMlsUploadFiles(prev => 
        prev.map(f => ({ ...f, status: 'processing' }))
      );

      // Prepare form data
      const formData = new FormData();
      mlsUploadFiles.forEach(fileItem => {
        formData.append('files', fileItem.file);
      });
      formData.append('location', mlsFormData.location);
      formData.append('month', mlsFormData.month.toString());
      formData.append('year', mlsFormData.year.toString());

      // Send to new MLS processing endpoint
      const response = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:3001/api'}/market-data/process-mls`, {
        method: 'POST',
        credentials: 'include',
        body: formData
      });

      if (response.ok) {
        const data = await response.json();
        setMlsExtractedData(data);
        
        // Update file status to completed
        setMlsUploadFiles(prev => 
          prev.map(f => ({ ...f, status: 'completed' }))
        );

        // Refresh market data to show new entries
        fetchMarketData();
        
        setMessage({ 
          type: 'success', 
          text: `Successfully processed ${data.listings?.length || 0} listings and saved to database!` 
        });
        setTimeout(() => setMessage({ type: '', text: '' }), 5000);
      } else {
        throw new Error('Failed to process MLS files');
      }
    } catch (error) {
      console.error('Error processing MLS files:', error);
      setMlsUploadFiles(prev => 
        prev.map(f => ({ ...f, status: 'error' }))
      );
      setMessage({ type: 'error', text: 'Failed to process MLS files. Please try again.' });
      setTimeout(() => setMessage({ type: '', text: '' }), 5000);
    } finally {
      setMlsProcessing(false);
    }
  };

  // CSV Upload Handler
  const handleCsvUpload = async () => {
    if (!csvFile) {
      setMessage({ type: 'error', text: 'Please select a CSV file first' });
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
      return;
    }

    setCsvUploading(true);
    setMessage({ type: '', text: '' });

    try {
      const formData = new FormData();
      formData.append('file', csvFile);
      formData.append('location', csvFormData.location);
      formData.append('month', csvFormData.month.toString());
      formData.append('year', csvFormData.year.toString());

      const response = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:3001/api'}/market-data/upload-csv`, {
        method: 'POST',
        credentials: 'include',
        body: formData
      });

      if (response.ok) {
        const data = await response.json();
        setMessage({
          type: 'success',
          text: `Successfully imported ${data.imported} listings from CSV! ${data.skipped > 0 ? `(${data.skipped} skipped)` : ''}`
        });

        // Reset form
        setCsvFile(null);
        document.getElementById('csv-file-input').value = '';

        // Refresh market data
        fetchMarketData();

        setTimeout(() => setMessage({ type: '', text: '' }), 5000);
      } else {
        const error = await response.json();
        throw new Error(error.error || 'Failed to upload CSV');
      }
    } catch (error) {
      console.error('Error uploading CSV:', error);
      setMessage({
        type: 'error',
        text: error.message || 'Failed to upload CSV file. Please try again.'
      });
      setTimeout(() => setMessage({ type: '', text: '' }), 5000);
    } finally {
      setCsvUploading(false);
    }
  };

  const createChartData = () => {
    const baseOptions = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false
        }
      }
    };
    
    return {
      priceChart: {
        data: {
          labels: marketData.pricePerSqft.slice(0, 12).reverse().map(item => 
            `${months[item.month - 1].substring(0, 3)} ${item.year}`
          ),
          datasets: [{
            label: 'Price per Sq Ft',
            data: marketData.pricePerSqft.slice(0, 12).reverse().map(item => item.price_per_sqft),
            borderColor: '#8b4513',
            backgroundColor: 'rgba(139, 69, 19, 0.1)',
            borderWidth: 2,
            tension: 0.1
          }]
        },
        options: {
          ...baseOptions,
          scales: {
            y: {
              ticks: {
                callback: function(value) {
                  return '$' + value;
                },
                color: '#999'
              },
              grid: { color: 'rgba(255, 255, 255, 0.1)' }
            },
            x: {
              ticks: { color: '#999' },
              grid: { display: false }
            }
          }
        }
      },
      daysChart: {
        data: {
          labels: marketData.daysOnMarket.slice(0, 12).reverse().map(item => 
            `${months[item.month - 1].substring(0, 3)} ${item.year}`
          ),
          datasets: [{
            label: 'Average Days on Market',
            data: marketData.daysOnMarket.slice(0, 12).reverse().map(item => item.average_days_on_market),
            backgroundColor: '#d2b48c',
            borderColor: '#8b4513',
            borderWidth: 1
          }]
        },
        options: {
          ...baseOptions,
          scales: {
            y: {
              beginAtZero: true,
              ticks: { color: '#999' },
              grid: { color: 'rgba(255, 255, 255, 0.1)' }
            },
            x: {
              ticks: { color: '#999' },
              grid: { display: false }
            }
          }
        }
      }
    };
  };
  
  return (
    <MarketDataSection
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <SectionHeader>
        <h2>
          <FaChartLine />
          Market Data Management
        </h2>
      </SectionHeader>
      <SectionContent>
        <FormGrid>
          <InputGroup>
            <label>
              <FaMapMarkedAlt />
              Location
            </label>
            <select
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value)}
            >
              {Object.entries(locations).map(([key, name]) => (
                <option key={key} value={key}>{name}</option>
              ))}
            </select>
          </InputGroup>
        </FormGrid>
        
        <TabContainer>
          <Tab
            active={activeTab === 'price-per-sqft'}
            onClick={() => setActiveTab('price-per-sqft')}
          >
            Price per Sq Ft
          </Tab>
          <Tab
            active={activeTab === 'days-on-market'}
            onClick={() => setActiveTab('days-on-market')}
          >
            Days on Market
          </Tab>
          <Tab
            active={activeTab === 'view-data'}
            onClick={() => setActiveTab('view-data')}
          >
            <FaTable style={{ marginRight: '0.5rem' }} />
            View Data
          </Tab>
          <Tab
            active={activeTab === 'image-upload'}
            onClick={() => setActiveTab('image-upload')}
          >
            <FaImage style={{ marginRight: '0.5rem' }} />
            Upload PDF
          </Tab>
          <Tab
            active={activeTab === 'mls-upload'}
            onClick={() => setActiveTab('mls-upload')}
          >
            <FaFileAlt style={{ marginRight: '0.5rem' }} />
            MLS Upload
          </Tab>
          <Tab
            active={activeTab === 'csv-upload'}
            onClick={() => setActiveTab('csv-upload')}
          >
            <FaUpload style={{ marginRight: '0.5rem' }} />
            CSV Upload
          </Tab>
        </TabContainer>
        
        {activeTab === 'price-per-sqft' && (
          <>
            <FormGrid>
              <InputGroup>
                <label>
                  <FaCalendarAlt />
                  Month
                </label>
                <select
                  value={priceFormData.month}
                  onChange={(e) => setPriceFormData(prev => ({ ...prev, month: parseInt(e.target.value) }))}
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
                  value={priceFormData.year}
                  onChange={(e) => setPriceFormData(prev => ({ ...prev, year: parseInt(e.target.value) }))}
                  min="2020"
                  max="2050"
                />
              </InputGroup>
              
              <InputGroup>
                <label>Price per Sq Ft *</label>
                <input
                  type="number"
                  value={priceFormData.price_per_sqft}
                  onChange={(e) => setPriceFormData(prev => ({ ...prev, price_per_sqft: e.target.value }))}
                  placeholder="e.g., 285"
                  required
                />
              </InputGroup>
              
              <InputGroup>
                <label>Average Price</label>
                <input
                  type="number"
                  value={priceFormData.average_price}
                  onChange={(e) => setPriceFormData(prev => ({ ...prev, average_price: e.target.value }))}
                  placeholder="e.g., 450000"
                />
              </InputGroup>
              
              <InputGroup>
                <label>Total Sales</label>
                <input
                  type="number"
                  value={priceFormData.total_sales}
                  onChange={(e) => setPriceFormData(prev => ({ ...prev, total_sales: e.target.value }))}
                  placeholder="e.g., 25"
                />
              </InputGroup>
              
              <InputGroup>
                <label>Median Days on Market</label>
                <input
                  type="number"
                  value={priceFormData.median_days_on_market}
                  onChange={(e) => setPriceFormData(prev => ({ ...prev, median_days_on_market: e.target.value }))}
                  placeholder="e.g., 45"
                />
              </InputGroup>
            </FormGrid>
            
            <ActionButton onClick={handlePriceSubmit} disabled={!priceFormData.price_per_sqft}>
              <FaSave />
              Save Price Data
            </ActionButton>
            
            {marketData.pricePerSqft.length > 0 && (
              <ChartContainer>
                <h3>Price per Sq Ft Trend - {locations[selectedLocation]}</h3>
                <div className="chart-wrapper">
                  <Line {...createChartData().priceChart} />
                </div>
              </ChartContainer>
            )}
            
            {marketData.pricePerSqft.length > 0 && (
              <DataTable>
                <thead>
                  <tr>
                    <th>Month/Year</th>
                    <th>Price per Sq Ft</th>
                    <th>Average Price</th>
                    <th>Total Sales</th>
                    <th>Median Days</th>
                  </tr>
                </thead>
                <tbody>
                  {marketData.pricePerSqft.slice(0, 12).map((item, index) => (
                    <tr key={index}>
                      <td>{months[item.month - 1]} {item.year}</td>
                      <td>${item.price_per_sqft}</td>
                      <td>{item.average_price ? `$${parseInt(item.average_price).toLocaleString()}` : 'N/A'}</td>
                      <td>{item.total_sales || 'N/A'}</td>
                      <td>{item.median_days_on_market || 'N/A'}</td>
                    </tr>
                  ))}
                </tbody>
              </DataTable>
            )}
          </>
        )}
        
        {activeTab === 'days-on-market' && (
          <>
            <FormGrid>
              <InputGroup>
                <label>
                  <FaCalendarAlt />
                  Month
                </label>
                <select
                  value={daysFormData.month}
                  onChange={(e) => setDaysFormData(prev => ({ ...prev, month: parseInt(e.target.value) }))}
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
                  value={daysFormData.year}
                  onChange={(e) => setDaysFormData(prev => ({ ...prev, year: parseInt(e.target.value) }))}
                  min="2020"
                  max="2050"
                />
              </InputGroup>
              
              <InputGroup>
                <label>Average Days on Market *</label>
                <input
                  type="number"
                  value={daysFormData.average_days_on_market}
                  onChange={(e) => setDaysFormData(prev => ({ ...prev, average_days_on_market: e.target.value }))}
                  placeholder="e.g., 65"
                  step="0.1"
                  required
                />
              </InputGroup>
              
              <InputGroup>
                <label>Median Days on Market</label>
                <input
                  type="number"
                  value={daysFormData.median_days_on_market}
                  onChange={(e) => setDaysFormData(prev => ({ ...prev, median_days_on_market: e.target.value }))}
                  placeholder="e.g., 60"
                />
              </InputGroup>
              
            </FormGrid>
            
            <ActionButton onClick={handleDaysSubmit} disabled={!daysFormData.average_days_on_market}>
              <FaSave />
              Save Days on Market Data
            </ActionButton>
            
            {marketData.daysOnMarket.length > 0 && (
              <ChartContainer>
                <h3>Days on Market Trend - {locations[selectedLocation]}</h3>
                <div className="chart-wrapper">
                  <Bar {...createChartData().daysChart} />
                </div>
              </ChartContainer>
            )}
            
            {marketData.daysOnMarket.length > 0 && (
              <DataTable>
                <thead>
                  <tr>
                    <th>Month/Year</th>
                    <th>Average Days</th>
                    <th>Median Days</th>
                  </tr>
                </thead>
                <tbody>
                  {marketData.daysOnMarket.slice(0, 12).map((item, index) => (
                    <tr key={index}>
                      <td>{months[item.month - 1]} {item.year}</td>
                      <td>{item.average_days_on_market}</td>
                      <td>{item.median_days_on_market || 'N/A'}</td>
                    </tr>
                  ))}
                </tbody>
              </DataTable>
            )}
          </>
        )}
        
        {activeTab === 'view-data' && (
          <>
            <div style={{ 
              backgroundColor: 'rgba(139, 69, 19, 0.1)', 
              padding: '1.5rem', 
              borderRadius: '8px',
              marginBottom: '2rem'
            }}>
              <h3 style={{ color: '#8b4513', marginBottom: '1rem' }}>
                Current Market Data - {locations[selectedLocation]}
              </h3>
              <p style={{ color: '#666', marginBottom: '1.5rem' }}>
                Showing all available data for {locations[selectedLocation]}
              </p>
              
              {loading ? (
                <div style={{ textAlign: 'center', padding: '2rem' }}>Loading...</div>
              ) : (
                <>
                  {/* Price Per Sq Ft Data */}
                  {allLocationData.pricePerSqft.length > 0 && (
                    <div style={{ marginBottom: '2rem' }}>
                      <h4 style={{ color: '#8b4513', marginBottom: '1rem' }}>Price Per Square Foot</h4>
                      <DataTable>
                        <thead>
                          <tr>
                            <th>Month/Year</th>
                            <th>Price/Sq Ft</th>
                            <th>Average Price</th>
                            <th>Total Sales</th>
                            <th>Median Days</th>
                          </tr>
                        </thead>
                        <tbody>
                          {allLocationData.pricePerSqft.map((item, index) => (
                            <tr key={`${item.location}-${item.month}-${item.year}`}>
                              <td style={{ fontWeight: '600' }}>
                                {months[item.month - 1]} {item.year}
                              </td>
                              <td>${item.price_per_sqft}</td>
                              <td>{item.average_price ? `$${parseInt(item.average_price).toLocaleString()}` : 'N/A'}</td>
                              <td>{item.total_sales || 'N/A'}</td>
                              <td>{item.median_days_on_market || 'N/A'}</td>
                            </tr>
                          ))}
                        </tbody>
                      </DataTable>
                    </div>
                  )}
                  
                  {/* Days on Market Data */}
                  {allLocationData.daysOnMarket.length > 0 && (
                    <div>
                      <h4 style={{ color: '#8b4513', marginBottom: '1rem' }}>Days on Market</h4>
                      <DataTable>
                        <thead>
                          <tr>
                            <th>Month/Year</th>
                            <th>Avg Days</th>
                            <th>Median Days</th>
                          </tr>
                        </thead>
                        <tbody>
                          {allLocationData.daysOnMarket.map((item, index) => (
                            <tr key={`days-${item.location}-${item.month}-${item.year}`}>
                              <td style={{ fontWeight: '600' }}>
                                {months[item.month - 1]} {item.year}
                              </td>
                              <td>{item.average_days_on_market}</td>
                              <td>{item.median_days_on_market || 'N/A'}</td>
                            </tr>
                          ))}
                        </tbody>
                      </DataTable>
                    </div>
                  )}
                  
                  {allLocationData.pricePerSqft.length === 0 && allLocationData.daysOnMarket.length === 0 && (
                    <div style={{ 
                      textAlign: 'center', 
                      padding: '3rem',
                      color: '#666',
                      fontStyle: 'italic'
                    }}>
                      No market data available. Upload some PDF reports to get started!
                    </div>
                  )}
                </>
              )}
            </div>
          </>
        )}
        
        {activeTab === 'image-upload' && (
          <ImageDataUploader 
            onDataExtracted={() => {
              fetchMarketData();
              setMessage({ 
                type: 'success', 
                text: 'Market data extracted and saved successfully!' 
              });
              setTimeout(() => setMessage({ type: '', text: '' }), 5000);
            }}
          />
        )}

        {activeTab === 'mls-upload' && (
          <>
            <FormGrid>
              <InputGroup>
                <label>
                  <FaMapMarkedAlt />
                  Location
                </label>
                <select
                  value={mlsFormData.location}
                  onChange={(e) => setMlsFormData(prev => ({ ...prev, location: e.target.value }))}
                >
                  {Object.entries(locations).map(([key, value]) => (
                    <option key={key} value={key}>{value}</option>
                  ))}
                </select>
              </InputGroup>
              
              <InputGroup>
                <label>
                  <FaCalendarAlt />
                  Month
                </label>
                <select
                  value={mlsFormData.month}
                  onChange={(e) => setMlsFormData(prev => ({ ...prev, month: parseInt(e.target.value) }))}
                >
                  {months.map((month, index) => (
                    <option key={index + 1} value={index + 1}>{month}</option>
                  ))}
                </select>
              </InputGroup>
              
              <InputGroup>
                <label>
                  <FaCalendarAlt />
                  Year
                </label>
                <input
                  type="number"
                  min="2020"
                  max="2030"
                  value={mlsFormData.year}
                  onChange={(e) => setMlsFormData(prev => ({ ...prev, year: parseInt(e.target.value) }))}
                />
              </InputGroup>
            </FormGrid>

            <div style={{ marginTop: '2rem' }}>
              <h3 style={{ color: '#D2B48C', marginBottom: '1rem' }}>
                <FaUpload style={{ marginRight: '0.5rem' }} />
                Upload MLS Reports (PDF)
              </h3>
              <div
                style={{
                  border: '2px dashed #8B4513',
                  borderRadius: '8px',
                  padding: '3rem',
                  textAlign: 'center',
                  backgroundColor: 'rgba(255, 255, 255, 0.02)',
                  transition: 'all 0.3s ease',
                  cursor: 'pointer',
                  position: 'relative'
                }}
                onClick={() => document.getElementById('mls-file-input').click()}
              >
                <input
                  id="mls-file-input"
                  type="file"
                  multiple
                  accept=".pdf"
                  onChange={handleMlsFileUpload}
                  style={{ display: 'none' }}
                />
                <div style={{
                  fontSize: '3rem',
                  color: '#8B4513',
                  marginBottom: '1rem'
                }}>
                  <FaUpload />
                </div>
                <div style={{
                  color: '#D2B48C',
                  fontSize: '1.1rem',
                  marginBottom: '0.5rem'
                }}>
                  Drop MLS PDF files here or click to browse
                </div>
                <div style={{
                  color: '#999',
                  fontSize: '0.9rem'
                }}>
                  Supports PDF files up to 10MB
                </div>
              </div>
              
              {mlsUploadFiles.length > 0 && (
                <div style={{ marginTop: '1rem' }}>
                  <h4 style={{ color: '#D2B48C' }}>Uploaded Files:</h4>
                  {mlsUploadFiles.map((file, index) => (
                    <div key={index} style={{ 
                      padding: '0.5rem', 
                      margin: '0.5rem 0',
                      backgroundColor: 'rgba(30, 30, 30, 0.5)',
                      borderRadius: '4px',
                      color: '#D2B48C'
                    }}>
                      {file.name} - {file.status}
                    </div>
                  ))}
                </div>
              )}
              
              {mlsUploadFiles.length > 0 && (
                <ActionButton
                  onClick={handleMlsProcessing}
                  disabled={mlsProcessing}
                  style={{ marginTop: '1rem' }}
                >
                  {mlsProcessing ? 'Processing...' : 'Process MLS Files & Save to Database'}
                </ActionButton>
              )}
            </div>

            {mlsExtractedData && (
              <div style={{ marginTop: '2rem' }}>
                <h3 style={{ color: '#D2B48C' }}>Extraction Results:</h3>
                <div style={{ 
                  backgroundColor: 'rgba(30, 30, 30, 0.5)',
                  padding: '1rem',
                  borderRadius: '8px',
                  marginTop: '1rem'
                }}>
                  <p style={{ color: '#D2B48C' }}>
                    <strong>Properties Extracted:</strong> {mlsExtractedData.listings?.length || 0}
                  </p>
                  <p style={{ color: '#D2B48C' }}>
                    <strong>Market Summary:</strong> {mlsExtractedData.summary?.quickAnalysis || 'N/A'}
                  </p>
                  <p style={{ color: '#D2B48C' }}>
                    <strong>Status:</strong> Individual listings and market statistics saved to database
                  </p>
                </div>
              </div>
            )}
          </>
        )}

        {activeTab === 'csv-upload' && (
          <>
            <div style={{
              backgroundColor: 'rgba(139, 69, 19, 0.1)',
              padding: '1.5rem',
              borderRadius: '8px',
              marginBottom: '2rem'
            }}>
              <h3 style={{ color: '#8b4513', marginBottom: '1rem' }}>
                CSV Upload - Fast & Accurate
              </h3>
              <p style={{ color: '#D2B48C', marginBottom: '0.5rem' }}>
                ✅ Instant upload (2-5 seconds)
              </p>
              <p style={{ color: '#D2B48C', marginBottom: '0.5rem' }}>
                ✅ 100% accurate data mapping
              </p>
              <p style={{ color: '#D2B48C', marginBottom: '0.5rem' }}>
                ✅ Handles unlimited listings
              </p>
              <p style={{ color: '#D2B48C' }}>
                ✅ Free (no AI processing costs)
              </p>
            </div>

            <FormGrid>
              <InputGroup>
                <label>
                  <FaMapMarkedAlt />
                  Location
                </label>
                <select
                  value={csvFormData.location}
                  onChange={(e) => setCsvFormData(prev => ({ ...prev, location: e.target.value }))}
                >
                  {Object.entries(locations).map(([key, value]) => (
                    <option key={key} value={key}>{value}</option>
                  ))}
                </select>
              </InputGroup>

              <InputGroup>
                <label>
                  <FaCalendarAlt />
                  Month
                </label>
                <select
                  value={csvFormData.month}
                  onChange={(e) => setCsvFormData(prev => ({ ...prev, month: parseInt(e.target.value) }))}
                >
                  {months.map((month, index) => (
                    <option key={index + 1} value={index + 1}>{month}</option>
                  ))}
                </select>
              </InputGroup>

              <InputGroup>
                <label>
                  <FaCalendarAlt />
                  Year
                </label>
                <input
                  type="number"
                  min="2020"
                  max="2030"
                  value={csvFormData.year}
                  onChange={(e) => setCsvFormData(prev => ({ ...prev, year: parseInt(e.target.value) }))}
                />
              </InputGroup>
            </FormGrid>

            <div style={{ marginTop: '2rem' }}>
              <h3 style={{ color: '#D2B48C', marginBottom: '1rem' }}>
                <FaUpload style={{ marginRight: '0.5rem' }} />
                Select CSV File
              </h3>
              <input
                id="csv-file-input"
                type="file"
                accept=".csv"
                onChange={(e) => setCsvFile(e.target.files[0])}
                style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  border: '1px solid #8B4513',
                  borderRadius: '4px',
                  padding: '0.75rem',
                  color: '#D2B48C',
                  width: '100%',
                  cursor: 'pointer'
                }}
              />
              {csvFile && (
                <div style={{
                  marginTop: '1rem',
                  padding: '0.75rem',
                  backgroundColor: 'rgba(139, 69, 19, 0.2)',
                  borderRadius: '4px',
                  color: '#D2B48C'
                }}>
                  Selected: {csvFile.name} ({(csvFile.size / 1024).toFixed(2)} KB)
                </div>
              )}

              <ActionButton
                onClick={handleCsvUpload}
                disabled={!csvFile || csvUploading}
                style={{ marginTop: '1rem' }}
              >
                {csvUploading ? 'Uploading...' : 'Upload CSV & Save to Database'}
              </ActionButton>
            </div>

            <div style={{
              marginTop: '2rem',
              padding: '1.5rem',
              backgroundColor: 'rgba(30, 30, 30, 0.5)',
              borderRadius: '8px'
            }}>
              <h4 style={{ color: '#D2B48C', marginBottom: '1rem' }}>CSV Format Requirements:</h4>
              <p style={{ color: '#999', fontSize: '0.9rem', marginBottom: '0.5rem' }}>
                Your CSV should include these columns:
              </p>
              <ul style={{ color: '#999', fontSize: '0.9rem', paddingLeft: '1.5rem' }}>
                <li>List Number (MLS#)</li>
                <li>Status (A=Active, P=Pending, C=Closed, etc.)</li>
                <li>List Price or Closed Price</li>
                <li>Street #, Street Name, City (for address)</li>
                <li>Total Bedrooms</li>
                <li>Total Baths</li>
                <li>Approx SqFt</li>
                <li>Year Built</li>
                <li>Days on Market (optional)</li>
              </ul>
            </div>
          </>
        )}

        {message.text && (
          message.type === 'success' ? (
            <SuccessMessage>{message.text}</SuccessMessage>
          ) : (
            <ErrorMessage>{message.text}</ErrorMessage>
          )
        )}
      </SectionContent>
    </MarketDataSection>
  );
};

export default MarketDataManager;