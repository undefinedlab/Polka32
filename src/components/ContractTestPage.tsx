import { useState, useEffect } from 'react';
import { useAccount, useWriteContract, useReadContract, useWaitForTransactionReceipt } from 'wagmi';
import './ContractTestPage.css';

interface Transaction {
  hash: string;
  function: string;
  status: 'pending' | 'success' | 'error';
  timestamp: number;
  params?: any;
  error?: string;
}

interface ContractTestPageProps {
  onClose: () => void;
}

const ContractTestPage = ({ onClose }: ContractTestPageProps) => {
  const { address, isConnected } = useAccount();
  const { writeContract, data: hash, error, isPending } = useWriteContract();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [contractAddress, setContractAddress] = useState('0x83aC19d72648a87a7ecB6D2913C0B1B7e04b5a31');
  const [feedback, setFeedback] = useState<{type: 'success' | 'error' | 'info', message: string} | null>(null);
  const [currentFunction, setCurrentFunction] = useState<string>('');
  const [blockscoutTransactions, setBlockscoutTransactions] = useState<any[]>([]);
  const [isLoadingBlockscout, setIsLoadingBlockscout] = useState(false);

  // Form states for different functions
  const [registerForm, setRegisterForm] = useState({
    name: '',
    deviceType: 'sensor',
    location: ''
  });
  const [heartbeatIndex, setHeartbeatIndex] = useState(0);

  // Contract ABI - ultra-minimal
  const contractABI = [
    {
      "inputs": [{"internalType": "string", "name": "name", "type": "string"}],
      "name": "add",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [{"internalType": "uint256", "name": "i", "type": "uint256"}],
      "name": "ping",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
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

  // Read contract data with refetch capability
  const { data: userDevices, refetch: refetchUserDevices } = useReadContract({
    address: contractAddress as `0x${string}`,
    abi: contractABI,
    functionName: 'get',
    args: [address],
    query: { enabled: !!contractAddress && !!address }
  });

  // Wait for transaction receipt
  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash,
  });

  // Fetch transactions from Blockscout
  const fetchBlockscoutTransactions = async () => {
    if (!contractAddress) return;
    
    setIsLoadingBlockscout(true);
    try {
      const response = await fetch(
        `https://blockscout-passet-hub.parity-testnet.parity.io/api/v2/addresses/${contractAddress}/transactions?filter=to`
      );
      const data = await response.json();
      setBlockscoutTransactions(data.items || []);
    } catch (error) {
      console.error('Failed to fetch Blockscout transactions:', error);
    } finally {
      setIsLoadingBlockscout(false);
    }
  };

  // Force refresh contract data
  const forceRefreshData = async () => {
    try {
      await Promise.all([
        refetchUserDevices(),
        fetchBlockscoutTransactions()
      ]);
    } catch (error) {
      console.error('Failed to refresh data:', error);
    }
  };

  useEffect(() => {
    if (hash && currentFunction) {
      const newTransaction: Transaction = {
        hash,
        function: currentFunction,
        status: 'pending',
        timestamp: Date.now()
      };
      setTransactions(prev => [newTransaction, ...prev]);
      setCurrentFunction(''); // Reset after adding
    }
  }, [hash, currentFunction]);

  useEffect(() => {
    if (isConfirmed && hash) {
      setTransactions(prev => 
        prev.map(tx => 
          tx.hash === hash 
            ? { ...tx, status: 'success' as const }
            : tx
        )
      );
      setFeedback({ type: 'success', message: 'Transaction confirmed successfully!' });
      
      // Immediate refresh, then another after delay
      forceRefreshData();
      setTimeout(() => {
        forceRefreshData();
        setFeedback(null);
      }, 5000);
    }
  }, [isConfirmed, hash]);

  useEffect(() => {
    if (error) {
      const errorMessage = (error as any)?.message || 'Transaction failed';
      if (hash) {
        setTransactions(prev => 
          prev.map(tx => 
            tx.hash === hash 
              ? { ...tx, status: 'error' as const, error: errorMessage }
              : tx
          )
        );
      }
      setFeedback({ type: 'error', message: errorMessage });
      setTimeout(() => setFeedback(null), 5000);
    }
  }, [error, hash]);

  // Load initial data when contract address changes
  useEffect(() => {
    if (contractAddress) {
      fetchBlockscoutTransactions();
    }
  }, [contractAddress]);

  const handleRegisterDevice = async () => {
    if (!contractAddress || !registerForm.name) {
      setFeedback({ type: 'error', message: 'Please fill in device name and contract address' });
      return;
    }

    try {
      setCurrentFunction('Add Device');
      await writeContract({
        address: contractAddress as `0x${string}`,
        abi: contractABI,
        functionName: 'add',
        args: [registerForm.name]
      });
      
      setFeedback({ type: 'info', message: 'Transaction submitted. Waiting for confirmation...' });
    } catch (err: any) {
      setCurrentFunction('');
      setFeedback({ type: 'error', message: err?.message || 'Failed to add device' });
    }
  };

  const handleHeartbeat = async () => {
    if (!contractAddress) {
      setFeedback({ type: 'error', message: 'Please enter contract address' });
      return;
    }

    try {
      setCurrentFunction('Send Ping');
      await writeContract({
        address: contractAddress as `0x${string}`,
        abi: contractABI,
        functionName: 'ping',
        args: [heartbeatIndex]
      });
      
      setFeedback({ type: 'info', message: 'Ping submitted. Waiting for confirmation...' });
    } catch (err: any) {
      setCurrentFunction('');
      setFeedback({ type: 'error', message: err.message || 'Failed to send ping' });
    }
  };

  const formatTimestamp = (timestamp: number) => {
    return new Date(timestamp).toLocaleString();
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return '⏳';
      case 'success': return '✅';
      case 'error': return '❌';
      default: return '❓';
    }
  };

  return (
    <div className="contract-test-page">
      <div className="test-header">
        <h1>Polka32 Contract Testing</h1>
        <button className="close-btn" onClick={onClose}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
      </div>

      {/* Feedback Messages */}
      {feedback && (
        <div className={`feedback-message ${feedback.type}`}>
          <span className="feedback-icon">
            {feedback.type === 'success' ? '✅' : feedback.type === 'error' ? '❌' : 'ℹ️'}
          </span>
          {feedback.message}
        </div>
      )}

      {/* Connection Status */}
      <div className="connection-status">
        <div className="status-item">
          <span className="status-label">Wallet:</span>
          <span className={`status-value ${isConnected ? 'connected' : 'disconnected'}`}>
            {isConnected ? `${address?.slice(0, 6)}...${address?.slice(-4)}` : 'Not Connected'}
          </span>
        </div>
        <div className="status-item">
          <span className="status-label">Network:</span>
          <span className="status-value">Paseo AssetHub</span>
        </div>
      </div>

      {/* Contract Address Input */}
      <div className="contract-section">
        <h2>Contract Configuration</h2>
        <div className="form-group">
          <label htmlFor="contract-address">Contract Address:</label>
          <input
            id="contract-address"
            type="text"
            placeholder="0x..."
            value={contractAddress}
            onChange={(e) => setContractAddress(e.target.value)}
            className="contract-input"
          />
        </div>
      </div>


      {/* Contract Functions */}
      <div className="functions-section">
        <h2>Contract Functions</h2>
        
        {/* Add Device */}
        <div className="function-card">
          <h3>📝 Add Device</h3>
          <div className="function-form">
            <div className="form-group">
              <label htmlFor="device-name">Device Name:</label>
              <input
                id="device-name"
                type="text"
                placeholder="e.g., ESP32-Sensor-01"
                value={registerForm.name}
                onChange={(e) => setRegisterForm(prev => ({ ...prev, name: e.target.value }))}
              />
            </div>
            <button 
              className="function-btn primary"
              onClick={handleRegisterDevice}
              disabled={isPending || isConfirming || !isConnected}
            >
              {isPending || isConfirming ? 'Processing...' : 'Add Device'}
            </button>
          </div>
        </div>

        {/* Ping */}
        <div className="function-card">
          <h3>📡 Send Ping</h3>
          <div className="function-form">
            <div className="form-group">
              <label htmlFor="device-index">Device Index:</label>
              <input
                id="device-index"
                type="number"
                min="0"
                value={heartbeatIndex}
                onChange={(e) => setHeartbeatIndex(parseInt(e.target.value) || 0)}
              />
            </div>
            <button 
              className="function-btn secondary"
              onClick={handleHeartbeat}
              disabled={isPending || isConfirming || !isConnected}
            >
              {isPending || isConfirming ? 'Processing...' : 'Send Heartbeat'}
            </button>
          </div>
        </div>

         {/* Your Devices */}
         {userDevices && Array.isArray(userDevices) && userDevices.length > 0 && (
           <div className="function-card">
             <h3>📱 Your Devices ({userDevices.length})</h3>
             <div className="devices-list">
               {userDevices.map((device: any, index: number) => (
                 <div key={index} className="device-item">
                   <div className="device-info">
                     <span className="device-name">{device.name || 'Unknown Device'}</span>
                     <span className="device-index">Index: {index}</span>
                     <span className="device-timestamp">Last Update: {device.time ? new Date(Number(device.time) * 1000).toLocaleString() : 'Unknown'}</span>
                   </div>
                   <div className="device-status">
                     <span className="status-badge active">
                       Active
                     </span>
                   </div>
                 </div>
               ))}
             </div>
           </div>
         )}
      </div>

       {/* Transaction List */}
       <div className="transactions-section">
         <h2>Recent Transactions</h2>
         
         {/* Local Transactions (from current session) */}
         {transactions.length > 0 && (
           <div className="transaction-group">
             <h3>Current Session</h3>
             <div className="transactions-list">
               {transactions.map((tx, index) => (
                 <div key={index} className={`transaction-item ${tx.status}`}>
                   <div className="tx-header">
                     <span className="tx-status">{getStatusIcon(tx.status)}</span>
                     <span className="tx-function">{tx.function}</span>
                     <span className="tx-time">{formatTimestamp(tx.timestamp)}</span>
                   </div>
                   <div className="tx-hash">
                     <a 
                       href={`https://blockscout-passet-hub.parity-testnet.parity.io/tx/${tx.hash}`}
                       target="_blank"
                       rel="noopener noreferrer"
                     >
                       {tx.hash.slice(0, 10)}...{tx.hash.slice(-8)}
                     </a>
                   </div>
                  {tx.error && (
                    <div className="tx-error">
                      Error: {tx.error}
                    </div>
                  )}
                 </div>
               ))}
             </div>
           </div>
         )}

         {/* Blockscout Transactions */}
         <div className="transaction-group">
           <h3>Contract History {isLoadingBlockscout && '(Loading...)'}</h3>
           {blockscoutTransactions.length === 0 && !isLoadingBlockscout ? (
             <div className="no-transactions">
               <span>No transactions found on blockchain explorer</span>
             </div>
           ) : (
             <div className="transactions-list">
               {blockscoutTransactions.slice(0, 10).map((tx, index) => (
                 <div key={index} className="transaction-item success">
                   <div className="tx-header">
                     <span className="tx-status">✅</span>
                     <span className="tx-function">{tx.method || 'Contract Call'}</span>
                     <span className="tx-time">{new Date(tx.timestamp).toLocaleString()}</span>
                   </div>
                   <div className="tx-hash">
                     <a 
                       href={`https://blockscout-passet-hub.parity-testnet.parity.io/tx/${tx.hash}`}
                       target="_blank"
                       rel="noopener noreferrer"
                     >
                       {tx.hash.slice(0, 10)}...{tx.hash.slice(-8)}
                     </a>
                   </div>
                   <div className="tx-details">
                     <span>From: {tx.from.hash.slice(0, 8)}...{tx.from.hash.slice(-6)}</span>
                     <span>Gas: {tx.gas_used || 'N/A'}</span>
                   </div>
                 </div>
               ))}
             </div>
           )}
         </div>
       </div>
    </div>
  );
};

export default ContractTestPage;
