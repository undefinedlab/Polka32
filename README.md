# 🔍 DeviceScout - Web3 IoT Device Explorer Platform

A modern Web3-powered IoT device registry and explorer platform built for EthPrague 2025. DeviceScout provides a comprehensive interface for discovering, tracking, and managing blockchain-connected IoT devices with real-time transaction monitoring and analytics.

![DeviceScout Platform](https://img.shields.io/badge/Platform-Web3%20IoT-blue) ![Built with React](https://img.shields.io/badge/Built%20with-React%20%2B%20TypeScript-61dafb) ![Blockchain](https://img.shields.io/badge/Blockchain-Arbitrum%20Sepolia-orange)

## 🌟 Features

### 🎯 Core Functionality
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

### 🎮 Featured Device: Bitogochi
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

## 🎮 How to Use

### 1. Device Discovery
- Browse the device registry with a responsive 4-column grid layout
- Filter devices by type: Gaming, Security, Environmental, Energy
- Search by device name, manufacturer, or wallet address

### 2. Real-time Blockchain Tracking
- **Search for Bitogochi**: Enter `0x67A71d74e3d0b52996Deb690E623d8C9946Ba5E7` or `0x2F1AEdd2D80806B0405b44021B0448a8f073f73b`
- **Auto-navigation**: Automatically opens device details for matching addresses
- **Live Data**: View real transactions, contract logs, and activity timeline

### 3. Device Detail Views
- **Comprehensive Information**: Device specs, owner details, verification status
- **Transaction Tables**: Detailed transaction history with clickable Blockscout links
- **Contract Logs**: Event logs with decoded method calls and topics
- **Activity Timeline**: Visual representation of device blockchain interactions

### 4. Advanced Features
- **Responsive Design**: Optimized for desktop, tablet, and mobile devices
- **Loading States**: Smooth loading animations and error handling
- **External Links**: Direct integration with Arbitrum Sepolia Blockscout explorer
- **Real-time Updates**: Live data fetching with proper error handling

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

### Responsive Design
- **Mobile-first**: Optimized for screens 320px and up
- **Breakpoints**: 768px (tablet) and 1024px (desktop)
- **Flexible Grid**: 1-4 column layout based on screen size
- **Touch-friendly**: Larger buttons and touch targets on mobile

## 🌐 Live Demo

The platform showcases real blockchain data from the Bitogochi device:
- **Device Type**: Blockchain Tamagotchi gaming device
- **Real Transactions**: Live transaction monitoring
- **Contract Interactions**: Smart contract event tracking
- **Activity Feed**: Real-time blockchain activity visualization

## 🤝 Contributing

This project was built for EthPrague 2025. Contributions are welcome!

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is open source and available under the MIT License.

## 🏆 EthPrague 2025

**DeviceScout** was created for EthPrague 2025, demonstrating the future of Web3-connected IoT device management and blockchain integration.

### Key Achievements
- ✅ Real blockchain integration with live transaction data
- ✅ Responsive, modern UI/UX design
- ✅ Comprehensive device registry and analytics
- ✅ Real-time contract monitoring and log analysis
- ✅ Mobile-optimized experience

---

**Made with ❤️ for EthPrague 2025**

*Discover, track, and manage the future of blockchain-connected IoT devices* 🔍✨
