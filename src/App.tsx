import { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';
import DeviceRegistry from './components/DeviceRegistry';
import DeviceActivity from './components/DeviceActivity';
import DeviceMetrics from './components/DeviceMetrics';

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

function App() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [nextPageParams, setNextPageParams] = useState<string | null>(null);
  const [globalSearchTerm, setGlobalSearchTerm] = useState<string>('');
  const [activeFilter, setActiveFilter] = useState<string>('devices');
  
  // Contract address for Arbitrum Sepolia
  const CONTRACT_ADDRESS = '0x2F1AEdd2D80806B0405b44021B0448a8f073f73b';
  const BLOCKSCOUT_API = 'https://arbitrum-sepolia.blockscout.com/api/v2';

  const fetchTransactions = async (pageParams?: string) => {
    try {
      setLoading(true);
      
      // Construct the URL with proper parameters
      let endpoint = `${BLOCKSCOUT_API}/addresses/${CONTRACT_ADDRESS}/transactions`;
      if (pageParams) {
        endpoint += `?${pageParams}`;
      }
      
      console.log('Fetching transactions from:', endpoint);
      
      const response = await axios.get(endpoint);
      
      if (response.data && response.data.items) {
        console.log('Transactions fetched:', response.data.items.length);
        
        // Log the first transaction to see its structure
        if (response.data.items.length > 0) {
          console.log('First transaction structure:', JSON.stringify(response.data.items[0]));
        }
        
        // Filter out any invalid transaction objects
        const validTransactions = response.data.items.filter((tx: any) => 
          tx && typeof tx === 'object' && tx.hash
        );
        
        console.log('Valid transactions:', validTransactions.length);
        
        if (pageParams) {
          setTransactions(prev => [...prev, ...validTransactions]);
        } else {
          setTransactions(validTransactions);
        }
        
        // Store next page params if available
        if (response.data.next_page_params) {
          const params = new URLSearchParams();
          Object.entries(response.data.next_page_params).forEach(([key, value]) => {
            params.append(key, value as string);
          });
          setNextPageParams(params.toString());
          console.log('Next page params:', params.toString());
        } else {
          setNextPageParams(null);
        }
      } else {
        console.log('No transactions found or invalid response format');
      }
      
      setLoading(false);
    } catch (err) {
      console.error('Error fetching transactions:', err);
      setError('Failed to fetch transactions. Please try again later.');
      setLoading(false);
    }
  };

  useEffect(() => {
    // Initial fetch of transactions
    fetchTransactions();
  }, []);

  const loadMore = () => {
    if (nextPageParams) {
      fetchTransactions(nextPageParams);
    }
  };

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleString();
  };

  const formatValue = (value: string) => {
    const valueInEth = parseFloat(value) / 1e18;
    return valueInEth.toFixed(6) + ' ETH';
  };

  // Transaction tab content
  const TransactionsTab = () => (
    <div className="transactions-tab">
      {error && <div className="error">{error}</div>}
      
      {transactions.length > 0 ? (
        <div className="transactions">
          <table>
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
              {transactions.map((tx) => (
                <tr key={tx?.hash || `tx-${Math.random()}`}>
                  <td>
                    <a 
                      href={`https://arbitrum-sepolia.blockscout.com/tx/${tx?.hash || ''}`}
                      target="_blank" 
                      rel="noopener noreferrer"
                    >
                      {tx?.hash ? `${tx.hash.substring(0, 8)}...${tx.hash.substring(tx.hash.length - 6)}` : 'Unknown'}
                    </a>
                  </td>
                  <td>
                    <a 
                      href={`https://arbitrum-sepolia.blockscout.com/block/${tx?.block || ''}`}
                      target="_blank" 
                      rel="noopener noreferrer"
                    >
                      {tx?.block || 'Unknown'}
                    </a>
                  </td>
                  <td>{tx?.timestamp ? formatTimestamp(tx.timestamp) : 'Unknown'}</td>
                  <td>
                    {tx?.from?.hash ? (
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
                    {tx?.to?.hash ? (
                    <a 
                      href={`https://arbitrum-sepolia.blockscout.com/address/${tx.to.hash}`}
                      target="_blank" 
                      rel="noopener noreferrer"
                    >
                      {tx.to.hash.substring(0, 8)}...{tx.to.hash.substring(tx.to.hash.length - 6)}
                    </a>
                    ) : 'Unknown'}
                  </td>
                  <td>{tx?.value ? formatValue(tx.value) : '0 ETH'}</td>
                  <td>{tx?.method || 'Transfer'}</td>
                  <td>{tx?.gas_used || 'Unknown'}</td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {nextPageParams && (
            <div className="load-more">
              <button onClick={loadMore} disabled={loading}>
                {loading ? 'Loading...' : 'Load More'}
              </button>
            </div>
          )}
        </div>
      ) : !loading ? (
        <div className="no-transactions">
          No transactions found for this contract address.
        </div>
      ) : null}
      
      {loading && transactions.length === 0 && <div className="loading">Loading transactions...</div>}
    </div>
  );

  const filters = [
    {
      id: 'devices',
      label: 'Devices',
      icon: '🔌',
      count: 4
    },
    {
      id: 'activity',
      label: 'Activity',
      icon: '📊',
      count: 12
    },
    {
      id: 'metrics',
      label: 'Metrics',
      icon: '📈',
      count: 8
    },
    {
      id: 'transactions',
      label: 'Transactions',
      icon: '💳',
      count: transactions.length
    }
  ];

  const renderContent = () => {
    switch (activeFilter) {
      case 'devices':
        return <DeviceRegistry contractAddress={CONTRACT_ADDRESS} blockscoutApi={BLOCKSCOUT_API} globalSearchTerm={globalSearchTerm} />;
      case 'activity':
        return <DeviceActivity contractAddress={CONTRACT_ADDRESS} blockscoutApi={BLOCKSCOUT_API} globalSearchTerm={globalSearchTerm} />;
      case 'metrics':
        return <DeviceMetrics contractAddress={CONTRACT_ADDRESS} blockscoutApi={BLOCKSCOUT_API} />;
      case 'transactions':
        return <TransactionsTab />;
      default:
        return <DeviceRegistry contractAddress={CONTRACT_ADDRESS} blockscoutApi={BLOCKSCOUT_API} globalSearchTerm={globalSearchTerm} />;
    }
  };

  return (
    <div className="App">
      <main className="main-container">
        {/* Header Section */}
        <div className="header-section">
          <h1 className="main-title">DeviceScout</h1>
          <p className="main-subtitle">Web3 IoT Device Explorer</p>
          
          <div className="global-search">
            <div className="search-container">
              <svg className="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <circle cx="11" cy="11" r="8"></circle>
                <path d="m21 21-4.35-4.35"></path>
              </svg>
              <input
                type="text"
                placeholder="Search devices, manufacturers, or device IDs..."
                value={globalSearchTerm}
                onChange={(e) => setGlobalSearchTerm(e.target.value)}
                className="global-search-input"
              />
              {globalSearchTerm && (
                <button 
                  className="clear-search"
                  onClick={() => setGlobalSearchTerm('')}
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                  </svg>
                </button>
              )}
            </div>
          </div>

          <div className="powered-by">
            <p>
              Powered by <a href="https://blockscout.com" target="_blank" rel="noopener noreferrer">Blockscout</a> API
            </p>
          </div>
        </div>

        {/* Filter Buttons */}
        <div className="filter-section">
          <div className="filter-buttons">
            {filters.map((filter) => (
              <button
                key={filter.id}
                className={`filter-button ${activeFilter === filter.id ? 'active' : ''}`}
                onClick={() => setActiveFilter(filter.id)}
              >
                <span className="filter-icon">{filter.icon}</span>
                <span className="filter-label">{filter.label}</span>
                <span className="filter-count">{filter.count}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Content Section */}
        <div className="content-section">
          {renderContent()}
        </div>
      </main>
    </div>
  );
}

export default App;
