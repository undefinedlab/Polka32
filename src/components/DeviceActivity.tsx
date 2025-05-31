import { useState, useEffect } from 'react';

interface DeviceActivityProps {
  contractAddress: string;
  blockscoutApi: string;
  deviceTransactions?: Transaction[];
  selectedDevice?: Device;
  transactionsLoading?: boolean;
  globalSearchTerm?: string;
}

interface Device {
  id: string;
  name: string;
  manufacturer: string;
  model: string;
  owner: string;
  status: 'active' | 'inactive' | 'maintenance';
  lastSeen: string;
  verificationStatus: 'verified' | 'pending' | 'unverified';
  ipfsHash: string;
  isReal?: boolean;
  description?: string;
  type?: string;
  walletAddress?: string;
}

interface Transaction {
  hash: string;
  block: number;
  timestamp: string;
  from: {
    hash: string;
  };
  to: {
    hash: string;
  };
  value: string;
  method: string;
  gas_used: string;
  gas_price: string;
  fee: {
    value: string;
    type: string;
  };
}

interface ActivityEvent {
  id: string;
  deviceId: string;
  deviceName: string;
  eventType: 'data' | 'status' | 'alert' | 'maintenance' | 'transaction';
  timestamp: string;
  description: string;
  txHash?: string;
  severity?: 'low' | 'medium' | 'high' | 'critical';
  value?: string;
  from?: string;
  to?: string;
  method?: string;
}

