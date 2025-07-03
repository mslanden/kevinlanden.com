import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { FaChartLine, FaSave, FaCalendarAlt, FaMapMarkedAlt, FaImage } from 'react-icons/fa';
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
    median_days_on_market: '',
    min_days_on_market: '',
    max_days_on_market: '',
    total_properties_sold: ''
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
  }, [selectedLocation]);
  
  const fetchMarketData = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL || 'http://localhost:3001/api'}/market-data/all/${selectedLocation}?limit=12`,
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
          }
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
  
  const handlePriceSubmit = async () => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL || 'http://localhost:3001/api'}/market-data/price-per-sqft`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
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
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
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
            active={activeTab === 'image-upload'}
            onClick={() => setActiveTab('image-upload')}
          >
            <FaImage style={{ marginRight: '0.5rem' }} />
            Upload PDF
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
              
              <InputGroup>
                <label>Min Days on Market</label>
                <input
                  type="number"
                  value={daysFormData.min_days_on_market}
                  onChange={(e) => setDaysFormData(prev => ({ ...prev, min_days_on_market: e.target.value }))}
                  placeholder="e.g., 5"
                />
              </InputGroup>
              
              <InputGroup>
                <label>Max Days on Market</label>
                <input
                  type="number"
                  value={daysFormData.max_days_on_market}
                  onChange={(e) => setDaysFormData(prev => ({ ...prev, max_days_on_market: e.target.value }))}
                  placeholder="e.g., 180"
                />
              </InputGroup>
              
              <InputGroup>
                <label>Total Properties Sold</label>
                <input
                  type="number"
                  value={daysFormData.total_properties_sold}
                  onChange={(e) => setDaysFormData(prev => ({ ...prev, total_properties_sold: e.target.value }))}
                  placeholder="e.g., 25"
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
                    <th>Min Days</th>
                    <th>Max Days</th>
                    <th>Properties Sold</th>
                  </tr>
                </thead>
                <tbody>
                  {marketData.daysOnMarket.slice(0, 12).map((item, index) => (
                    <tr key={index}>
                      <td>{months[item.month - 1]} {item.year}</td>
                      <td>{item.average_days_on_market}</td>
                      <td>{item.median_days_on_market || 'N/A'}</td>
                      <td>{item.min_days_on_market || 'N/A'}</td>
                      <td>{item.max_days_on_market || 'N/A'}</td>
                      <td>{item.total_properties_sold || 'N/A'}</td>
                    </tr>
                  ))}
                </tbody>
              </DataTable>
            )}
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