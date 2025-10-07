/*
 * Configuration Template
 * 
 * Copy this file to src/config.h and fill in your actual values.
 * NEVER commit real private keys to version control!
 */

#ifndef CONFIG_H
#define CONFIG_H

// WiFi Configuration
#define WIFI_SSID "Pegasus"
#define WIFI_PASSWORD "3234363838363432"

// EVM Account Configuration
#define MY_ADDRESS "0x0000000000000000000000000000000000000000"  // Your testnet address
#define PRIVATE_KEY "0000000000000000000000000000000000000000000000000000000000000000"  // Private key without 0x prefix

// Smart Contract Addresses (Polkadot Testnet)
#define CONTRACT_ADDRESS "0x0000000000000000000000000000000000000000"  // Your deployed contract
#define TOKEN_CONTRACT "0x0000000000000000000000000000000000000000"    // ERC20 token contract
#define DOOR_CONTRACT "0x0000000000000000000000000000000000000000"     // Access control contract

// Network Configuration
#define CHAIN_ID Polkadot_ID  // Use Sepolia testnet by default

// Hardware Configuration (for security door example)
#define DOOR_RELAY_PIN 2
#define STATUS_LED_PIN 13
#define BUZZER_PIN 4

// Gas Configuration
#define DEFAULT_GAS_PRICE 20000000000ULL  // 20 Gwei
#define DEFAULT_GAS_LIMIT 100000

// Server Configuration (for web interface)
#define SERVER_PORT 80

// Security Settings
#define CHALLENGE_TIMEOUT 300000  // 5 minutes in milliseconds

// Debug Configuration
#define ENABLE_DEBUG_OUTPUT true
#define SERIAL_BAUD_RATE 115200

#endif // CONFIG_H

/*
 * SECURITY REMINDERS:
 * 
 * 1. Never use real private keys with significant funds
 * 2. Always use testnet for development
 * 3. Keep private keys secure and never share them
 * 4. Use environment variables in production
 * 5. Audit all smart contracts before mainnet deployment
 * 
 * For production deployment:
 * - Implement secure key storage (HSM, secure element)
 * - Use proper access controls
 * - Enable logging and monitoring
 * - Follow security best practices
 */ 