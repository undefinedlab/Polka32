import { useState, useEffect } from 'react';
import axios from 'axios';
import { useReadContract } from 'wagmi';

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

  // Polka32 contract address and wallet to fetch devices from
  const POLKA32_CONTRACT = '0x83aC19d72648a87a7ecB6D2913C0B1B7e04b5a31';
  const POLKA32_WALLET = '0x83aC19d72648a87a7ecB6D2913C0B1B7e04b5a31';

  // Contract ABI for Polka32
  const contractABI = [
    {
      "inputs": [{"internalType": "address", "name": "a", "type": "address"}],
      "name": "get",
      "outputs": [{"internalType": "struct Polka32.Device[]", "name": "", "type": "tuple[]"}],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "total",
      "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
      "stateMutability": "view",
      "type": "function"
    }
  ];

  // Contract ABI kept for reference but not actively used
  // const { data: contractDevices, isLoading: contractLoading } = useReadContract({
  //   address: POLKA32_CONTRACT as `0x${string}`,
  //   abi: contractABI,
  //   functionName: 'get',
  //   args: [POLKA32_WALLET],
  //   query: { enabled: true }
  // });

  // Single mock device showing transactions from the Polka32 wallet
  const mockDevices: Device[] = [
    {
      id: 'polka32-main-device',
      name: 'Polka32 IoT Gateway',
      manufacturer: 'Polka32 Labs',
      model: 'ESP32-DevKit-V1',
      owner: '0x83aC19d72648a87a7ecB6D2913C0B1B7e04b5a31',
      walletAddress: '0x83aC19d72648a87a7ecB6D2913C0B1B7e04b5a31',
      status: 'active',
      lastSeen: new Date(Date.now() - 1000 * 60 * 8).toISOString(), // 8 minutes ago
      verificationStatus: 'verified',
      ipfsHash: 'QmPolka32MainDevice',
      isReal: true,
      description: 'Primary ESP32 IoT gateway device connected to Polka32 blockchain network. Click to view live transactions from 0x83aC19d72648a87a7ecB6D2913C0B1B7e04b5a31',
      type: 'gateway'
    }
  ];

  // Fetch real transactions for a wallet address
  const fetchWalletTransactions = async (walletAddress: string) => {
    try {
      setTransactionsLoading(true);
      
      // Use Paseo AssetHub Blockscout API
      const endpoint = `https://blockscout-passet-hub.parity-testnet.parity.io/api/v2/addresses/${walletAddress}/transactions`;
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
      
      // Use Paseo AssetHub Blockscout API
      const endpoint = `https://blockscout-passet-hub.parity-testnet.parity.io/api/v2/addresses/${contractAddress}/logs`;
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
    // Simply use the mock device - no contract complexity
    setLoading(false);
    setDevices(mockDevices);
    setError(null);
  }, []);

  // Check if search term matches Polka32 wallet and auto-open device
  useEffect(() => {
    if (globalSearchTerm && (
      globalSearchTerm.toLowerCase() === POLKA32_WALLET.toLowerCase() ||
      globalSearchTerm.toLowerCase() === POLKA32_CONTRACT.toLowerCase() ||
      globalSearchTerm.toLowerCase().includes('polka32')
    )) {
      const polka32Device = devices.find(device => 
        device.walletAddress === POLKA32_CONTRACT ||
        device.owner === POLKA32_WALLET
      );
      if (polka32Device && !selectedDevice) {
        setSelectedDevice(polka32Device);
        fetchWalletTransactions(POLKA32_CONTRACT);
        fetchContractLogs(POLKA32_CONTRACT);
      }
    }
  }, [globalSearchTerm, selectedDevice, devices]);

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
      // Also fetch logs if this is the Polka32 contract address
      if (device.walletAddress === POLKA32_CONTRACT) {
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
                      href={`https://blockscout-passet-hub.parity-testnet.parity.io/address/${selectedDevice.owner}`}
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
                        href={`https://blockscout-passet-hub.parity-testnet.parity.io/address/${selectedDevice.walletAddress}`}
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
                          <a href={`https://blockscout-passet-hub.parity-testnet.parity.io/tx/${tx.hash}`} target="_blank" rel="noopener noreferrer">
                            {tx.hash.substring(0, 8)}...{tx.hash.substring(tx.hash.length - 6)}
                          </a>
                        </td>
                        <td>
                          <a 
                            href={`https://blockscout-passet-hub.parity-testnet.parity.io/block/${tx.block || ''}`}
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
                              href={`https://blockscout-passet-hub.parity-testnet.parity.io/address/${tx.from.hash}`}
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
                              href={`https://blockscout-passet-hub.parity-testnet.parity.io/address/${tx.to.hash}`}
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
                    href={`https://blockscout-passet-hub.parity-testnet.parity.io/address/${device.owner}`}
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