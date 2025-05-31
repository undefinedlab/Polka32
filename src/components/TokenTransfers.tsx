import { useState, useEffect } from 'react';
import axios from 'axios';

interface TokenTransfersProps {
  contractAddress: string;
  blockscoutApi: string;
}

interface TokenTransfer {
  tx_hash: string;
  block: number;
  timestamp: string;
  from: {
    hash: string;
  };
  to: {
    hash: string;
  };
  token: {
    address: string;
    name: string;
    symbol: string;
    decimals: string;
    type: string;
  };
  total: {
    value: string;
  };
}

const TokenTransfers = ({ contractAddress, blockscoutApi }: TokenTransfersProps) => {
  const [transfers, setTransfers] = useState<TokenTransfer[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [nextPageParams, setNextPageParams] = useState<string | null>(null);

  const fetchTransfers = async (pageParams?: string) => {
    try {
      setLoading(true);
      
      // Construct the URL with proper parameters
      let endpoint = `${blockscoutApi}/addresses/${contractAddress}/token-transfers`;
      if (pageParams) {
        endpoint += `?${pageParams}`;
      }
      
      console.log('Fetching token transfers from:', endpoint);
      
      const response = await axios.get(endpoint);
      
      if (response.data && response.data.items) {
        console.log('Token transfers fetched:', response.data.items.length);
        
        if (pageParams) {
          setTransfers(prev => [...prev, ...response.data.items]);
        } else {
          setTransfers(response.data.items);
        }
        
        // Store next page params if available
        if (response.data.next_page_params) {
          const params = new URLSearchParams();
          Object.entries(response.data.next_page_params).forEach(([key, value]) => {
            params.append(key, value as string);
          });
          setNextPageParams(params.toString());
          console.log('Next page params for token transfers:', params.toString());
        } else {
          setNextPageParams(null);
        }
      } else {
        console.log('No token transfers found or invalid response format');
      }
      
      setLoading(false);
    } catch (err) {
      console.error('Error fetching token transfers:', err);
      setError('Failed to fetch token transfers. Please try again later.');
      setLoading(false);
    }
  };

  useEffect(() => {
    // Initial fetch of token transfers
    fetchTransfers();
  }, [contractAddress, blockscoutApi]);

  const loadMore = () => {
    if (nextPageParams) {
      fetchTransfers(nextPageParams);
    }
  };

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleString();
  };

  const formatTokenValue = (value: string, decimals: string) => {
    try {
      const decimalValue = parseInt(decimals);
      const valueInToken = parseFloat(value) / Math.pow(10, decimalValue);
      return valueInToken.toFixed(decimalValue > 6 ? 6 : decimalValue);
    } catch (e) {
      console.error('Error formatting token value:', e);
      return value;
    }
  };

  if (loading && transfers.length === 0) {
    return <div className="token-transfers-loading">Loading token transfers...</div>;
  }

  if (error) {
    return <div className="token-transfers-error">{error}</div>;
  }

  return (
    <div className="token-transfers">
      {transfers.length > 0 ? (
        <>
          <table>
            <thead>
              <tr>
                <th>Tx Hash</th>
                <th>Block</th>
                <th>Time</th>
                <th>From</th>
                <th>To</th>
                <th>Token</th>
                <th>Amount</th>
              </tr>
            </thead>
            <tbody>
              {transfers.map((transfer, index) => (
                <tr key={`${transfer.tx_hash}-${transfer.token.address}-${index}`}>
                  <td>
                    <a 
                      href={`https://arbitrum-sepolia.blockscout.com/tx/${transfer.tx_hash}`}
                      target="_blank" 
                      rel="noopener noreferrer"
                    >
                      {transfer.tx_hash.substring(0, 8)}...{transfer.tx_hash.substring(transfer.tx_hash.length - 6)}
                    </a>
                  </td>
                  <td>
                    <a 
                      href={`https://arbitrum-sepolia.blockscout.com/block/${transfer.block}`}
                      target="_blank" 
                      rel="noopener noreferrer"
                    >
                      {transfer.block}
                    </a>
                  </td>
                  <td>{formatTimestamp(transfer.timestamp)}</td>
                  <td>
                    <a 
                      href={`https://arbitrum-sepolia.blockscout.com/address/${transfer.from.hash}`}
                      target="_blank" 
                      rel="noopener noreferrer"
                    >
                      {transfer.from.hash.substring(0, 8)}...{transfer.from.hash.substring(transfer.from.hash.length - 6)}
                    </a>
                  </td>
                  <td>
                    <a 
                      href={`https://arbitrum-sepolia.blockscout.com/address/${transfer.to.hash}`}
                      target="_blank" 
                      rel="noopener noreferrer"
                    >
                      {transfer.to.hash.substring(0, 8)}...{transfer.to.hash.substring(transfer.to.hash.length - 6)}
                    </a>
                  </td>
                  <td>
                    <a 
                      href={`https://arbitrum-sepolia.blockscout.com/token/${transfer.token.address}`}
                      target="_blank" 
                      rel="noopener noreferrer"
                    >
                      {transfer.token.symbol || 'Unknown'}
                    </a>
                  </td>
                  <td>
                    {formatTokenValue(transfer.total.value, transfer.token.decimals)} {transfer.token.symbol || ''}
                  </td>
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
        </>
      ) : (
        <div className="no-transfers">
          No token transfers found for this contract address.
        </div>
      )}
      
      {loading && transfers.length > 0 && (
        <div className="loading">Loading more token transfers...</div>
      )}
    </div>
  );
};

export default TokenTransfers; 