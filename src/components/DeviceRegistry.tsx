import { useState, useEffect } from 'react';
import axios from 'axios';
import DeviceActivity from './DeviceActivity';

interface DeviceRegistryProps {
  contractAddress: string;
  blockscoutApi: string;
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

const DeviceRegistry = ({ contractAddress, blockscoutApi, globalSearchTerm = '' }: DeviceRegistryProps) => {
  const [devices, setDevices] = useState<Device[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedDevice, setSelectedDevice] = useState<Device | null>(null);
  const [deviceTransactions, setDeviceTransactions] = useState<Transaction[]>([]);
  const [transactionsLoading, setTransactionsLoading] = useState<boolean>(false);
  const [deviceLogs, setDeviceLogs] = useState<any[]>([]);
  const [logsLoading, setLogsLoading] = useState<boolean>(false);

  // Real Bitogochi wallet address
  const BITOGOCHI_WALLET = '0x67A71d74e3d0b52996Deb690E623d8C9946Ba5E7';
  // Contract address to show transactions for
  const CONTRACT_ADDRESS = '0x2F1AEdd2D80806B0405b44021B0448a8f073f73b';

  // Mock data for demonstration - in a real app, this would come from the blockchain
  const mockDevices: Device[] = [
    {
      id: '0x1a2b3c4d5e6f',
      name: 'Bitogochi Device',
      manufacturer: 'Bitogochi Labs',
      model: 'BT-2023',
      owner: BITOGOCHI_WALLET,
      walletAddress: CONTRACT_ADDRESS, // Use contract address for transactions
      status: 'active',
      lastSeen: new Date().toISOString(),
      verificationStatus: 'verified',
      ipfsHash: 'QmT78zSuBmuS4z925WZfrqQ1qHaJ56DQaTfyMUF7F8ff5o',
      isReal: true,
      description: 'Blockchain-connected virtual pet device with LED display under light control. Tracks real contract transactions.',
      type: 'gaming'
    },
    {
      id: '0x2b3c4d5e6f7g',
      name: 'Surveillance Camera',
      manufacturer: 'SecureVision',
      model: 'SV-100',
      owner: '0x2F1AEdd2D80806B0405b44021B0448a8f073f73b',
      status: 'active',
      lastSeen: new Date().toISOString(),
      verificationStatus: 'verified',
      ipfsHash: 'QmT78zSuBmuS4z925WZfrqQ1qHaJ56DQaTfyMUF7F8ff5p',
      isReal: false,
      description: 'Blockchain-secured surveillance camera with tamper-proof footage storage',
      type: 'security'
    },
    {
      id: '0x3c4d5e6f7g8h',
      name: 'Humidity Sensor',
      manufacturer: 'GreenSense',
      model: 'HS-2023',
      owner: contractAddress,
      status: 'active',
      lastSeen: new Date(Date.now() - 86400000).toISOString(),
      verificationStatus: 'verified',
      ipfsHash: 'QmT78zSuBmuS4z925WZfrqQ1qHaJ56DQaTfyMUF7F8ff5q',
      isReal: false,
      description: 'Environmental humidity sensor with blockchain data verification',
      type: 'environmental'
    },
    {
      id: '0x4d5e6f7g8h9i',
      name: 'Solar Panel Controller',
      manufacturer: 'SolarLogic',
      model: 'SP-500',
      owner: '0x67A71d74e3d0b52996Deb690E623d8C9946Ba5E7',
      status: 'active',
      lastSeen: new Date(Date.now() - 172800000).toISOString(),
      verificationStatus: 'verified',
      ipfsHash: 'QmT78zSuBmuS4z925WZfrqQ1qHaJ56DQaTfyMUF7F8ff5r',
      isReal: false,
      description: 'Solar panel controller with energy production tracking on blockchain',
      type: 'energy'
    }
  ];

  // Fetch real transactions for a wallet address
  const fetchWalletTransactions = async (walletAddress: string) => {
    try {
      setTransactionsLoading(true);
      
      const endpoint = `${blockscoutApi}/addresses/${walletAddress}/transactions`;
      console.log('Fetching wallet transactions from:', endpoint);
      
      const response = await axios.get(endpoint);
      
      if (response.data && response.data.items) {
        console.log('Wallet transactions fetched:', response.data.items.length);
        
        // Filter out any invalid transaction objects and get more transactions for contract
        const validTransactions = response.data.items.filter((tx: any) => 
          tx && typeof tx === 'object' && tx.hash
        ).slice(0, 20); // Show more transactions for contract
        
        setDeviceTransactions(validTransactions);
      } else {
        setDeviceTransactions([]);
      }
      
      setTransactionsLoading(false);
    } catch (err) {
      console.error('Error fetching wallet transactions:', err);
      setDeviceTransactions([]);
      setTransactionsLoading(false);
    }
  };

  // Fetch contract logs
  const fetchContractLogs = async (contractAddress: string) => {
    try {
      setLogsLoading(true);
      
      const endpoint = `${blockscoutApi}/addresses/${contractAddress}/logs`;
      console.log('Fetching contract logs from:', endpoint);
      
      const response = await axios.get(endpoint);
      
      if (response.data && response.data.items) {
        console.log('Contract logs fetched:', response.data.items.length);
        
        // Get recent logs
        const recentLogs = response.data.items.slice(0, 15);
        setDeviceLogs(recentLogs);
      } else {
        setDeviceLogs([]);
      }
      
      setLogsLoading(false);
    } catch (err) {
      console.error('Error fetching contract logs:', err);
      setDeviceLogs([]);
      setLogsLoading(false);
    }
  };

  useEffect(() => {
    const fetchDevices = async () => {
      try {
        setLoading(true);
        // In a real app, we would fetch from the blockchain via the API
        // For now, we'll use mock data
        setTimeout(() => {
          setDevices(mockDevices);
          setLoading(false);
        }, 1000);
      } catch (err) {
        console.error('Error fetching devices:', err);
        setError('Failed to fetch devices. Please try again later.');
        setLoading(false);
      }
    };

    fetchDevices();
  }, [contractAddress, blockscoutApi]);

  // Check if search term is a wallet address and auto-open Bitogochi if it matches
  useEffect(() => {
    if (globalSearchTerm && (
      globalSearchTerm.toLowerCase() === BITOGOCHI_WALLET.toLowerCase() ||
      globalSearchTerm.toLowerCase() === CONTRACT_ADDRESS.toLowerCase()
    )) {
      const bitogochi = mockDevices.find(device => device.walletAddress === CONTRACT_ADDRESS);
      if (bitogochi && !selectedDevice) {
        setSelectedDevice(bitogochi);
        fetchWalletTransactions(CONTRACT_ADDRESS);
        fetchContractLogs(CONTRACT_ADDRESS);
      }
    }
  }, [globalSearchTerm, selectedDevice]);

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

  const formatValue = (value: string) => {
    const valueInEth = parseFloat(value) / 1e18;
    return valueInEth.toFixed(6) + ' ETH';
  };

  const filteredDevices = devices.filter(device => {
    const matchesSearch = device.name.toLowerCase().includes(globalSearchTerm.toLowerCase()) ||
                         device.manufacturer.toLowerCase().includes(globalSearchTerm.toLowerCase()) ||
                         device.id.toLowerCase().includes(globalSearchTerm.toLowerCase()) ||
                         (device.walletAddress && device.walletAddress.toLowerCase().includes(globalSearchTerm.toLowerCase()));
    
    return matchesSearch;
  });

  const getStatusClass = (status: string) => {
    switch (status) {
      case 'active':
        return 'status-active';
      case 'inactive':
        return 'status-inactive';
      case 'maintenance':
        return 'status-maintenance';
      default:
        return '';
    }
  };

  const getVerificationClass = (status: string) => {
    switch (status) {
      case 'verified':
        return 'verification-verified';
      case 'pending':
        return 'verification-pending';
      case 'unverified':
        return 'verification-unverified';
      default:
        return '';
    }
  };

  const handleDeviceClick = (device: Device) => {
    setSelectedDevice(device);
    // Fetch real transactions if this device has a wallet address
    if (device.walletAddress) {
      fetchWalletTransactions(device.walletAddress);
      // Also fetch logs if this is the contract address
      if (device.walletAddress === CONTRACT_ADDRESS) {
        fetchContractLogs(device.walletAddress);
      }
    }
  };

  const handleBackClick = () => {
    setSelectedDevice(null);
    setDeviceTransactions([]);
    setDeviceLogs([]);
  };

  if (loading) {
    return <div className="device-registry-loading">Loading devices...</div>;
  }

  if (error) {
    return <div className="device-registry-error">{error}</div>;
  }

  // Device detail view
  if (selectedDevice) {
    return (
      <div className="device-detail">
        <button className="back-button" onClick={handleBackClick}>
          ← Back to Devices
        </button>
        
        <div className="device-detail-header">
          <h2>{selectedDevice.name}</h2>
          <span className={`device-status ${getStatusClass(selectedDevice.status)}`}>
            {selectedDevice.status.charAt(0).toUpperCase() + selectedDevice.status.slice(1)}
          </span>
        </div>
        
        <div className="device-detail-info">
          <div className="detail-main">
            <div className="detail-section">
              <h3>Device Information</h3>
              <div className="detail-grid">
                <div className="detail-item">
                  <span className="detail-label">Device ID:</span>
                  <span className="detail-value">{selectedDevice.id}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Manufacturer:</span>
                  <span className="detail-value">{selectedDevice.manufacturer}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Model:</span>
                  <span className="detail-value">{selectedDevice.model}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Type:</span>
                  <span className="detail-value">{selectedDevice.type?.toUpperCase()}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Owner:</span>
                  <span className="detail-value">
                    <a 
                      href={`https://arbitrum-sepolia.blockscout.com/address/${selectedDevice.owner}`}
                      target="_blank" 
                      rel="noopener noreferrer"
                    >
                      {selectedDevice.owner.substring(0, 8)}...{selectedDevice.owner.substring(selectedDevice.owner.length - 6)}
                    </a>
                  </span>
                </div>
                {selectedDevice.walletAddress && (
                  <div className="detail-item">
                    <span className="detail-label">Wallet Address:</span>
                    <span className="detail-value">
                      <a 
                        href={`https://arbitrum-sepolia.blockscout.com/address/${selectedDevice.walletAddress}`}
                        target="_blank" 
                        rel="noopener noreferrer"
                      >
                        {selectedDevice.walletAddress.substring(0, 8)}...{selectedDevice.walletAddress.substring(selectedDevice.walletAddress.length - 6)}
                      </a>
                    </span>
                  </div>
                )}
                <div className="detail-item">
                  <span className="detail-label">Last Seen:</span>
                  <span className="detail-value">{formatTimestamp(selectedDevice.lastSeen)}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Verification:</span>
                  <span className={`verification-badge ${getVerificationClass(selectedDevice.verificationStatus)}`}>
                    {selectedDevice.verificationStatus.charAt(0).toUpperCase() + selectedDevice.verificationStatus.slice(1)}
                  </span>
                </div>
                <div className="detail-item full-width">
                  <span className="detail-label">Description:</span>
                  <span className="detail-value">{selectedDevice.description}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">IPFS Hash:</span>
                  <span className="detail-value">
                    <a 
                      href={`https://ipfs.io/ipfs/${selectedDevice.ipfsHash}`}
                      target="_blank" 
                      rel="noopener noreferrer"
                    >
                      {selectedDevice.ipfsHash.substring(0, 8)}...{selectedDevice.ipfsHash.substring(selectedDevice.ipfsHash.length - 6)}
                    </a>
                  </span>
                </div>
              </div>
            </div>

            <div className="device-transactions">
              <h3>{selectedDevice.walletAddress === CONTRACT_ADDRESS ? 'Contract Transactions' : selectedDevice.walletAddress ? 'Real Wallet Transactions' : 'Recent Transactions'}</h3>
              {transactionsLoading ? (
                <div className="loading">Loading transactions...</div>
              ) : deviceTransactions.length > 0 ? (
                <table className="transactions-table">
                  <thead>
                    <tr>
                      <th>Tx Hash</th>
                      <th>Block</th>
                      <th>Time</th>
                      <th>From</th>
                      <th>To</th>
                      <th>Value</th>
                      <th>Method</th>
                      <th>Gas Used</th>
                    </tr>
                  </thead>
                  <tbody>
                    {deviceTransactions.map((tx, index) => (
                      <tr key={tx.hash || index}>
                        <td>
                          <a href={`https://arbitrum-sepolia.blockscout.com/tx/${tx.hash}`} target="_blank" rel="noopener noreferrer">
                            {tx.hash.substring(0, 8)}...{tx.hash.substring(tx.hash.length - 6)}
                          </a>
                        </td>
                        <td>
                          <a 
                            href={`https://arbitrum-sepolia.blockscout.com/block/${tx.block || ''}`}
                            target="_blank" 
                            rel="noopener noreferrer"
                          >
                            {tx.block || 'Unknown'}
                          </a>
                        </td>
                        <td>{formatTimestamp(tx.timestamp)}</td>
                        <td>
                          {tx.from?.hash ? (
                            <a 
                              href={`https://arbitrum-sepolia.blockscout.com/address/${tx.from.hash}`}
                              target="_blank" 
                              rel="noopener noreferrer"
                            >
                              {tx.from.hash.substring(0, 8)}...{tx.from.hash.substring(tx.from.hash.length - 6)}
                            </a>
                          ) : 'Unknown'}
                        </td>
                        <td>
                          {tx.to?.hash ? (
                            <a 
                              href={`https://arbitrum-sepolia.blockscout.com/address/${tx.to.hash}`}
                              target="_blank" 
                              rel="noopener noreferrer"
                            >
                              {tx.to.hash.substring(0, 8)}...{tx.to.hash.substring(tx.to.hash.length - 6)}
                            </a>
                          ) : 'Unknown'}
                        </td>
                        <td>{formatValue(tx.value)}</td>
                        <td>{tx.method || 'Transfer'}</td>
                        <td>{tx.gas_used || 'Unknown'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div className="no-transactions">
                  {selectedDevice.walletAddress ? 
                    'No transactions found for this address.' : 
                    'No transactions available for this device.'
                  }
                </div>
              )}
            </div>

            {/* Contract Logs Section - Only show for contract addresses */}
            {selectedDevice.walletAddress === CONTRACT_ADDRESS && (
              <div className="device-logs">
                <h3>Contract Logs</h3>
                {logsLoading ? (
                  <div className="loading">Loading contract logs...</div>
                ) : deviceLogs.length > 0 ? (
                  <table className="logs-table">
                    <thead>
                      <tr>
                        <th>Tx Hash</th>
                        <th>Block</th>
                        <th>Time</th>
                        <th>Event</th>
                        <th>Topics</th>
                        <th>Data</th>
                      </tr>
                    </thead>
                    <tbody>
                      {deviceLogs.map((log, index) => (
                        <tr key={`${log.transaction_hash || 'unknown'}-${index}`}>
                          <td>
                            {log.transaction_hash ? (
                              <a href={`https://arbitrum-sepolia.blockscout.com/tx/${log.transaction_hash}`} target="_blank" rel="noopener noreferrer">
                                {log.transaction_hash.substring(0, 8)}...{log.transaction_hash.substring(log.transaction_hash.length - 6)}
                              </a>
                            ) : (
                              'Unknown'
                            )}
                          </td>
                          <td>
                            {log.block_number ? (
                              <a 
                                href={`https://arbitrum-sepolia.blockscout.com/block/${log.block_number}`}
                                target="_blank" 
                                rel="noopener noreferrer"
                              >
                                {log.block_number}
                              </a>
                            ) : (
                              'Unknown'
                            )}
                          </td>
                          <td>{log.block_timestamp ? formatTimestamp(log.block_timestamp) : 'Unknown'}</td>
                          <td>{log.decoded?.method_call || (log.topics?.[0] ? log.topics[0].substring(0, 10) + '...' : 'Unknown')}</td>
                          <td>
                            <div className="topics-list">
                              {log.topics?.slice(0, 2).map((topic: string, i: number) => (
                                topic ? (
                                  <div key={i} className="topic-item">
                                    {topic.substring(0, 10)}...
                                  </div>
                                ) : null
                              )) || <div className="topic-item">No topics</div>}
                            </div>
                          </td>
                          <td>
                            <div className="log-data">
                              {log.data ? `${log.data.substring(0, 20)}...` : 'No data'}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <div className="no-logs">
                    No contract logs found for this address.
                  </div>
                )}
              </div>
            )}

            {/* Device Activity Section - Pass the same transaction data */}
            <DeviceActivity 
              contractAddress={contractAddress} 
              blockscoutApi={blockscoutApi} 
              deviceTransactions={deviceTransactions}
              selectedDevice={selectedDevice}
              transactionsLoading={transactionsLoading}
            />
          </div>
          
          <div className="device-actions-panel">
            <h3>Quick Actions</h3>
            <button className="action-button primary">View All Transactions</button>
            <button className="action-button secondary">Device Metrics</button>
            <button className="action-button secondary">Activity Log</button>
            <button className="action-button">Manage Access</button>
            <button className="action-button">Update Firmware</button>
            <button className="action-button">Export Data</button>
          </div>
        </div>
      </div>
    );
  }

  // Main devices grid view
  return (
    <div className="device-registry">
      {filteredDevices.length > 0 ? (
        <div className="devices-grid">
          {filteredDevices.map(device => (
            <div 
              key={device.id} 
              className={`device-card ${!device.isReal ? 'device-mock' : ''}`}
              onClick={() => handleDeviceClick(device)}
            >
              <div className="device-header">
                <div className="device-title">
                  <h3>{device.name}</h3>
                  <span className="device-type">{device.type?.toUpperCase()}</span>
                </div>
                <span className={`device-status ${getStatusClass(device.status)}`}>
                  {device.status.charAt(0).toUpperCase() + device.status.slice(1)}
                </span>
              </div>
              
              <div className="device-body">
                <div className="device-info">
                  <div className="info-row">
                    <span className="info-label">Manufacturer</span>
                    <span className="info-value">{device.manufacturer}</span>
                  </div>
                  <div className="info-row">
                    <span className="info-label">Model</span>
                    <span className="info-value">{device.model}</span>
                  </div>
                  <div className="info-row">
                    <span className="info-label">Last Seen</span>
                    <span className="info-value">{formatTimestamp(device.lastSeen)}</span>
                  </div>
                </div>
                
                <div className="device-verification">
                  <span className={`verification-badge ${getVerificationClass(device.verificationStatus)}`}>
                    {device.verificationStatus.charAt(0).toUpperCase() + device.verificationStatus.slice(1)}
                  </span>
                </div>
              </div>
              
              <div className="device-footer">
                <div className="owner-info">
                  <span className="owner-label">Owner:</span>
                  <a 
                    href={`https://arbitrum-sepolia.blockscout.com/address/${device.owner}`}
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="owner-link"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {device.owner.substring(0, 6)}...{device.owner.substring(device.owner.length - 4)}
                  </a>
                </div>
                <button 
                  className="view-details-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeviceClick(device);
                  }}
                >
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="no-devices">
          {globalSearchTerm ? 
            `No devices found matching "${globalSearchTerm}"` : 
            'No devices found in the registry.'
          }
        </div>
      )}
    </div>
  );
};

export default DeviceRegistry; 