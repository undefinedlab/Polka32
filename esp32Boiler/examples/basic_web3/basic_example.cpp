/*
 * Basic Web3 Example
 * 
 * This example demonstrates the fundamental Web3 operations:
 * - Connecting to Ethereum network
 * - Querying account balance
 * - Getting transaction count (nonce)
 * - Basic network operations
 */

#include <WiFi.h>
#include <Web3.h>
#include <Util.h>

// Configuration
const char* WIFI_SSID = "YOUR_WIFI_SSID";
const char* WIFI_PASSWORD = "YOUR_WIFI_PASSWORD";
#define MY_ADDRESS "0x0000000000000000000000000000000000000000"

Web3* web3;

void setup() {
    Serial.begin(115200);
    delay(1000);
    
    Serial.println("Basic Web3 Example Starting...");
    
    // Connect to WiFi
    WiFi.begin(WIFI_SSID, WIFI_PASSWORD);
    while (WiFi.status() != WL_CONNECTED) {
        delay(500);
        Serial.print(".");
    }
    Serial.println("\nWiFi connected!");
    
    // Initialize Web3 with Sepolia testnet
    web3 = new Web3(SEPOLIA_ID);
    
    // Test basic operations
    testBasicOperations();
}

void loop() {
    // Query balance every 30 seconds
    delay(30000);
    queryAccountBalance();
}

void testBasicOperations() {
    Serial.println("\n=== Testing Basic Web3 Operations ===");
    
    string myAddress = MY_ADDRESS;
    
    try {
        // Test 1: Get account balance
        Serial.println("1. Getting account balance...");
        uint256_t balance = web3->EthGetBalance(&myAddress);
        string balanceStr = Util::ConvertWeiToEthString(&balance, 18);
        Serial.print("   Balance: ");
        Serial.print(balanceStr.c_str());
        Serial.println(" ETH");
        
        // Test 2: Get transaction count
        Serial.println("2. Getting transaction count...");
        uint32_t nonce = (uint32_t)web3->EthGetTransactionCount(&myAddress);
        Serial.print("   Nonce: ");
        Serial.println(nonce);
        
        // Test 3: Get gas price
        Serial.println("3. Getting current gas price...");
        uint32_t gasPrice = (uint32_t)web3->EthGasPrice();
        Serial.print("   Gas Price: ");
        Serial.print(gasPrice);
        Serial.println(" wei");
        
        Serial.println("=== All basic operations completed successfully! ===");
        
    } catch (const std::exception& e) {
        Serial.print("Error in basic operations: ");
        Serial.println(e.what());
    }
}

void queryAccountBalance() {
    string myAddress = MY_ADDRESS;
    
    try {
        uint256_t balance = web3->EthGetBalance(&myAddress);
        string balanceStr = Util::ConvertWeiToEthString(&balance, 18);
        
        Serial.print("[");
        Serial.print(millis());
        Serial.print("] Current balance: ");
        Serial.print(balanceStr.c_str());
        Serial.println(" ETH");
        
    } catch (const std::exception& e) {
        Serial.print("Error querying balance: ");
        Serial.println(e.what());
    }
} 