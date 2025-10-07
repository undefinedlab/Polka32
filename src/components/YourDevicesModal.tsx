import { useState } from 'react';
import './YourDevicesModal.css';
import AddDeviceModal from './AddDeviceModal';

interface Device {
  id: string;
  name: string;
  type: string;
  status: 'online' | 'offline' | 'maintenance';
  lastSeen: string;
  location?: string;
}

interface YourDevicesModalProps {
  onClose: () => void;
}

const YourDevicesModal = ({ onClose }: YourDevicesModalProps) => {
  const [devices] = useState<Device[]>([]);
  const [showAddDeviceModal, setShowAddDeviceModal] = useState(false);

  const handleAddDevice = () => {
    setShowAddDeviceModal(true);
  };

  const handleCloseAddDevice = () => {
    setShowAddDeviceModal(false);
  };

  const handleDeviceAdded = () => {
    // TODO: Refresh devices list when a device is added
    console.log('Device added successfully');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online':
        return 'var(--success-color)';
      case 'offline':
        return 'var(--text-secondary)';
      case 'maintenance':
        return 'var(--warning-color)';
      default:
        return 'var(--text-secondary)';
    }
  };

  return (
    <div className="your-devices-modal">
      <button className="floating-close-btn" onClick={onClose}>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <line x1="18" y1="6" x2="6" y2="18"></line>
          <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
      </button>

      <div className="devices-grid-container">
        <h2 className="devices-title">Your Devices</h2>
        
        <div className="intro-section">
          <p className="intro-text">
            We provide a comprehensive boilerplate for developers to build upon the ESP32 platform. 
            Get automatic chain connection setup, RPC configuration, and example smart contracts - 
            then easily register your devices with our platform.
          </p>
          
          
          <div className="download-section">
            <a 
              href="https://github.com/undefinedlab/Polka32" 
              target="_blank" 
              rel="noopener noreferrer"
              className="download-link"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"/>
              </svg>
              <span>GitHub Repository</span>
            </a>
            
            <a 
              href="https://github.com/undefinedlab/Polka32/releases/latest" 
              target="_blank" 
              rel="noopener noreferrer"
              className="download-link primary"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                <polyline points="7,10 12,15 17,10"/>
                <line x1="12" y1="15" x2="12" y2="3"/>
              </svg>
              <span>Download Package</span>
            </a>
          </div>
        </div>
        
        <div className="devices-grid">
          {/* Add Device Card */}
          <div className="device-card add-device-card" onClick={handleAddDevice}>
            <div className="add-device-content">
              <div className="add-device-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <line x1="12" y1="5" x2="12" y2="19"></line>
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                </svg>
              </div>
              <div className="add-device-info">
                <span className="add-device-text">Add Device</span>
                <span className="add-device-subtitle">Track your ESP32 device</span>
                <span className="add-device-description">Register and monitor your device on the blockchain network</span>
              </div>
            </div>
          </div>

          {/* Existing Devices */}
          {devices.map((device) => (
            <div key={device.id} className="device-card">
              <div className="device-card-header">
                <div 
                  className="device-status-dot" 
                  style={{ backgroundColor: getStatusColor(device.status) }}
                ></div>
                <span className="device-status-text">{device.status}</span>
              </div>
              
              <div className="device-card-content">
                <h3 className="device-name">{device.name}</h3>
                <p className="device-type">{device.type}</p>
                {device.location && (
                  <p className="device-location">📍 {device.location}</p>
                )}
                <p className="device-last-seen">Last seen: {device.lastSeen}</p>
              </div>
              
              <div className="device-card-actions">
                <button className="device-action-btn">Configure</button>
                <button className="device-action-btn secondary">Monitor</button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Add Device Modal */}
      {showAddDeviceModal && (
        <div className="modal-overlay">
          <AddDeviceModal 
            onClose={handleCloseAddDevice}
            onDeviceAdded={handleDeviceAdded}
          />
        </div>
      )}
    </div>
  );
};

export default YourDevicesModal;
