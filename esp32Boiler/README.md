# Web3 ESP32/Arduino Ethereum Smart Contract Integration

This project recreates the complete implementation from Takahiro Okada's Medium article: ["Handle smart contract on Ethereum with Arduino or ESP32"](https://medium.com/@takahirookada/handle-smart-contract-on-ethereum-with-arduino-or-esp32-1bb5cbaddbf4)

## Overview

This project demonstrates how to:
- Connect ESP32/Arduino devices to Ethereum networks
- Interact with smart contracts directly from embedded devices
- Send transactions and query blockchain data
- Create IoT devices that can function as Ethereum DApps

## Features

- **Web3 Integration**: Full Web3 functionality on ESP32/Arduino
- **Smart Contract Interaction**: Call contract functions and send transactions
- **Ethereum Network Support**: Works with mainnet, testnets (Sepolia, Goerli, etc.)
- **Token Operations**: Query balances, send ERC20 tokens
- **Security**: ECDSA signing, recovery, and verification
- **Low Resource Usage**: Optimized for embedded devices

## Hardware Requirements

- ESP32 development board (recommended) or Arduino-compatible board
- WiFi connectivity
- USB cable for programming
- Computer with PlatformIO or Arduino IDE

## Software Requirements

- **PlatformIO** (recommended) or Arduino IDE
- **Web3E Library** by AlphaWallet
- ESP32 board support package

## Project Structure

```
birogochi/
├── platformio.ini          # PlatformIO configuration
├── src/
│   └── main.cpp            # Main application code
├── examples/
│   ├── basic_web3/         # Basic Web3 examples
│   ├── smart_contract/     # Smart contract interaction
│   ├── token_operations/   # ERC20 token examples
│   └── security_door/      # IoT security implementation
├── contracts/
│   └── TestContract.sol    # Example smart contract
├── docs/
│   └── setup.md           # Detailed setup instructions
└── README.md              # This file
```

## Quick Start

1. **Install PlatformIO** (recommended):
   ```bash
   pip install platformio
   ```

2. **Clone this repository**:
   ```bash
   git clone <repository-url>
   cd birogochi
   ```

3. **Configure your settings** in `src/main.cpp`:
   - WiFi credentials
   - Ethereum network settings
   - Private key (for testing only!)
   - Contract addresses

4. **Build and upload**:
   ```bash
   pio run --target upload
   ```

5. **Monitor serial output**:
   ```bash
   pio device monitor
   ```

## Configuration

### WiFi Settings
```cpp
const char* WIFI_SSID = "Your_WiFi_SSID";
const char* WIFI_PASSWORD = "Your_WiFi_Password";
```

### Ethereum Network
```cpp
// Use predefined networks or custom endpoints
Web3 web3(SEPOLIA_ID);  // For Sepolia testnet
// Or custom: Web3 web3("https://your-ethereum-node.com");
```

### Security Considerations

⚠️ **IMPORTANT**: Never use real private keys with significant funds in embedded projects. Always use testnet accounts for development.

## Examples Included

### 1. Basic Web3 Connection
- Connect to Ethereum network
- Query account balance
- Get network information

### 2. Smart Contract Interaction
- Deploy and interact with smart contracts
- Call view functions
- Send transactions to contracts

### 3. ERC20 Token Operations
- Query token balances
- Transfer tokens
- Approve token spending

### 4. IoT Security Door
- Complete implementation of blockchain-based access control
- Token-gated device access
- Challenge-response authentication

## Smart Contract Example

```solidity
pragma solidity ^0.8.0;

contract SimpleStorage {
    uint256 private storedNumber;
    
    event NumberStored(uint256 number);
    
    function store(uint256 num) public {
        storedNumber = num;
        emit NumberStored(num);
    }
    
    function retrieve() public view returns (uint256) {
        return storedNumber;
    }
}
```

## Key Features of Web3E Library

- **Cryptography**: Uses Trezor's optimized crypto library
- **Memory Efficient**: Designed for resource-constrained devices
- **Network Support**: Works with major Ethereum networks
- **Transaction Handling**: Full transaction lifecycle support
- **Token Support**: ERC20, ERC721, ERC875 compatibility

## Use Cases

1. **IoT Access Control**: Blockchain-based door locks and security systems
2. **Supply Chain**: Track products using embedded devices
3. **Sensor Networks**: Decentralized sensor data collection
4. **Payment Devices**: Cryptocurrency payment terminals
5. **Identity Verification**: Hardware-based identity attestation

## Troubleshooting

### Common Issues

1. **Memory Issues**: Reduce heap usage, use static allocation
2. **Network Connectivity**: Check WiFi credentials and network stability
3. **Transaction Failures**: Verify gas settings and account balance
4. **Library Conflicts**: Use `lib_ldf_mode = deep` in platformio.ini

### Debug Tips

- Enable serial monitoring for detailed logs
- Use testnet for development
- Check gas prices and limits
- Verify contract addresses and ABIs

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## Resources

- [Web3E Library Documentation](https://github.com/AlphaWallet/Web3E)
- [Original Medium Article](https://medium.com/@takahirookada/handle-smart-contract-on-ethereum-with-arduino-or-esp32-1bb5cbaddbf4)
- [ESP32 Arduino Core](https://github.com/espressif/arduino-esp32)
- [PlatformIO Documentation](https://docs.platformio.org/)

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Takahiro Okada for the original Medium article
- AlphaWallet team for the Web3E library
- ESP32 Arduino community
- Ethereum development community

## Donations

If this project helps you, consider supporting the original Web3E library:
`0xbc8dAfeacA658Ae0857C80D8Aa6dE4D487577c63` 