const DeviceActivity = ({ 
  contractAddress, 
  blockscoutApi, 
  deviceTransactions = [], 
  selectedDevice,
  transactionsLoading = false,
  globalSearchTerm = '' 
}: DeviceActivityProps) => {
  const [activities, setActivities] = useState<ActivityEvent[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<string>('all');

  // Mock data for demonstration
  const mockActivities: ActivityEvent[] = [
    {
      id: 'act1',
      deviceId: '0x2b3c4d5e6f7g',
      deviceName: 'Surveillance Camera',
      eventType: 'data',
      timestamp: new Date().toISOString(),
      description: 'Motion detected in Zone A - Recording started',
      txHash: '0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890'
    },
    {
      id: 'act2',
      deviceId: '0x3c4d5e6f7g8h',
      deviceName: 'Smart Lock Pro',
      eventType: 'status',
      timestamp: new Date(Date.now() - 300000).toISOString(), // 5 minutes ago
      description: 'Device status changed to LOCKED',
      txHash: '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef'
    },
    {
      id: 'act3',
      deviceId: '0x4d5e6f7g8h9i',
      deviceName: 'Environmental Sensor',
      eventType: 'alert',
      timestamp: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
      description: 'Air quality below threshold: PM2.5 level at 35µg/m³',
      severity: 'medium',
      txHash: '0x2345678901abcdef2345678901abcdef2345678901abcdef2345678901abcdef'
    },
    {
      id: 'act4',
      deviceId: '0x5e6f7g8h9i0j',
      deviceName: 'Smart Irrigation Controller',
      eventType: 'maintenance',
      timestamp: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
      description: 'Scheduled maintenance: Filter replacement required',
      txHash: '0x3456789012abcdef3456789012abcdef3456789012abcdef3456789012abcdef'
    },
    {
      id: 'act5',
      deviceId: '0x2b3c4d5e6f7g',
      deviceName: 'Surveillance Camera',
      eventType: 'alert',
      timestamp: new Date(Date.now() - 7200000).toISOString(), // 2 hours ago
      description: 'Connection lost with security system',
      severity: 'high',
      txHash: '0x4567890123abcdef4567890123abcdef4567890123abcdef4567890123abcdef'
    }
  ];

  const formatValue = (value: string) => {
    const valueInEth = parseFloat(value) / 1e18;
    return valueInEth.toFixed(6);
  };

  useEffect(() => {
    // Convert passed transaction data to activity events
    const transactionActivities: ActivityEvent[] = deviceTransactions
      .filter((tx: Transaction) => tx && typeof tx === 'object' && tx.hash)
      .map((tx: Transaction, index: number) => ({
        id: `device-tx-${index}`,
        deviceId: selectedDevice?.id || 'unknown',
        deviceName: selectedDevice?.name || 'Unknown Device',
        eventType: 'transaction' as const,
        timestamp: tx.timestamp,
        description: `${tx.method || 'Transfer'} transaction - ${formatValue(tx.value)} ETH`,
        txHash: tx.hash,
        value: tx.value,
        from: tx.from?.hash,
        to: tx.to?.hash,
        method: tx.method
      }));

    // Combine with mock activities and sort by timestamp
    const allActivities = [...mockActivities, ...transactionActivities]
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    
    setActivities(allActivities);
  }, [deviceTransactions, selectedDevice]);

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    
    if (diffMins < 60) {
      return `${diffMins} min${diffMins !== 1 ? 's' : ''} ago`;
    } else if (diffMins < 1440) {
      const hours = Math.floor(diffMins / 60);
      return `${hours} hour${hours !== 1 ? 's' : ''} ago`;
    } else {
      const days = Math.floor(diffMins / 1440);
      return `${days} day${days !== 1 ? 's' : ''} ago`;
    }
  };

  const getEventTypeIcon = (eventType: string) => {
    switch (eventType) {
      case 'data':
        return '📊';
      case 'status':
        return '🔄';
      case 'alert':
        return '⚠️';
      case 'maintenance':
        return '🔧';
      case 'transaction':
        return '💳';
      default:
        return '📝';
    }
  };

  const getEventTypeClass = (eventType: string) => {
    switch (eventType) {
      case 'data':
        return 'event-data';
      case 'status':
        return 'event-status';
      case 'alert':
        return 'event-alert';
      case 'maintenance':
        return 'event-maintenance';
      case 'transaction':
        return 'event-transaction';
      default:
        return '';
    }
  };

  const getSeverityClass = (severity?: string) => {
    if (!severity) return '';
    
    switch (severity) {
      case 'low':
        return 'severity-low';
      case 'medium':
        return 'severity-medium';
      case 'high':
        return 'severity-high';
      case 'critical':
        return 'severity-critical';
      default:
        return '';
    }
  };

  const filteredActivities = activities.filter(activity => {
    if (filter === 'all') return true;
    return activity.eventType === filter;
  });

  if (transactionsLoading) {
    return <div className="device-activity-loading">Loading device activity...</div>;
  }

  if (error) {
    return <div className="device-activity-error">{error}</div>;
  }

  return (
    <div className="device-activity">
      <div className="activity-header">
        <h3>Device Activity & Transactions</h3>
        <div className="activity-filters">
          <button 
            className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
            onClick={() => setFilter('all')}
          >
            All ({activities.length})
          </button>
          <button 
            className={`filter-btn ${filter === 'transaction' ? 'active' : ''}`}
            onClick={() => setFilter('transaction')}
          >
            Transactions ({activities.filter(a => a.eventType === 'transaction').length})
          </button>
          <button 
            className={`filter-btn ${filter === 'data' ? 'active' : ''}`}
            onClick={() => setFilter('data')}
          >
            Data
          </button>
          <button 
            className={`filter-btn ${filter === 'status' ? 'active' : ''}`}
            onClick={() => setFilter('status')}
          >
            Status
          </button>
          <button 
            className={`filter-btn ${filter === 'alert' ? 'active' : ''}`}
            onClick={() => setFilter('alert')}
          >
            Alerts
          </button>
          <button 
            className={`filter-btn ${filter === 'maintenance' ? 'active' : ''}`}
            onClick={() => setFilter('maintenance')}
          >
            Maintenance
          </button>
        </div>
      </div>

      {filteredActivities.length > 0 ? (
        <div className="activity-timeline">
          {filteredActivities.map(activity => (
            <div key={activity.id} className={`activity-item ${getEventTypeClass(activity.eventType)}`}>
              <div className="activity-icon">
                {getEventTypeIcon(activity.eventType)}
              </div>
              <div className="activity-content">
                <div className="activity-header">
                  <span className="activity-device">{activity.deviceName}</span>
                  <span className="activity-time">{formatTimestamp(activity.timestamp)}</span>
                </div>
                <div className="activity-description">
                  {activity.description}
                  {activity.severity && (
                    <span className={`activity-severity ${getSeverityClass(activity.severity)}`}>
                      {activity.severity.toUpperCase()}
                    </span>
                  )}
                </div>
                {activity.txHash && (
                  <div className="activity-transaction">
                    <a 
                      href={`https://arbitrum-sepolia.blockscout.com/tx/${activity.txHash}`}
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="tx-link"
                    >
                      View Transaction: {activity.txHash.substring(0, 10)}...
                    </a>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="no-activity">
          No activity events found matching your criteria.
        </div>
      )}
    </div>
  );
};

export default DeviceActivity; 