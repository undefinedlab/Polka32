# DeviceScout: Web3 IoT Device Explorer

DeviceScout is a modern web application for exploring, managing, and verifying IoT devices and smart hardware on the blockchain. It uses the Blockscout API to interact with device data stored on the Arbitrum Sepolia testnet.

## Features

- View and manage registered IoT devices and their blockchain verification status
- Monitor device activity and metrics in real-time
- Register new devices to the blockchain with hardware verification
- Display device transaction history with pagination
- View device metrics including uptime, data transmission, and energy consumption
- Manage device permissions and access control

## Contract Address

The application is currently configured to track the following registry contract address on Arbitrum Sepolia:

```
0x2F1AEdd2D80806B0405b44021B0448a8f073f73b
```

## Technologies Used

- React with TypeScript
- Vite for build tooling
- Axios for API requests
- Blockscout API for blockchain data
- Chart.js for device metrics visualization
- TailwindCSS for modern UI components

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd devicescout
```

2. Install dependencies:

```bash
npm install
# or
yarn
```

3. Start the development server:

```bash
npm run dev
# or
yarn dev
```

4. Open your browser and navigate to `http://localhost:5173`

## Building for Production

To build the application for production:

```bash
npm run build
# or
yarn build
```

The built files will be in the `dist` directory.

## API Information

This application uses the Blockscout API v2 for Arbitrum Sepolia:

- Base URL: `https://arbitrum-sepolia.blockscout.com/api/v2`
- Documentation: `https://arbitrum-sepolia.blockscout.com/api-docs`

## License

MIT

## Acknowledgments

- [Blockscout](https://blockscout.com/) for providing the API
- [Arbitrum](https://arbitrum.io/) for the Layer 2 scaling solution
