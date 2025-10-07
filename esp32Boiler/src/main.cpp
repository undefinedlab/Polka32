/*
 * Web3 ESP32/Arduino Ethereum Smart Contract Integration
 * 
 * This project recreates the implementation from Takahiro Okada's Medium article:
 * "Handle smart contract on Ethereum with Arduino or ESP32"
 * 
 * Features:
 * - Connect to Ethereum networks
 * - Interact with smart contracts
 * - Send transactions and query balances
 * - ERC20 token operations
 * 
 * Author: Based on Takahiro Okada's work
 * License: MIT
 */

#include <WiFi.h>
#include <Web3.h>
#include <Contract.h>
#include <Util.h>
#include <Crypto.h>

// ===== CONFIGURATION SECTION =====
// WiFi Configuration
const char* WIFI_SSID = "YOUR_WIFI_SSID";          // Replace with your WiFi SSID
const char* WIFI_PASSWORD = "YOUR_WIFI_PASSWORD";   // Replace with your WiFi password

// Ethereum Configuration
#define MY_ADDRESS "0x0000000000000000000000000000000000000000"  // Replace with your address
#define PRIVATE_KEY "0000000000000000000000000000000000000000000000000000000000000000"  // Replace with your private key (testnet only!)
#define CONTRACT_ADDRESS "0x0000000000000000000000000000000000000000"  // Replace with contract address

// Network Configuration (choose one)
// Use SEPOLIA_ID for Sepolia testnet (recommended for testing)
const int CHAIN_ID = SEPOLIA_ID;  
// Other options: MAINNET_ID, GOERLI_ID, MUMBAI_TEST_ID, etc.

// Contract ABI for simple storage contract
const char* SIMPLE_STORAGE_ABI = R"(
[
    {
        "inputs": [{"internalType": "uint256", "name": "num", "type": "uint256"}],
        "name": "store",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "retrieve",
        "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
        "stateMutability": "view",
        "type": "function"
    }
]
)";

// ===== GLOBAL VARIABLES =====
Web3* web3;
int wifiCounter = 0;
bool web3Connected = false;

// ===== FUNCTION DECLARATIONS =====
void setupWiFi();
void setupWeb3();
void testBasicWeb3Operations();
void testSmartContractInteraction();
void sendEthTransaction();
void queryBalance();
void sendERC20Transaction();
void printMenuOptions();
void handleSerialInput();

// ===== SETUP FUNCTION =====
void setup() {
    Serial.begin(115200);
    delay(1000);
    
    Serial.println();
    Serial.println("=================================");
    Serial.println("Web3 ESP32 Ethereum Integration");
    Serial.println("=================================");
    
    // Initialize Web3
    web3 = new Web3(CHAIN_ID);
    
    // Setup WiFi connection
    setupWiFi();
    
    // Setup Web3 connection
    setupWeb3();
    
    // Print menu options
    printMenuOptions();
}

// ===== MAIN LOOP =====
void loop() {
    // Check for serial input
    if (Serial.available()) {
        handleSerialInput();
    }
    
    // Keep WiFi alive
    if (WiFi.status() != WL_CONNECTED) {
        Serial.println("WiFi disconnected. Reconnecting...");
        setupWiFi();
    }
    
    delay(100);
}

// ===== WIFI SETUP =====
void setupWiFi() {
    if (WiFi.status() == WL_CONNECTED) {
        return;
    }

    Serial.println();
    Serial.print("Connecting to WiFi: ");
    Serial.println(WIFI_SSID);

    WiFi.mode(WIFI_STA);
    WiFi.begin(WIFI_SSID, WIFI_PASSWORD);

    wifiCounter = 0;
    while (WiFi.status() != WL_CONNECTED && wifiCounter < 20) {
        delay(500);
        Serial.print(".");
        wifiCounter++;
    }

    if (wifiCounter >= 20) {
        Serial.println();
        Serial.println("WiFi connection failed. Restarting...");
        ESP.restart();
    }

    Serial.println();
    Serial.println("WiFi connected successfully!");
    Serial.print("IP address: ");
    Serial.println(WiFi.localIP());
    Serial.print("Signal strength (RSSI): ");
    Serial.print(WiFi.RSSI());
    Serial.println(" dBm");
}

