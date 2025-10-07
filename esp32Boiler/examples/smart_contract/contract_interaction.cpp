/*
 * Smart Contract Interaction Example
 * 
 * This example demonstrates:
 * - Calling view functions on smart contracts
 * - Sending transactions to smart contracts
 * - Working with contract parameters and return values
 * 
 * Based on Takahiro Okada's Medium article implementation
 */

#include <WiFi.h>
#include <Web3.h>
#include <Contract.h>
#include <Util.h>

// Configuration
const char* WIFI_SSID = "YOUR_WIFI_SSID";
const char* WIFI_PASSWORD = "YOUR_WIFI_PASSWORD";
#define MY_ADDRESS "0x0000000000000000000000000000000000000000"
#define PRIVATE_KEY "0000000000000000000000000000000000000000000000000000000000000000"
#define CONTRACT_ADDRESS "0x0000000000000000000000000000000000000000"

Web3* web3;

void setup() {
    Serial.begin(115200);
    delay(1000);
    
    Serial.println("Smart Contract Interaction Example");
    Serial.println("===================================");
    
    // Setup WiFi
    setupWiFi();
    
    // Initialize Web3
    web3 = new Web3(SEPOLIA_ID);
    
    // Run contract interaction examples
    runContractExamples();
}

void loop() {
    // Periodically call retrieve function
    delay(60000); // Wait 1 minute
    callRetrieveFunction();
}

void setupWiFi() {
    WiFi.begin(WIFI_SSID, WIFI_PASSWORD);
    while (WiFi.status() != WL_CONNECTED) {
        delay(500);
        Serial.print(".");
    }
    Serial.println("\nWiFi connected!");
}

void runContractExamples() {
    Serial.println("\nRunning Smart Contract Examples...");
    
    // Example 1: Simple Storage Contract Interaction
    testSimpleStorageContract();
    
    delay(5000);
    
    // Example 2: Fixed implementation based on community feedback
    testImprovedContractInteraction();
}

void testSimpleStorageContract() {
    Serial.println("\n=== Simple Storage Contract Test ===");
    
    if (strlen(CONTRACT_ADDRESS) < 10) {
        Serial.println("Error: Please configure CONTRACT_ADDRESS");
        return;
    }
    
    try {
        Contract contract(web3, CONTRACT_ADDRESS);
        contract.SetPrivateKey(PRIVATE_KEY);
        
        string myAddress = MY_ADDRESS;
        
        // Call retrieve function
        Serial.println("1. Calling retrieve() function...");
        string retrieveParam = contract.SetupContractData("retrieve()");
        string retrieveResult = contract.ViewCall(&retrieveParam);
        uint256_t storedValue = web3->getUint256(&retrieveResult);
        
        Serial.print("   Current stored value: ");
        Serial.println(storedValue.str().c_str());
        
        // Send store transaction
        Serial.println("2. Sending store(uint256) transaction...");
        uint32_t nonceVal = (uint32_t)web3->EthGetTransactionCount(&myAddress);
        uint32_t gasPriceVal = 20000000000ULL; // 20 Gwei
        uint32_t gasLimitVal = 100000;
        string contractAddr = CONTRACT_ADDRESS;
        uint256_t callValue = 0;
        
        // Store a random value
        uint256_t valueToStore = random(1, 1000);
        string storeParam = contract.SetupContractData("store(uint256)", valueToStore);
        
        Serial.print("   Storing value: ");
        Serial.println(valueToStore.str().c_str());
        
        string storeResult = contract.SendTransaction(nonceVal, gasPriceVal, gasLimitVal, &contractAddr, &callValue, &storeParam);
        string transactionHash = web3->getResult(&storeResult);
        
        Serial.println("   Transaction sent!");
        Serial.print("   TX Hash: ");
        Serial.println(transactionHash.c_str());
        
    } catch (const std::exception& e) {
        Serial.print("Error in simple storage test: ");
        Serial.println(e.what());
    }
}

void testImprovedContractInteraction() {
    Serial.println("\n=== Improved Contract Interaction ===");
    Serial.println("(Based on community fixes for Web3E library)");
    
    try {
        Contract contract(web3, CONTRACT_ADDRESS);
        contract.SetPrivateKey(PRIVATE_KEY);
        
        string myAddress = MY_ADDRESS;
        uint32_t nonceVal = (uint32_t)web3->EthGetTransactionCount(&myAddress);
        uint32_t gasPriceVal = 20000000000ULL;
        uint32_t gasLimitVal = 100000;
        string contractAddr = CONTRACT_ADDRESS;
        uint256_t valueStr = 0x00;
        uint8_t dataStr[100];
        memset(dataStr, 0, 100);
        
        Serial.println("Using improved method for contract data setup...");
        
        // Use the fixed method from community feedback
        contract.SetupContractData((char*)dataStr, "store(uint256)", 123);
        
        // Convert dataStr to std::string
        std::string dataString(reinterpret_cast<char*>(dataStr));
        
        // Send transaction
        string result = contract.SendTransaction(nonceVal, gasPriceVal, gasLimitVal, &contractAddr, &valueStr, &dataString);
        string transactionHash = web3->getResult(&result);
        
        Serial.println("Improved method transaction sent!");
        Serial.print("TX Hash: ");
        Serial.println(transactionHash.c_str());
        
        // Check on Etherscan
        Serial.println("Check transaction on Sepolia Etherscan:");
        Serial.print("https://sepolia.etherscan.io/tx/");
        Serial.println(transactionHash.c_str());
        
    } catch (const std::exception& e) {
        Serial.print("Error in improved interaction: ");
        Serial.println(e.what());
    }
}

void callRetrieveFunction() {
    try {
        Contract contract(web3, CONTRACT_ADDRESS);
        string retrieveParam = contract.SetupContractData("retrieve()");
        string retrieveResult = contract.ViewCall(&retrieveParam);
        uint256_t storedValue = web3->getUint256(&retrieveResult);
        
        Serial.print("[Periodic Check] Stored value: ");
        Serial.println(storedValue.str().c_str());
        
    } catch (const std::exception& e) {
        Serial.print("Error in periodic retrieve: ");
        Serial.println(e.what());
    }
}

void demonstrateParameterHandling() {
    Serial.println("\n=== Parameter Handling Examples ===");
    
    try {
        Contract contract(web3, CONTRACT_ADDRESS);
        
        // Example with different parameter types
        string address = "0x742d35Cc6734C5c3d8D654B2C6d1d9BfbFD31930";
        uint256_t amount = 1000;
        
        // Setup contract call with multiple parameters
        string param = contract.SetupContractData("someFunction(address,uint256)", &address, amount);
        
        Serial.println("Contract call data prepared for function with multiple parameters");
        
    } catch (const std::exception& e) {
        Serial.print("Error in parameter handling: ");
        Serial.println(e.what());
    }
} 