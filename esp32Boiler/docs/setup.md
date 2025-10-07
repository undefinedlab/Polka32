# Setup Guide

This guide will walk you through setting up the Web3 ESP32/Arduino project from scratch.

## Prerequisites

### Hardware Requirements
- ESP32 development board (recommended: ESP32-WROOM-32)
- USB cable (USB-A to Micro-USB or USB-C depending on your board)
- Computer with Windows, macOS, or Linux
- WiFi network for internet connectivity

### Software Requirements
- [PlatformIO](https://platformio.org/) (recommended) or Arduino IDE
- [Git](https://git-scm.com/) for version control
- [MetaMask](https://metamask.io/) or another Web3 wallet for testing

## Step 1: Install PlatformIO

### Option A: PlatformIO CLI (Recommended)
```bash
# Install Python if not already installed
# Then install PlatformIO
pip install platformio
```

### Option B: PlatformIO IDE
1. Download and install [VS Code](https://code.visualstudio.com/)
2. Install the PlatformIO extension from the VS Code marketplace

## Step 2: Clone the Project

```bash
git clone <repository-url>
cd birogochi
```

## Step 3: Configure the Project

### 3.1 WiFi Configuration
Edit `src/main.cpp` and update the WiFi credentials:

```cpp
const char* WIFI_SSID = "YourWiFiNetwork";
const char* WIFI_PASSWORD = "YourWiFiPassword";
```

### 3.2 Ethereum Configuration

⚠️ **SECURITY WARNING**: Never use real private keys with significant funds. Always use testnet accounts for development.

1. **Get a testnet account:**
   - Install MetaMask
   - Create a new account
   - Switch to Sepolia testnet
   - Get testnet ETH from a faucet

2. **Update the configuration:**
```cpp
#define MY_ADDRESS "0xYourTestnetAddress"
#define PRIVATE_KEY "YourTestnetPrivateKey"  // Remove 0x prefix
```

3. **Deploy a test contract (optional):**
   - Use Remix IDE or Hardhat
   - Deploy the `SimpleStorage.sol` contract
   - Update `CONTRACT_ADDRESS`

## Step 4: Build and Upload

### Using PlatformIO CLI:
```bash
# Build the project
pio run

# Upload to ESP32
pio run --target upload

# Monitor serial output
pio device monitor
```

### Using PlatformIO IDE:
1. Open the project folder in VS Code
2. Click the PlatformIO icon in the sidebar
3. Click "Build" under PROJECT TASKS
4. Click "Upload" to flash the ESP32
5. Click "Serial Monitor" to view output

## Step 5: Testing

### 5.1 Basic Connectivity Test
1. Power on the ESP32
2. Open the serial monitor (115200 baud)
3. Verify WiFi connection
4. Check Web3 connection to Ethereum network

### 5.2 Web3 Operations Test
1. In the serial monitor, press:
   - `1` to query account balance
   - `2` to send ETH transaction (testnet only!)
   - `3` to interact with smart contracts
   - `5` to run all tests

### 5.3 Smart Contract Test
1. Deploy the `SimpleStorage.sol` contract to Sepolia
2. Update `CONTRACT_ADDRESS` in the code
3. Re-upload the firmware
4. Test contract interaction

## Configuration Options

### Network Selection
Choose your preferred Ethereum network:

```cpp
// Testnets (recommended for development)
const int CHAIN_ID = SEPOLIA_ID;     // Sepolia testnet
const int CHAIN_ID = GOERLI_ID;      // Goerli testnet (deprecated)

// Mainnets (use with caution)
const int CHAIN_ID = MAINNET_ID;     // Ethereum mainnet
const int CHAIN_ID = POLYGON_ID;     // Polygon mainnet
```

### Gas Configuration
Adjust gas settings for your network:

```cpp
unsigned long long gasPriceVal = 20000000000ULL; // 20 Gwei
uint32_t gasLimitVal = 100000;                   // Gas limit
```

### Memory Optimization
If you encounter memory issues:

1. Add to `platformio.ini`:
```ini
board_build.partitions = no_ota.csv
build_flags = -DCORE_DEBUG_LEVEL=0
```

2. Reduce serial output in production code
3. Use static allocation where possible

## Common Issues and Solutions

### 1. WiFi Connection Failed
- Check SSID and password
- Ensure 2.4GHz WiFi (ESP32 doesn't support 5GHz)
- Try moving closer to router

### 2. Web3 Connection Failed
- Verify internet connectivity
- Check if the network endpoint is accessible
- Try switching to a different testnet

### 3. Compilation Errors
- Ensure Web3E library is properly installed
- Check for missing dependencies
- Update PlatformIO and libraries

### 4. Memory Issues
- Use `lib_ldf_mode = deep` in platformio.ini
- Enable partition scheme without OTA
- Reduce debug output

### 5. Transaction Failures
- Verify account has sufficient balance for gas
- Check gas price and limit settings
- Ensure private key is correct (without 0x prefix)

## Security Best Practices

### Development
1. **Never use mainnet accounts with real funds**
2. **Use dedicated testnet accounts**
3. **Store private keys securely**
4. **Use environment variables for sensitive data**

### Production
1. **Implement secure key storage**
2. **Use hardware security modules when possible**
3. **Audit all smart contracts**
4. **Implement proper access controls**

## Advanced Configuration

### Custom RPC Endpoints
To use custom RPC endpoints:

```cpp
// In Web3.h, add custom endpoint
Web3 web3("https://your-custom-endpoint.com");
```

### Infura Integration
If you have an Infura API key:

```cpp
#define USING_INFURA 1
#define INFURA_KEY "your-infura-api-key"
```

### Multi-network Support
For applications that need to switch networks:

```cpp
void switchNetwork(int chainId) {
    delete web3;
    web3 = new Web3(chainId);
}
```

## Troubleshooting Serial Output

Common serial monitor issues:
- Ensure correct baud rate (115200)
- Try different USB ports
- Install CH340/CP2102 drivers if needed
- Check if board is properly connected

## Next Steps

After successful setup:
1. Explore the examples in `/examples/`
2. Try the security door implementation
3. Deploy your own smart contracts
4. Build custom IoT applications

## Getting Help

If you encounter issues:
1. Check the [troubleshooting section](#common-issues-and-solutions)
2. Review the [Web3E documentation](https://github.com/AlphaWallet/Web3E)
3. Search for similar issues on GitHub
4. Ask questions in the community forums

## Additional Resources

- [ESP32 Documentation](https://docs.espressif.com/projects/esp32/)
- [Web3E Library](https://github.com/AlphaWallet/Web3E)
- [Ethereum Development](https://ethereum.org/developers/)
- [Solidity Documentation](https://docs.soliditylang.org/)
- [MetaMask Documentation](https://docs.metamask.io/) 