// ===== WEB3 SETUP =====
void setupWeb3() {
    Serial.println();
    Serial.println("Setting up Web3 connection...");
    
    // Test connection
    string myAddress = MY_ADDRESS;
    try {
        uint256_t balance = web3->EthGetBalance(&myAddress);
        Serial.println("Web3 connection successful!");
        web3Connected = true;
        
        // Display account info
        Serial.print("Account address: ");
        Serial.println(MY_ADDRESS);
        
        string balanceStr = Util::ConvertWeiToEthString(&balance, 18);
        Serial.print("Account balance: ");
        Serial.print(balanceStr.c_str());
        Serial.println(" ETH");
        
    } catch (const std::exception& e) {
        Serial.print("Web3 connection failed: ");
        Serial.println(e.what());
        web3Connected = false;
    }
}

// ===== MENU AND INPUT HANDLING =====
void printMenuOptions() {
    Serial.println();
    Serial.println("========== MENU OPTIONS ==========");
    Serial.println("1 - Query account balance");
    Serial.println("2 - Send ETH transaction");
    Serial.println("3 - Smart contract interaction");
    Serial.println("4 - ERC20 token operations");
    Serial.println("5 - Test all Web3 operations");
    Serial.println("6 - Print menu");
    Serial.println("===================================");
    Serial.println("Enter option number:");
}

void handleSerialInput() {
    String input = Serial.readString();
    input.trim();
    
    if (!web3Connected) {
        Serial.println("Web3 not connected. Please check your configuration.");
        return;
    }
    
    switch (input.toInt()) {
        case 1:
            queryBalance();
            break;
        case 2:
            sendEthTransaction();
            break;
        case 3:
            testSmartContractInteraction();
            break;
        case 4:
            sendERC20Transaction();
            break;
        case 5:
            testBasicWeb3Operations();
            break;
        case 6:
            printMenuOptions();
            break;
        default:
            Serial.println("Invalid option. Enter 1-6.");
            break;
    }
}

// ===== BALANCE QUERY =====
void queryBalance() {
    Serial.println();
    Serial.println("========== QUERYING BALANCE ==========");
    
    string myAddress = MY_ADDRESS;
    
    try {
        // Get ETH balance
        uint256_t balance = web3->EthGetBalance(&myAddress);
        string balanceStr = Util::ConvertWeiToEthString(&balance, 18);
        
        Serial.print("ETH Balance: ");
        Serial.print(balanceStr.c_str());
        Serial.println(" ETH");
        
        // Get transaction count (nonce)
        uint32_t nonce = (uint32_t)web3->EthGetTransactionCount(&myAddress);
        Serial.print("Transaction count (nonce): ");
        Serial.println(nonce);
        
    } catch (const std::exception& e) {
        Serial.print("Error querying balance: ");
        Serial.println(e.what());
    }
    
    Serial.println("======================================");
}

