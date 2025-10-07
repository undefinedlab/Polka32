import { useState } from 'react';
import DeviceRegistry from './DeviceRegistry';
import './DeviceScoutModal.css';

interface DeviceScoutModalProps {
  contractAddress: string;
  blockscoutApi: string;
  onClose: () => void;
}

const DeviceScoutModal = ({ contractAddress, blockscoutApi, onClose }: DeviceScoutModalProps) => {
  const [searchTerm, setSearchTerm] = useState<string>('');

  return (
    <div className="device-scout-modal">
      <button className="floating-close-btn" onClick={onClose}>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <line x1="18" y1="6" x2="6" y2="18"></line>
          <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
      </button>

      <div className="scout-hero">
        <h1 className="scout-hero-title">
          Scout Network
          <span className="gradient-text"> Explorer</span>
        </h1>
        <p className="scout-hero-subtitle">
          Discover ESP32 devices across our decentralized Polkadot ecosystem
        </p>
      </div>

      <div className="scout-intro">
        <p className="scout-intro-text">
          Explore our decentralized network of ESP32 devices. Each registered device is a valuable partner 
          in our open-source Polkadot-secured ecosystem, contributing to a robust and distributed IoT infrastructure. 
          Together, we're building the future of connected devices on blockchain technology.
        </p>
      </div>

      <div className="modal-search">
        <div className="search-container">
          <svg className="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <circle cx="11" cy="11" r="8"></circle>
            <path d="m21 21-4.35-4.35"></path>
          </svg>
          <input
            type="text"
            placeholder="Search devices, manufacturers, or device IDs..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="global-search-input"
          />
          {searchTerm && (
            <button 
              className="clear-search"
              onClick={() => setSearchTerm('')}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          )}
        </div>
      </div>
      
      <DeviceRegistry 
        contractAddress={contractAddress} 
        blockscoutApi={blockscoutApi} 
        globalSearchTerm={searchTerm} 
      />
    </div>
  );
};

export default DeviceScoutModal;
