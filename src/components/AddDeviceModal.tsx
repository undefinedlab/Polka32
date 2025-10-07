import { useState } from 'react';
import './AddDeviceModal.css';

interface AddDeviceModalProps {
  onClose: () => void;
  onDeviceAdded?: () => void;
}

const AddDeviceModal = ({ onClose, onDeviceAdded }: AddDeviceModalProps) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [deviceInfo, setDeviceInfo] = useState({
    name: '',
    type: 'sensor',
    location: ''
  });

  const totalSteps = 3;

  const steps = [
    {
      id: 1,
      title: 'Fork Boilerplate',
      description: 'Get the ESP32 firmware code',
      icon: '🍴'
    },
    {
      id: 2,
      title: 'Upload to Device',
      description: 'Flash firmware to your ESP32',
      icon: '📤'
    },
    {
      id: 3,
      title: 'Register Device',
      description: 'Register on blockchain',
      icon: '📝'
    }
  ];

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleDeviceInfoChange = (field: string, value: string) => {
    setDeviceInfo(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleFinish = () => {
    // TODO: Integrate with smart contract registration
    console.log('Device registration completed:', deviceInfo);
    if (onDeviceAdded) {
      onDeviceAdded();
    }
    onClose();
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="step-content">
            <div className="step-header">
              <div className="step-icon">🍴</div>
              <h3>Fork the PolkaESP Boilerplate</h3>
              <p>Get the ESP32 firmware code to connect your device to the blockchain</p>
            </div>

            <div className="step-body">
              <div className="code-section">
                <h4>1. Clone the Repository</h4>
                <div className="code-block">
                  <code>git clone https://github.com/polkaesp/esp32-firmware.git</code>
                  <button className="copy-btn" onClick={() => navigator.clipboard.writeText('git clone https://github.com/polkaesp/esp32-firmware.git')}>
                    📋
                  </button>
                </div>
              </div>

              <div className="code-section">
                <h4>2. Navigate to Project</h4>
                <div className="code-block">
                  <code>cd esp32-firmware</code>
                  <button className="copy-btn" onClick={() => navigator.clipboard.writeText('cd esp32-firmware')}>
                    📋
                  </button>
                </div>
              </div>

              <div className="info-box">
                <div className="info-icon">💡</div>
                <div>
                  <h5>What's Included:</h5>
                  <ul>
                    <li>WiFi connection setup</li>
                    <li>Blockchain integration code</li>
                    <li>Device registration functions</li>
                    <li>Heartbeat system</li>
                    <li>Sensor data handling</li>
                  </ul>
                </div>
              </div>

              <div className="github-link">
                <a 
                  href="https://github.com/polkaesp/esp32-firmware" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="github-btn"
                >
                  <span>📂</span>
                  View on GitHub
                </a>
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="step-content">
            <div className="step-header">
              <div className="step-icon">📤</div>
              <h3>Upload Firmware to ESP32</h3>
              <p>Flash the PolkaESP firmware to your ESP32 device</p>
            </div>

            <div className="step-body">
              <div className="requirements-section">
                <h4>Hardware Requirements</h4>
                <div className="requirements-grid">
                  <div className="requirement-item">
                    <span className="req-icon">🔧</span>
                    <div>
                      <strong>ESP32 Board</strong>
                      <p>ESP32-DevKit-V1 or compatible</p>
                    </div>
                  </div>
                  <div className="requirement-item">
                    <span className="req-icon">🔌</span>
                    <div>
                      <strong>USB Cable</strong>
                      <p>Micro-USB or USB-C (depending on board)</p>
                    </div>
                  </div>
                  <div className="requirement-item">
                    <span className="req-icon">💻</span>
                    <div>
                      <strong>Arduino IDE</strong>
                      <p>Version 2.0+ with ESP32 support</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="upload-steps">
                <h4>Upload Steps</h4>
                <div className="upload-step">
                  <span className="step-number">1</span>
                  <div>
                    <strong>Configure WiFi</strong>
                    <p>Edit <code>config.h</code> with your WiFi credentials</p>
                  </div>
                </div>
                <div className="upload-step">
                  <span className="step-number">2</span>
                  <div>
                    <strong>Set Device Info</strong>
                    <p>Update device name and type in the configuration</p>
                  </div>
                </div>
                <div className="upload-step">
                  <span className="step-number">3</span>
                  <div>
                    <strong>Connect ESP32</strong>
                    <p>Connect your ESP32 to computer via USB</p>
                  </div>
                </div>
                <div className="upload-step">
                  <span className="step-number">4</span>
                  <div>
                    <strong>Upload Code</strong>
                    <p>Click "Upload" in Arduino IDE</p>
                  </div>
                </div>
              </div>

              <div className="info-box warning">
                <div className="info-icon">⚠️</div>
                <div>
                  <strong>Important:</strong> Make sure to install the ESP32 board package in Arduino IDE before uploading.
                </div>
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="step-content">
            <div className="step-header">
              <div className="step-icon">📝</div>
              <h3>Register Your Device</h3>
              <p>Complete the blockchain registration process</p>
            </div>

            <div className="step-body">
              <div className="device-form">
                <h4>Device Information</h4>
                <div className="form-grid">
                  <div className="form-group">
                    <label htmlFor="device-name">Device Name</label>
                    <input
                      id="device-name"
                      type="text"
                      placeholder="e.g., Living Room Sensor"
                      value={deviceInfo.name}
                      onChange={(e) => handleDeviceInfoChange('name', e.target.value)}
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="device-type">Device Type</label>
                    <select
                      id="device-type"
                      value={deviceInfo.type}
                      onChange={(e) => handleDeviceInfoChange('type', e.target.value)}
                    >
                      <option value="sensor">Sensor</option>
                      <option value="actuator">Actuator</option>
                      <option value="controller">Controller</option>
                      <option value="display">Display</option>
                      <option value="gateway">Gateway</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label htmlFor="device-location">Location (Optional)</label>
                    <input
                      id="device-location"
                      type="text"
                      placeholder="e.g., Living Room, Workshop"
                      value={deviceInfo.location}
                      onChange={(e) => handleDeviceInfoChange('location', e.target.value)}
                    />
                  </div>
                </div>
              </div>

              <div className="registration-process">
                <h4>Registration Process</h4>
                <div className="process-steps">
                  <div className="process-step">
                    <span className="process-icon">🔗</span>
                    <div>
                      <strong>Connect Wallet</strong>
                      <p>Your device will use your connected wallet to register</p>
                    </div>
                  </div>
                  <div className="process-step">
                    <span className="process-icon">💰</span>
                    <div>
                      <strong>Pay Registration Fee</strong>
                      <p>Small fee (≈0.001 ETH) to prevent spam registrations</p>
                    </div>
                  </div>
                  <div className="process-step">
                    <span className="process-icon">📋</span>
                    <div>
                      <strong>Device Registration</strong>
                      <p>Device metadata stored on blockchain permanently</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="contract-info">
                <h4>Smart Contract Details</h4>
                <div className="contract-details">
                  <div className="detail-row">
                    <span className="detail-label">Contract:</span>
                    <span className="detail-value">PolkaESPRegistry.sol</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Network:</span>
                    <span className="detail-value">Paseo AssetHub</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Function:</span>
                    <span className="detail-value">registerDevice()</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="add-device-modal">
      <div className="modal-header">
        <h2>Add New ESP32 Device</h2>
        <button className="close-btn" onClick={onClose}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
      </div>

      <div className="progress-section">
        <div className="progress-bar">
          <div 
            className="progress-fill" 
            style={{ width: `${(currentStep / totalSteps) * 100}%` }}
          ></div>
        </div>
        <div className="steps-indicator">
          {steps.map((step) => (
            <div 
              key={step.id}
              className={`step-indicator ${currentStep >= step.id ? 'active' : ''} ${currentStep === step.id ? 'current' : ''}`}
            >
              <div className="step-circle">
                {currentStep > step.id ? '✓' : step.id}
              </div>
              <div className="step-info">
                <span className="step-title">{step.title}</span>
                <span className="step-desc">{step.description}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="modal-content">
        {renderStepContent()}
      </div>

      <div className="modal-footer">
        <div className="footer-buttons">
          {currentStep > 1 && (
            <button className="btn-secondary" onClick={handlePrevious}>
              ← Previous
            </button>
          )}
          
          <div className="spacer"></div>
          
          {currentStep < totalSteps ? (
            <button className="btn-primary" onClick={handleNext}>
              Next →
            </button>
          ) : (
            <button 
              className="btn-primary" 
              onClick={handleFinish}
              disabled={!deviceInfo.name}
            >
              Register Device 🚀
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default AddDeviceModal;
