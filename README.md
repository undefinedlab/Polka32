# 🚀 Polka32 - ESP32 to EVM Chain Integration Boilerplate

A comprehensive boilerplate platform for seamlessly connecting ESP32 devices to EVM-compatible blockchains through the Polkadot ecosystem. Polka32 provides developers with a complete foundation to build, manage, and monitor IoT devices on blockchain networks.

![Polka32 Platform](https://img.shields.io/badge/Platform-IoT%20Blockchain-blue) ![Built with React](https://img.shields.io/badge/Built%20with-React%20%2B%20TypeScript-61dafb) ![Blockchain](https://img.shields.io/badge/Blockchain-Polkadot%20%2B%20EVM-orange) ![ESP32](https://img.shields.io/badge/Hardware-ESP32-red)

> **Polkadot Latin Hack 2025** - Building the future of decentralized IoT infrastructure

## 🌟 What is Polka32?

Polka32 is an open-source boilerplate that bridges the gap between ESP32 microcontrollers and EVM-compatible blockchain networks through Polkadot's interoperability. It provides developers with:

- **Ready-to-use frontend** for device management and monitoring
- **Blockchain integration** with Polkadot's Paseo AssetHub
- **EVM compatibility** for smart contract interactions
- **Modular architecture** for easy customization and extension
- **Real-time monitoring** of device activities and transactions

## 🎯 Key Features

### 🔗 Blockchain Integration
- **Polkadot Paseo AssetHub** integration for native blockchain connectivity
- **EVM compatibility** through Arbitrum Sepolia for smart contract interactions
- **RainbowKit wallet** integration with glassmorphic UI design
- **Multi-chain support** architecture ready for expansion

### 🖥️ Frontend Dashboard
- **Device Management Interface** - Register, monitor, and manage ESP32 devices
- **Scout Network Explorer** - Discover and browse all registered devices in the network
- **Responsive Design** - Mobile-first approach with modern glassmorphic UI
- **Wallet Integration** - Seamless Web3 wallet connectivity with balance display

### 🛠️ Developer-Friendly Architecture
- **Modular Components** - Easily customizable and extendable React components
- **TypeScript Support** - Full type safety for robust development
- **Modern Tech Stack** - Built with React 19, Vite, and latest Web3 libraries
- **Open Source Foundation** - MIT licensed for community contributions

## 🚀 Quick Start

### Prerequisites
- **Node.js 18+** and npm
- **Git** for version control
- **Web3 wallet** (MetaMask, WalletConnect, etc.)
- **ESP32 device** (optional, for hardware integration)

### Installation

```bash
# Clone the repository
git clone https://github.com/undefinedlab/Polka32.git
cd Polka32

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

## 📋 Contract Information

### Polka32 Smart Contract
- **Contract Address**: `0x83aC19d72648a87a7ecB6D2913C0B1B7e04b5a31`
- **Network**: Paseo AssetHub (Polkadot Parachain)
- **Chain ID**: 420420422
- **Explorer**: [View on Blockscout](https://blockscout-passet-hub.parity-testnet.parity.io/address/0x83aC19d72648a87a7ecB6D2913C0B1B7e04b5a31)

### Contract Features
- **Ultra-minimal design** for efficient deployment
- **Device registration** with name and timestamp
- **Heartbeat functionality** for device status updates
- **Owner-based device management**
- **Real-time blockchain integration**

### Contract Functions
```solidity
// Register a new device
function add(string calldata name) external

// Send heartbeat for device at index
function ping(uint256 i) external

// Get all devices for an address
function get(address a) external view returns (Device[] memory)

// Get total number of registered devices
function total() external view returns (uint256)
```

## 🏗️ Project Structure

```
Polka32/
├── src/                           # Frontend React Application
│   ├── App.tsx                    # Main application component
│   ├── App.css                    # Global styles and glassmorphic design
│   ├── wagmi.ts                   # Blockchain configuration (Polkadot + EVM)
│   ├── main.tsx                   # Application entry point with providers
│   └── components/
│       ├── Modal.tsx              # Reusable modal component
│       ├── DeviceScoutModal.tsx   # Network device explorer
│       ├── YourDevicesModal.tsx   # Personal device management
│       ├── DeviceRegistry.tsx     # Device listing and details
│       ├── ContractTestPage.tsx   # Smart contract testing interface
│       └── AddDeviceModal.tsx     # Device registration wizard
├── esp32Boiler/                   # ESP32 C++ Boilerplate
│   ├── src/
│   │   ├── main.cpp              # Main ESP32 application
│   │   └── config.h              # Configuration template
│   ├── examples/
│   │   ├── basic_web3/           # Basic Web3 connection examples
│   │   ├── smart_contract/       # Smart contract interaction
│   │   ├── token_operations/     # ERC20 token examples
│   │   └── security_door/        # IoT security implementation
│   ├── docs/
│   │   └── setup.md             # ESP32 setup instructions
│   ├── platformio.ini           # PlatformIO configuration
│   ├── config_template.h        # Configuration template
│   └── README.md                # ESP32 boilerplate documentation
├── contracts/
│   └── Polka32.sol              # Ultra-minimal device registry contract
├── public/                       # Static assets
├── package.json                  # Frontend dependencies and scripts
├── vite.config.ts               # Vite configuration
├── tsconfig.json                # TypeScript configuration
└── README.md                     # This file
```

## 🛠️ ESP32 Hardware Boilerplate

### Complete ESP32 Integration Package

The `esp32Boiler/` directory contains a complete C++ boilerplate for ESP32 devices to interact with the Polka32 ecosystem:

#### 🔧 **Hardware Requirements**
- **ESP32 Development Board** (ESP32-WROOM-32 recommended)
- **WiFi connectivity** for blockchain communication
- **USB cable** for programming and power
- **Optional**: Sensors, relays, LEDs for IoT applications

#### 📦 **What's Included**

1. **Main Application** (`src/main.cpp`)
   - Complete Web3 integration for ESP32
   - Smart contract interaction capabilities
   - ERC20 token operations
   - Cryptographic signing and verification

2. **Configuration System** (`config.h`)
   - WiFi network settings
   - Blockchain network configuration
   - Smart contract addresses
   - Hardware pin assignments

3. **Example Projects**
   - **Basic Web3**: Connect to blockchain, query balances
   - **Smart Contracts**: Interact with the Polka32 registry
   - **Token Operations**: ERC20 token transfers and approvals
   - **Security Door**: Complete IoT access control system

4. **Development Tools**
   - **PlatformIO configuration** for easy building
   - **Detailed setup guide** with step-by-step instructions
   - **Troubleshooting documentation**

#### 🚀 **Quick ESP32 Setup**

```bash
# 1. Navigate to ESP32 boilerplate
cd esp32Boiler/

# 2. Install PlatformIO
pip install platformio

# 3. Copy and configure settings
cp config_template.h src/config.h
# Edit src/config.h with your WiFi and blockchain settings

# 4. Build and upload to ESP32
pio run --target upload

# 5. Monitor serial output
pio device monitor
```

#### 🔗 **Integration with Frontend**

The ESP32 devices automatically register with the Polka32 contract:
- **Device Registration**: ESP32 calls `add(deviceName)` function
- **Heartbeat System**: Regular `ping(deviceIndex)` calls
- **Frontend Discovery**: Devices appear in the Scout Network Explorer
- **Real-time Monitoring**: Transaction history visible in the web interface

## 🔧 Technical Stack

### Frontend Technologies
- **React 19** with TypeScript for type-safe development
- **Vite** for fast development and optimized builds
- **RainbowKit** for Web3 wallet integration
- **Wagmi** for Ethereum interactions
- **Viem** for blockchain utilities

### ESP32 Technologies
- **Web3E Library** by AlphaWallet for blockchain integration
- **PlatformIO** for development and deployment
- **Arduino Framework** for ESP32 programming
- **WiFi & HTTP** for network communication
- **Cryptographic Libraries** for secure signing
- **Axios** for API communication
- **CSS3** with modern glassmorphic design

### Blockchain Integration
- **Polkadot Paseo AssetHub** - Primary blockchain network
- **WalletConnect** - Multi-wallet support

### Key Dependencies
```json
{
  "@rainbow-me/rainbowkit": "^2.2.8",
  "@tanstack/react-query": "^5.90.2",
  "wagmi": "^2.17.5",
  "viem": "^2.38.0",
  "react": "^19.1.0",
  "axios": "^1.9.0"
}
```

## 🌐 Blockchain Configuration

### Polkadot Integration
```typescript
// Paseo AssetHub Configuration
const paseoAssetHub = defineChain({
  id: 420420422,
  name: 'Paseo AssetHub',
  nativeCurrency: { name: 'PAS', symbol: 'PAS', decimals: 18 },
  rpcUrls: { default: { http: ['https://paseo-assethub.polkadot.io'] } }
});
```

### EVM Compatibility
- **Cross-chain** transaction monitoring and analytics
- **Multi-wallet** support through RainbowKit

## 🤝 Contributing

PolkaESP is designed as a **community-driven open-source foundation**. We welcome contributions from developers, hardware enthusiasts, and blockchain innovators.

### How to Contribute
1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/amazing-feature`)
3. **Commit** your changes (`git commit -m 'Add amazing feature'`)
4. **Push** to the branch (`git push origin feature/amazing-feature`)
5. **Open** a Pull Request

