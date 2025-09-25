import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  Filler
} from 'chart.js';
import { Line, Bar, Doughnut } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  Filler
);

const ChartContainer = styled(motion.div)`
  background-color: rgba(20, 20, 20, 0.85);
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius.default};
  padding: 2rem;
  margin-bottom: 2rem;

  h3 {
    color: ${props => props.theme.colors.text.secondary};
    font-family: ${props => props.theme.fonts.heading};
    margin-bottom: 1.5rem;
    display: flex;
    align-items: center;
    gap: 1rem;
  }
`;

const ChartWrapper = styled.div`
  position: relative;
  height: 300px;

  canvas {
    background: rgba(255, 255, 255, 0.02);
    border-radius: ${props => props.theme.borderRadius.small};
  }
`;

const ChartControls = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;

  @media (max-width: ${props => props.theme.breakpoints.sm}) {
    flex-direction: column;
    gap: 1rem;
    align-items: stretch;
  }
`;

const TimeframeButtons = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const TimeframeButton = styled.button`
  background-color: ${props => props.active ? props.theme.colors.primary : 'rgba(139, 69, 19, 0.1)'};
  color: ${props => props.active ? 'white' : props.theme.colors.text.primary};
  border: 1px solid ${props => props.active ? props.theme.colors.primary : props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius.small};
  padding: 0.5rem 1rem;
  cursor: pointer;
  font-size: 0.9rem;
  transition: all 0.3s ease;

  &:hover {
    background-color: ${props => props.active ? props.theme.colors.tertiary : 'rgba(139, 69, 19, 0.2)'};
  }
`;

const chartTheme = {
  backgroundColor: 'rgba(139, 69, 19, 0.1)',
  borderColor: '#8B4513',
  pointBackgroundColor: '#8B4513',
  pointBorderColor: '#fff',
  gridColor: 'rgba(255, 255, 255, 0.1)',
  textColor: '#E0E0E0'
};

const defaultOptions = {
  responsive: true,
  maintainAspectRatio: false,
  interaction: {
    intersect: false,
  },
  scales: {
    x: {
      grid: {
        color: chartTheme.gridColor,
        borderColor: chartTheme.gridColor,
      },
      ticks: {
        color: chartTheme.textColor,
      }
    },
    y: {
      grid: {
        color: chartTheme.gridColor,
        borderColor: chartTheme.gridColor,
      },
      ticks: {
        color: chartTheme.textColor,
      }
    }
  },
  plugins: {
    legend: {
      labels: {
        color: chartTheme.textColor,
      }
    },
    tooltip: {
      backgroundColor: 'rgba(20, 20, 20, 0.9)',
      titleColor: '#fff',
      bodyColor: '#fff',
      borderColor: '#8B4513',
      borderWidth: 1,
    }
  }
};

export const LineChart = ({ title, data, timeframe, onTimeframeChange, icon: Icon }) => {
  const timeframes = [
    { key: '30days', label: '30 Days' },
    { key: '6months', label: '6 Months' },
    { key: '1year', label: '1 Year' }
  ];

  const chartData = {
    labels: data?.labels || [],
    datasets: [{
      label: title,
      data: data?.values || [],
      borderColor: chartTheme.borderColor,
      backgroundColor: chartTheme.backgroundColor,
      pointBackgroundColor: chartTheme.pointBackgroundColor,
      pointBorderColor: chartTheme.pointBorderColor,
      fill: true,
      tension: 0.4
    }]
  };

  return (
    <ChartContainer
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <ChartControls>
        <h3>
          {Icon && <Icon />}
          {title}
        </h3>
        <TimeframeButtons>
          {timeframes.map(tf => (
            <TimeframeButton
              key={tf.key}
              active={timeframe === tf.key}
              onClick={() => onTimeframeChange && onTimeframeChange(tf.key)}
            >
              {tf.label}
            </TimeframeButton>
          ))}
        </TimeframeButtons>
      </ChartControls>
      <ChartWrapper>
        <Line data={chartData} options={defaultOptions} />
      </ChartWrapper>
    </ChartContainer>
  );
};

export const BarChart = ({ title, data, icon: Icon, horizontal = false }) => {
  const chartData = {
    labels: data?.labels || [],
    datasets: [{
      label: title,
      data: data?.values || [],
      backgroundColor: data?.colors || Array(data?.values?.length || 0).fill(chartTheme.backgroundColor),
      borderColor: data?.borderColors || Array(data?.values?.length || 0).fill(chartTheme.borderColor),
      borderWidth: 1
    }]
  };

  const options = {
    ...defaultOptions,
    indexAxis: horizontal ? 'y' : 'x',
  };

  return (
    <ChartContainer
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h3>
        {Icon && <Icon />}
        {title}
      </h3>
      <ChartWrapper>
        <Bar data={chartData} options={options} />
      </ChartWrapper>
    </ChartContainer>
  );
};

export const DoughnutChart = ({ title, data, icon: Icon }) => {
  const chartData = {
    labels: data?.labels || [],
    datasets: [{
      data: data?.values || [],
      backgroundColor: [
        '#8B4513',
        '#CD853F',
        '#D2691E',
        '#A0522D',
        '#8B7355',
        '#DEB887'
      ],
      borderColor: '#fff',
      borderWidth: 2
    }]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          color: chartTheme.textColor,
          padding: 20,
        }
      },
      tooltip: {
        backgroundColor: 'rgba(20, 20, 20, 0.9)',
        titleColor: '#fff',
        bodyColor: '#fff',
        borderColor: '#8B4513',
        borderWidth: 1,
      }
    }
  };

  return (
    <ChartContainer
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h3>
        {Icon && <Icon />}
        {title}
      </h3>
      <ChartWrapper>
        <Doughnut data={chartData} options={options} />
      </ChartWrapper>
    </ChartContainer>
  );
};

export const MetricCard = ({ title, value, change, icon: Icon, color = '#8B4513', trend }) => {
  const isPositive = change && change > 0;
  const isNegative = change && change < 0;

  return (
    <ChartContainer
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      <MetricHeader>
        <MetricIcon color={color}>
          {Icon && <Icon />}
        </MetricIcon>
        <MetricContent>
          <MetricValue color={color}>{value}</MetricValue>
          <MetricTitle>{title}</MetricTitle>
          {change !== undefined && (
            <MetricChange positive={isPositive} negative={isNegative}>
              {isPositive ? '+' : ''}{change}%
              {trend === 'up' ? ' ↗' : trend === 'down' ? ' ↘' : ''}
            </MetricChange>
          )}
        </MetricContent>
      </MetricHeader>
    </ChartContainer>
  );
};

const MetricHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 1.5rem;
`;

const MetricIcon = styled.div`
  width: 60px;
  height: 60px;
  background-color: ${props => `${props.color}20`};
  border-radius: ${props => props.theme.borderRadius.default};
  display: flex;
  align-items: center;
  justify-content: center;

  svg {
    font-size: 2rem;
    color: ${props => props.color};
  }
`;

const MetricContent = styled.div`
  flex: 1;
`;

const MetricValue = styled.div`
  font-size: 2.5rem;
  font-weight: 700;
  color: ${props => props.color};
  line-height: 1;
  margin-bottom: 0.5rem;
`;

const MetricTitle = styled.div`
  color: ${props => props.theme.colors.text.secondary};
  font-size: 1.1rem;
  margin-bottom: 0.25rem;
`;

const MetricChange = styled.div`
  color: ${props =>
    props.positive ? '#4CAF50' :
    props.negative ? '#f44336' :
    props.theme.colors.text.muted
  };
  font-size: 0.9rem;
  font-weight: 500;
`;