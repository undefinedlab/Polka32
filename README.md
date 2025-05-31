# 🔍 DeviceScout - Web3 IoT Device Explorer Platform

A modern Web3-powered IoT device registry and explorer platform built for EthPrague 2025. DeviceScout provides a comprehensive interface for discovering, tracking, and managing blockchain-connected IoT devices with real-time transaction monitoring and analytics.

![DeviceScout Platform](https://img.shields.io/badge/Platform-Web3%20IoT-blue) ![Built with React](https://img.shields.io/badge/Built%20with-React%20%2B%20TypeScript-61dafb) ![Blockchain](https://img.shields.io/badge/Blockchain-EVM%Test:Arbitrum Sepolia-orange)

## 🌟 Features

### 🎯 Core Functionality Ideas
- **Device Registry**: Comprehensive IoT device discovery and management
- **Real-time Blockchain Integration**: Live transaction tracking via Blockscout API
- **Smart Contract Monitoring**: Contract logs and transaction analysis
- **Multi-filter Search**: Advanced filtering by device type, status, and wallet addresses
- **Responsive Design**: Mobile-first approach with modern UI/UX

### 🔗 Blockchain Features
- **Arbitrum Sepolia Integration**: Full testnet support with real transaction data
- **Wallet Address Tracking**: Monitor specific wallet addresses and contract interactions
- **Transaction Analytics**: Detailed transaction tables with gas usage, methods, and values
- **Contract Logs**: Real-time contract event monitoring and log analysis
- **Blockscout Explorer Links**: Direct integration with Arbitrum Sepolia explorer

### 🎮 Featured Devices: 
- **Real Device Integration**: Tracks the actual Bitogochi blockchain Tamagotchi device
- **Contract Address**: `0x2F1AEdd2D80806B0405b44021B0448a8f073f73b`
- **Wallet Address**: `0x67A71d74e3d0b52996Deb690E623d8C9946Ba5E7`
- **Live Transaction Feed**: Real-time monitoring of device interactions
- **Activity Timeline**: Visual representation of device blockchain activity

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm
- Git for version control
- Modern web browser with Web3 support

### Installation

```bash
# Clone the repository
git clone https://github.com/undefinedlab/EthPrague25.git -b devicescout
cd EthPrague25

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

### Environment Setup

The platform is pre-configured to work with Arbitrum Sepolia testnet. No additional environment variables are required for basic functionality.

## 🏗️ Project Structure

```
DeviceScout/
├── src/
│   ├── App.tsx                 # Main application component
│   ├── App.css                 # Global styles and responsive design
│   │   ├── DeviceRegistry.tsx  # Main device listing and detail views
│   │   ├── DeviceActivity.tsx  # Device activity timeline
│   │   ├── DeviceMetrics.tsx   # Device analytics and metrics
│   │   ├── ContractInfo.tsx    # Contract information display
│   │   └── TokenTransfers.tsx  # Token transfer tracking
│   └── assets/                 # Static assets
├── public/                     # Public assets
├── package.json               # Dependencies and scripts
└── README.md                  # This file
```

## 🔧 Technical Details

### Built With
- **React 18** with TypeScript for type safety
- **Vite** for fast development and building
- **Axios** for API communication
- **CSS3** with modern flexbox and grid layouts
- **Blockscout API** for blockchain data

### API Integration
- **Blockscout Arbitrum Sepolia**: `https://arbitrum-sepolia.blockscout.com/api/v2/`
- **Transaction Endpoints**: Real-time transaction fetching
- **Contract Logs**: Event log monitoring and analysis
- **Address Tracking**: Wallet and contract address monitoring


## 📄 License

This project is open source and available under the MIT License.

## 🏆 EthPrague 2025

**DeviceScout** was created for EthPrague 2025

**Made with ❤️ for EthPrague 2025**

*Discover, track, and manage the future of blockchain-connected IoT devices* 🔍✨
