import { useState, useEffect } from 'react';
import axios from 'axios';

interface DeviceMetricsProps {
  contractAddress: string;
  blockscoutApi: string;
}

interface MetricData {
  deviceId: string;
  deviceName: string;
  uptime: number;
  dataTransmitted: number;
  batteryLevel?: number;
  signalStrength?: number;
  lastSync: string;
  transactionCount: number;
  energyConsumption?: number;
}

const DeviceMetrics = ({ contractAddress, blockscoutApi }: DeviceMetricsProps) => {
  const [metrics, setMetrics] = useState<MetricData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedMetric, setSelectedMetric] = useState<string>('uptime');

  // Mock data for demonstration
  const mockMetrics: MetricData[] = [
    {
      deviceId: '0x1a2b3c4d5e6f',
      deviceName: 'Smart Thermostat X1',
      uptime: 99.8,
      dataTransmitted: 1240,
      batteryLevel: 87,
      signalStrength: 92,
      lastSync: new Date().toISOString(),
      transactionCount: 347,
      energyConsumption: 0.12
    },
    {
      deviceId: '0x2b3c4d5e6f7g',
      deviceName: 'Smart Lock Pro',
      uptime: 98.5,
      dataTransmitted: 560,
      batteryLevel: 62,
      signalStrength: 85,
      lastSync: new Date(Date.now() - 3600000).toISOString(),
      transactionCount: 128,
      energyConsumption: 0.08
    },
    {
      deviceId: '0x3c4d5e6f7g8h',
      deviceName: 'Environmental Sensor',
      uptime: 95.2,
      dataTransmitted: 3450,
      batteryLevel: 41,
      signalStrength: 78,
      lastSync: new Date(Date.now() - 7200000).toISOString(),
      transactionCount: 782,
      energyConsumption: 0.05
    },
    {
      deviceId: '0x4d5e6f7g8h9i',
      deviceName: 'Smart Irrigation Controller',
      uptime: 97.9,
      dataTransmitted: 890,
      signalStrength: 95,
      lastSync: new Date(Date.now() - 1800000).toISOString(),
      transactionCount: 215,
      energyConsumption: 0.31
    }
  ];

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        setLoading(true);
        // In a real app, we would fetch from the blockchain via the API
        // For now, we'll use mock data
        setTimeout(() => {
          setMetrics(mockMetrics);
          setLoading(false);
        }, 1200);
      } catch (err) {
        console.error('Error fetching device metrics:', err);
        setError('Failed to fetch device metrics. Please try again later.');
        setLoading(false);
      }
    };

    fetchMetrics();
  }, [contractAddress, blockscoutApi]);

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleString();
  };

  const formatDataTransmitted = (bytes: number) => {
    if (bytes < 1024) {
      return `${bytes} B`;
    } else if (bytes < 1024 * 1024) {
      return `${(bytes / 1024).toFixed(2)} KB`;
    } else {
      return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
    }
  };

  const getMetricValue = (metric: MetricData, key: string) => {
    switch (key) {
      case 'uptime':
        return `${metric.uptime}%`;
      case 'dataTransmitted':
        return formatDataTransmitted(metric.dataTransmitted);
      case 'batteryLevel':
        return metric.batteryLevel ? `${metric.batteryLevel}%` : 'N/A';
      case 'signalStrength':
        return metric.signalStrength ? `${metric.signalStrength}%` : 'N/A';
      case 'transactionCount':
        return metric.transactionCount.toString();
      case 'energyConsumption':
        return metric.energyConsumption ? `${metric.energyConsumption} kWh` : 'N/A';
      default:
        return 'Unknown';
    }
  };

  const getMetricColor = (metric: MetricData, key: string) => {
    switch (key) {
      case 'uptime':
        return metric.uptime > 98 ? 'metric-excellent' : 
               metric.uptime > 95 ? 'metric-good' : 
               metric.uptime > 90 ? 'metric-fair' : 'metric-poor';
      case 'batteryLevel':
        return !metric.batteryLevel ? '' :
               metric.batteryLevel > 70 ? 'metric-excellent' : 
               metric.batteryLevel > 40 ? 'metric-good' : 
               metric.batteryLevel > 20 ? 'metric-fair' : 'metric-poor';
      case 'signalStrength':
        return !metric.signalStrength ? '' :
               metric.signalStrength > 80 ? 'metric-excellent' : 
               metric.signalStrength > 60 ? 'metric-good' : 
               metric.signalStrength > 40 ? 'metric-fair' : 'metric-poor';
      default:
        return '';
    }
  };

  if (loading) {
    return <div className="device-metrics-loading">Loading device metrics...</div>;
  }

  if (error) {
    return <div className="device-metrics-error">{error}</div>;
  }

  return (
    <div className="device-metrics">
      <div className="metrics-header">
        <h3>Device Performance Metrics</h3>
        <div className="metric-selector">
          <select 
            value={selectedMetric} 
            onChange={(e) => setSelectedMetric(e.target.value)}
            className="metric-select"
          >
            <option value="uptime">Uptime</option>
            <option value="dataTransmitted">Data Transmitted</option>
            <option value="batteryLevel">Battery Level</option>
            <option value="signalStrength">Signal Strength</option>
            <option value="transactionCount">Transaction Count</option>
            <option value="energyConsumption">Energy Consumption</option>
          </select>
        </div>
      </div>

      <div className="metrics-visualization">
        {/* Placeholder for chart visualization - in a real app, use a charting library */}
        <div className="chart-placeholder">
          <div className="chart-title">
            {selectedMetric === 'uptime' && 'Device Uptime (%)'}
            {selectedMetric === 'dataTransmitted' && 'Data Transmitted'}
            {selectedMetric === 'batteryLevel' && 'Battery Level (%)'}
            {selectedMetric === 'signalStrength' && 'Signal Strength (%)'}
            {selectedMetric === 'transactionCount' && 'Blockchain Transactions'}
            {selectedMetric === 'energyConsumption' && 'Energy Consumption (kWh)'}
          </div>
          <div className="chart-area">
            {metrics.map((metric, index) => (
              <div 
                key={metric.deviceId} 
                className="chart-bar-container"
                style={{ 
                  width: `${100 / metrics.length}%`,
                  left: `${(100 / metrics.length) * index}%`
                }}
              >
                <div 
                  className={`chart-bar ${getMetricColor(metric, selectedMetric)}`}
                  style={{ 
                    height: selectedMetric === 'uptime' ? `${metric.uptime}%` : 
                           selectedMetric === 'batteryLevel' && metric.batteryLevel ? `${metric.batteryLevel}%` :
                           selectedMetric === 'signalStrength' && metric.signalStrength ? `${metric.signalStrength}%` :
                           selectedMetric === 'dataTransmitted' ? `${Math.min(100, (metric.dataTransmitted / 50))}%` :
                           selectedMetric === 'transactionCount' ? `${Math.min(100, (metric.transactionCount / 10))}%` :
                           selectedMetric === 'energyConsumption' && metric.energyConsumption ? `${Math.min(100, (metric.energyConsumption * 300))}%` : '0%'
                  }}
                ></div>
                <div className="chart-label">{metric.deviceName.split(' ')[0]}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="metrics-table">
        <table>
          <thead>
            <tr>
              <th>Device</th>
              <th>Uptime</th>
              <th>Data Transmitted</th>
              <th>Battery</th>
              <th>Signal</th>
              <th>Transactions</th>
              <th>Last Sync</th>
            </tr>
          </thead>
          <tbody>
            {metrics.map(metric => (
              <tr key={metric.deviceId}>
                <td>{metric.deviceName}</td>
                <td className={getMetricColor(metric, 'uptime')}>{metric.uptime}%</td>
                <td>{formatDataTransmitted(metric.dataTransmitted)}</td>
                <td className={getMetricColor(metric, 'batteryLevel')}>
                  {metric.batteryLevel ? `${metric.batteryLevel}%` : 'N/A'}
                </td>
                <td className={getMetricColor(metric, 'signalStrength')}>
                  {metric.signalStrength ? `${metric.signalStrength}%` : 'N/A'}
                </td>
                <td>{metric.transactionCount}</td>
                <td>{formatTimestamp(metric.lastSync)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DeviceMetrics; 