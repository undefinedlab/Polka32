import { useState } from 'react';
import { ConnectButton } from '@rainbow-me/rainbowkit';

// Components
import Modal from './components/Modal';
import YourDevicesModal from './components/YourDevicesModal';
import DeviceScoutModal from './components/DeviceScoutModal';
import ContractTestPage from './components/ContractTestPage';

// Styles
import './App.css';

// Constants
const POLKA32_CONTRACT = '0x83aC19d72648a87a7ecB6D2913C0B1B7e04b5a31';
const BLOCKSCOUT_API = 'https://blockscout-passet-hub.parity-testnet.parity.io/api/v2';

function App() {
  const [activeModal, setActiveModal] = useState<string | null>(null);

  // Modal handlers
  const openModal = (modalType: string) => {
    setActiveModal(modalType);
  };

  const closeModal = () => {
    setActiveModal(null);
  };

  // Action items configuration
  const actionItems = [
    {
      id: 'your-devices',
      label: 'Your Devices',
      description: 'Manage & Register',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
          <circle cx="12" cy="7" r="4"/>
        </svg>
      )
    },
    {
      id: 'device-scout',
      label: 'Scout Network',
      description: 'Browse all devices',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="11" cy="11" r="8"/>
          <path d="m21 21-4.35-4.35"/>
        </svg>
      )
    }
  ];

  const renderModal = () => {
    switch (activeModal) {
      case 'your-devices':
        return (
          <Modal isOpen={true} onClose={closeModal} title="" size="full">
            <YourDevicesModal onClose={closeModal} />
          </Modal>
        );
      case 'device-scout':
        return (
          <Modal isOpen={true} onClose={closeModal} title="" size="full">
            <DeviceScoutModal contractAddress={POLKA32_CONTRACT} blockscoutApi={BLOCKSCOUT_API} onClose={closeModal} />
          </Modal>
        );
      case 'contract-test':
        return (
          <Modal isOpen={true} onClose={closeModal} title="" size="full">
            <ContractTestPage onClose={closeModal} />
          </Modal>
        );
      default:
        return null;
    }
  };

  return (
    <div className="App">
      {/* Test Button - Top Left */}
      <div className="test-button">
        <button 
          className="test-btn"
          onClick={() => openModal('contract-test')}
          title="Contract Testing"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M9 12l2 2 4-4"/>
            <path d="M21 12c.552 0 1-.448 1-1V5c0-.552-.448-1-1-1H3c-.552 0-1 .448-1 1v6c0 .552.448 1 1 1h18z"/>
            <path d="M21 16H3c-.552 0-1 .448-1 1v2c0 .552.448 1 1 1h18c.552 0 1-.448 1-1v-2c0-.552-.448-1-1-1z"/>
          </svg>
          Test
        </button>
      </div>

      {/* Rainbow Connector - Top Right */}
      <div className="rainbow-connector">
        <ConnectButton showBalance={true} />
      </div>

      <main className="main-container">
        {/* Hero Section */}
        <div className="hero-section">
          <div className="hero-content">
            <h1 className="hero-title">
              Manage ESP32 Devices with 
              <span className="gradient-text"> Polka32</span>
            </h1>
            <p className="hero-subtitle">
              Bridge the gap between microcomputers and blockchain networks. 
              Harness the power of decentralized infrastructure to create, monitor, 
              and manage your ESP32 devices in a truly connected ecosystem.
            </p>
            <div className="hero-features">
              <div className="feature-item">
                <span>Blockchain Integration</span>
              </div>
              <div className="feature-item">
                <span>Decentralized Network</span>
              </div>
              <div className="feature-item">
                <span>Real-time Monitoring</span>
              </div>
            </div>
            <button 
              className="hero-cta"
              onClick={() => openModal('device-scout')}
            >
              Start Exploring Devices
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="m9 18 6-6-6-6"/>
              </svg>
            </button>
          </div>
          
          <div className="hero-visual">
            <div className="floating-card">
              <div className="card-header">
                <div className="status-indicator active"></div>
                <span>ESP32-DevKit-V1</span>
              </div>
              <div className="card-metrics">
                <div className="metric">
                  <span className="metric-label">Temperature</span>
                  <span className="metric-value">24.5°C</span>
                </div>
                <div className="metric">
                  <span className="metric-label">Uptime</span>
                  <span className="metric-value">127h</span>
                </div>
              </div>
            </div>
            
            <div className="floating-card secondary">
              <div className="card-header">
                <div className="status-indicator warning"></div>
                <span>ESP32-WROOM-32</span>
              </div>
              <div className="card-metrics">
                <div className="metric">
                  <span className="metric-label">Memory</span>
                  <span className="metric-value">78%</span>
                </div>
                <div className="metric">
                  <span className="metric-label">Signal</span>
                  <span className="metric-value">-45dBm</span>
                </div>
              </div>
            </div>
            
            <div className="floating-card tertiary">
              <div className="card-header">
                <div className="status-indicator active"></div>
                <span>ESP32-S3-AI</span>
              </div>
              <div className="card-metrics">
                <div className="metric">
                  <span className="metric-label">CPU Load</span>
                  <span className="metric-value">34%</span>
                </div>
                <div className="metric">
                  <span className="metric-label">AI Tasks</span>
                  <span className="metric-value">12</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Bottom Action Bar */}
      <div className="bottom-action-bar">
        <div className="action-items">
          {actionItems.map((item) => (
            <button
              key={item.id}
              className="action-item"
              onClick={() => openModal(item.id)}
            >
              <div className="action-icon">
                {item.icon}
              </div>
              <div className="action-content">
                <span className="action-label">{item.label}</span>
                <span className="action-description">{item.description}</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Render Active Modal */}
      {renderModal()}
    </div>
  );
}

export default App;
