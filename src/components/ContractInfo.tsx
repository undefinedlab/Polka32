import { useState, useEffect } from 'react';
import axios from 'axios';

interface ContractInfoProps {
  contractAddress: string;
  blockscoutApi: string;
}

interface ContractDetails {
  name: string | null;
  compiler_version: string | null;
  evm_version: string | null;
  optimization_enabled: boolean;
  optimization_runs: number | null;
  verified_at: string | null;
  abi: any[] | null;
  balance: string;
  is_contract: boolean;
  creation_tx_hash: string | null;
  implementation_address: string | null;
  is_verified: boolean;
}

const ContractInfo = ({ contractAddress, blockscoutApi }: ContractInfoProps) => {
  const [contractInfo, setContractInfo] = useState<ContractDetails | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchContractInfo = async () => {
      try {
        setLoading(true);
        
        // Get contract details
        const endpoint = `${blockscoutApi}/addresses/${contractAddress}`;
        console.log('Fetching contract info from:', endpoint);
        
        const response = await axios.get(endpoint);
        console.log('Contract info response:', response.data);
        
        if (response.data) {
          setContractInfo({
            name: response.data.name,
            compiler_version: response.data.compiler_version,
            evm_version: response.data.evm_version,
            optimization_enabled: response.data.optimization_enabled,
            optimization_runs: response.data.optimization_runs,
            verified_at: response.data.verified_at,
            abi: response.data.abi,
            balance: response.data.coin_balance || '0',
            is_contract: response.data.is_contract || true,
            creation_tx_hash: response.data.creation_tx_hash,
            implementation_address: response.data.implementation_address,
            is_verified: response.data.is_verified || false
          });
        } else {
          console.log('No contract info found or invalid response format');
        }
        
        setLoading(false);
      } catch (err) {
        console.error('Error fetching contract info:', err);
        setError('Failed to fetch contract information');
        setLoading(false);
      }
    };

    fetchContractInfo();
  }, [contractAddress, blockscoutApi]);

  if (loading) {
    return <div className="contract-info-loading">Loading contract information...</div>;
  }

  if (error) {
    return <div className="contract-info-error">{error}</div>;
  }

  const formatBalance = (balance: string) => {
    try {
      const valueInEth = parseFloat(balance) / 1e18;
      return valueInEth.toFixed(6) + ' ETH';
    } catch (e) {
      console.error('Error formatting balance:', e);
      return '0 ETH';
    }
  };

  return (
    <div className="contract-info">
      <h3>Contract Information</h3>
      
      <div className="contract-details">
        <div className="detail-row">
          <span className="detail-label">Address:</span>
          <span className="detail-value">{contractAddress}</span>
        </div>
        
        <div className="detail-row">
          <span className="detail-label">Balance:</span>
          <span className="detail-value">{contractInfo?.balance ? formatBalance(contractInfo.balance) : '0 ETH'}</span>
        </div>
        
        {contractInfo?.is_contract === false && (
          <div className="detail-row">
            <span className="detail-label">Type:</span>
            <span className="detail-value">EOA (External Owned Account)</span>
          </div>
        )}
        
        {contractInfo?.name && (
          <div className="detail-row">
            <span className="detail-label">Name:</span>
            <span className="detail-value">{contractInfo.name}</span>
          </div>
        )}
        
        {contractInfo?.is_verified && (
          <div className="detail-row">
            <span className="detail-label">Verified:</span>
            <span className="detail-value">
              {contractInfo.verified_at 
                ? `Yes, on ${new Date(contractInfo.verified_at).toLocaleString()}` 
                : 'Yes'}
            </span>
          </div>
        )}
        
        {contractInfo?.implementation_address && (
          <div className="detail-row">
            <span className="detail-label">Implementation:</span>
            <span className="detail-value">
              <a 
                href={`https://arbitrum-sepolia.blockscout.com/address/${contractInfo.implementation_address}`}
                target="_blank" 
                rel="noopener noreferrer"
              >
                {contractInfo.implementation_address.substring(0, 8)}...{contractInfo.implementation_address.substring(contractInfo.implementation_address.length - 6)}
              </a>
            </span>
          </div>
        )}
        
        {contractInfo?.creation_tx_hash && (
          <div className="detail-row">
            <span className="detail-label">Created in:</span>
            <span className="detail-value">
              <a 
                href={`https://arbitrum-sepolia.blockscout.com/tx/${contractInfo.creation_tx_hash}`}
                target="_blank" 
                rel="noopener noreferrer"
              >
                {contractInfo.creation_tx_hash.substring(0, 8)}...{contractInfo.creation_tx_hash.substring(contractInfo.creation_tx_hash.length - 6)}
              </a>
            </span>
          </div>
        )}
        
        {contractInfo?.compiler_version && (
          <div className="detail-row">
            <span className="detail-label">Compiler:</span>
            <span className="detail-value">{contractInfo.compiler_version}</span>
          </div>
        )}
        
        {contractInfo?.evm_version && (
          <div className="detail-row">
            <span className="detail-label">EVM Version:</span>
            <span className="detail-value">{contractInfo.evm_version}</span>
          </div>
        )}
        
        {contractInfo?.optimization_enabled !== undefined && (
          <div className="detail-row">
            <span className="detail-label">Optimization:</span>
            <span className="detail-value">
              {contractInfo.optimization_enabled ? 'Enabled' : 'Disabled'}
              {contractInfo.optimization_runs !== null && ` (${contractInfo.optimization_runs} runs)`}
            </span>
          </div>
        )}
      </div>
      
      <div className="contract-links">
        <a 
          href={`https://arbitrum-sepolia.blockscout.com/address/${contractAddress}`}
          target="_blank" 
          rel="noopener noreferrer"
          className="contract-link"
        >
          View on Blockscout
        </a>
 
      </div>
    </div>
  );
};

export default ContractInfo; 