// ===== ETH TRANSACTION =====
void sendEthTransaction() {
    Serial.println();
    Serial.println("========== SENDING ETH TRANSACTION ==========");
    
    string toAddress = "0x742d35Cc6734C5c3d8D654B2C6d1d9BfbFD31930"; // Example address
    
    try {
        Contract contract(web3, "");
        contract.SetPrivateKey(PRIVATE_KEY);
        
        string myAddress = MY_ADDRESS;
        uint32_t nonceVal = (uint32_t)web3->EthGetTransactionCount(&myAddress);
        uint256_t weiValue = Util::ConvertToWei(0.001, 18); // Send 0.001 ETH
        unsigned long long gasPriceVal = 20000000000ULL; // 20 Gwei
        uint32_t gasLimitVal = 21000;
        string emptyString = "";
        
        Serial.println("Preparing transaction...");
        Serial.print("To: ");
        Serial.println(toAddress.c_str());
        Serial.print("Amount: 0.001 ETH");
        Serial.print("Gas Price: ");
        Serial.print(gasPriceVal);
        Serial.println(" wei");
        
        string result = contract.SendTransaction(nonceVal, gasPriceVal, gasLimitVal, &toAddress, &weiValue, &emptyString);
        string transactionHash = web3->getString(&result);
        
        Serial.println("Transaction sent!");
        Serial.print("Transaction hash: ");
        Serial.println(transactionHash.c_str());
        
    } catch (const std::exception& e) {
        Serial.print("Error sending transaction: ");
        Serial.println(e.what());
    }
    
    Serial.println("=============================================");
}

// ===== SMART CONTRACT INTERACTION =====
void testSmartContractInteraction() {
    Serial.println();
    Serial.println("========== SMART CONTRACT INTERACTION ==========");
    
    if (strlen(CONTRACT_ADDRESS) < 10) {
        Serial.println("Contract address not configured. Please set CONTRACT_ADDRESS.");
        return;
    }
    
    try {
        Contract contract(web3, CONTRACT_ADDRESS);
        contract.SetPrivateKey(PRIVATE_KEY);
        
        string myAddress = MY_ADDRESS;
        
        // Example 1: Call a view function (retrieve)
        Serial.println("Calling contract view function 'retrieve()'...");
        string param = contract.SetupContractData("retrieve()");
        string result = contract.ViewCall(&param);
        uint256_t storedValue = web3->getUint256(&result);
        
        Serial.print("Stored value: ");
        Serial.println(storedValue.str().c_str());
        
        // Example 2: Send a transaction to store a value
        Serial.println("Sending transaction to 'store(uint256)' function...");
        uint32_t nonceVal = (uint32_t)web3->EthGetTransactionCount(&myAddress);
        uint32_t gasPriceVal = 20000000000ULL; // 20 Gwei
        uint32_t gasLimitVal = 100000;
        string contractAddr = CONTRACT_ADDRESS;
        uint256_t callValue = 0;
        
        // Store the value 42
        uint256_t valueToStore = 42;
        string storeParam = contract.SetupContractData("store(uint256)", valueToStore);
        
        string storeResult = contract.SendTransaction(nonceVal, gasPriceVal, gasLimitVal, &contractAddr, &callValue, &storeParam);
        string transactionHash = web3->getResult(&storeResult);
        
        Serial.println("Store transaction sent!");
        Serial.print("Transaction hash: ");
        Serial.println(transactionHash.c_str());
        Serial.println("Wait for confirmation, then call retrieve() again.");
        
    } catch (const std::exception& e) {
        Serial.print("Error in contract interaction: ");
        Serial.println(e.what());
    }
    
    Serial.println("================================================");
}