### Areas for Contribution
- **ESP32 firmware** examples and libraries
- **Additional blockchain** network integrations
- **UI/UX improvements** and new components
- **Hardware integration** tutorials and examples
- **Documentation** and developer guides

## 📥 Download & Deployment

### **GitHub Repository**
The complete Polka32 project is available at: **[https://github.com/undefinedlab/Polka32](https://github.com/undefinedlab/Polka32)**

#### **Download Options**
1. **ZIP Download**: Visit the repository → "Code" → "Download ZIP"
2. **Git Clone**: `git clone https://github.com/undefinedlab/Polka32.git`

### **Two-Component System**

#### 🌐 **Frontend Application** (Root Directory)
```bash
# Install and run the web interface
npm install
npm run dev
```

#### 🔧 **ESP32 Hardware** (`esp32Boiler/` Directory)
```bash
# Navigate to ESP32 boilerplate
cd esp32Boiler/

# Setup and deploy to ESP32
pip install platformio
cp config_template.h src/config.h
# Edit config.h with your settings
pio run --target upload
```

## 📚 Getting Started with ESP32

### Hardware Requirements
- **ESP32 development board** (ESP32-DevKit-V1 recommended)
- **WiFi connectivity** for blockchain communication
- **Sensors/actuators** (optional, based on your project needs)

### Firmware Development
```cpp
// Example ESP32 code structure for blockchain integration
#include <WiFi.h>
#include <HTTPClient.h>
#include <ArduinoJson.h>

// Your blockchain integration code here
// Connect to Polkadot/EVM networks
// Send device data to smart contracts
```

## 🛣️ Roadmap

- [X] **ESP32 Firmware Library** - Ready-to-use Arduino libraries
- [X] **Smart Contract Templates** - Solidity contracts for device management
- [ ] **Additional Chain Support** - More Polkadot parachains integration
- [ ] **Mobile App** - React Native companion app
- [ ] **Hardware Tutorials** - Step-by-step ESP32 integration guides
- [ ] **Advanced Analytics** - Enhanced device monitoring and insights

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🏆 Polkadot Latin Hack 2025

PolkaESP was created for **Polkadot Latin Hack 2025** as a foundational boilerplate to accelerate IoT blockchain development in the Polkadot ecosystem.

---


*Connecting ESP32 devices to the decentralized future* 🚀✨