// ===== ERC20 TOKEN OPERATIONS =====
void sendERC20Transaction() {
    Serial.println();
    Serial.println("========== ERC20 TOKEN OPERATIONS ==========");
    
    // Example ERC20 contract address (replace with actual token contract)
    string erc20ContractAddr = "0xA0b86a33E6417b1f2371c31db62C46a29E8f8A37"; // Example token
    
    try {
        Contract contract(web3, erc20ContractAddr.c_str());
        contract.SetPrivateKey(PRIVATE_KEY);
        
        string myAddress = MY_ADDRESS;
        
        // Get token name
        Serial.println("Getting token information...");
        string nameParam = contract.SetupContractData("name()");
        string nameResult = contract.ViewCall(&nameParam);
        string tokenName = Util::InterpretStringResult(web3->getString(&nameResult).c_str());
        Serial.print("Token name: ");
        Serial.println(tokenName.c_str());
        
        // Get token decimals
        string decimalsParam = contract.SetupContractData("decimals()");
        string decimalsResult = contract.ViewCall(&decimalsParam);
        int decimals = web3->getInt(&decimalsResult);
        Serial.print("Token decimals: ");
        Serial.println(decimals);
        
        // Get token balance
        string balanceParam = contract.SetupContractData("balanceOf(address)", &myAddress);
        string balanceResult = contract.ViewCall(&balanceParam);
        uint256_t tokenBalance = web3->getUint256(&balanceResult);
        string balanceStr = Util::ConvertWeiToEthString(&tokenBalance, decimals);
        
        Serial.print("Token balance: ");
        Serial.print(balanceStr.c_str());
        Serial.print(" ");
        Serial.println(tokenName.c_str());
        
        // Example transfer (uncomment to use)
        /*
        string toAddress = "0x742d35Cc6734C5c3d8D654B2C6d1d9BfbFD31930";
        uint256_t transferAmount = Util::ConvertToWei(0.1, decimals);
        
        uint32_t nonceVal = (uint32_t)web3->EthGetTransactionCount(&myAddress);
        uint32_t gasPriceVal = 20000000000ULL;
        uint32_t gasLimitVal = 100000;
        string valueStr = "0x00";
        
        string transferParam = contract.SetupContractData("transfer(address,uint256)", &toAddress, &transferAmount);
        string transferResult = contract.SendTransaction(nonceVal, gasPriceVal, gasLimitVal, &erc20ContractAddr, &valueStr, &transferParam);
        string transactionHash = web3->getString(&transferResult);
        
        Serial.println("Transfer transaction sent!");
        Serial.print("Transaction hash: ");
        Serial.println(transactionHash.c_str());
        */
        
    } catch (const std::exception& e) {
        Serial.print("Error in ERC20 operations: ");
        Serial.println(e.what());
    }
    
    Serial.println("===========================================");
}

// ===== COMPREHENSIVE TEST =====
void testBasicWeb3Operations() {
    Serial.println();
    Serial.println("========== TESTING ALL WEB3 OPERATIONS ==========");
    
    // Test 1: Balance query
    Serial.println("Test 1: Balance Query");
    queryBalance();
    delay(2000);
    
    // Test 2: Smart contract (if configured)
    if (strlen(CONTRACT_ADDRESS) > 10) {
        Serial.println("Test 2: Smart Contract Interaction");
        testSmartContractInteraction();
        delay(2000);
    } else {
        Serial.println("Test 2: Skipped (no contract address configured)");
    }
    
    // Test 3: Cryptographic operations
    Serial.println("Test 3: Cryptographic Operations");
    testCryptographicOperations();
    
    Serial.println("=================================================");
    Serial.println("All tests completed!");
}

// ===== CRYPTOGRAPHIC TESTS =====
void testCryptographicOperations() {
    Serial.println();
    Serial.println("Testing cryptographic operations...");
    
    try {
        // Test message signing and recovery
        string message = "Hello, Ethereum from ESP32!";
        string privateKey = PRIVATE_KEY;
        
        // Sign the message
        string signature = Crypto::Sign(&privateKey, &message);
        Serial.print("Message: ");
        Serial.println(message.c_str());
        Serial.print("Signature: ");
        Serial.println(signature.c_str());
        
        // Recover address from signature
        string recoveredAddress = Crypto::ECRecoverFromPersonalMessage(&signature, &message);
        Serial.print("Recovered address: ");
        Serial.println(recoveredAddress.c_str());
        
        // Verify it matches our address
        string myAddress = MY_ADDRESS;
        if (recoveredAddress == myAddress) {
            Serial.println("✓ Address recovery successful!");
        } else {
            Serial.println("✗ Address recovery failed!");
        }
        
    } catch (const std::exception& e) {
        Serial.print("Error in cryptographic operations: ");
        Serial.println(e.what());
    }
} 