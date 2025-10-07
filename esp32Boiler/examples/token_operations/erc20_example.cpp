/*
 * ERC20 Token Operations Example
 * 
 * This example demonstrates:
 * - Querying ERC20 token information
 * - Checking token balances
 * - Transferring tokens
 * - Approving token spending
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

// Example ERC20 contracts (Sepolia testnet)
#define USDC_CONTRACT "0xA0b86a33E6417b1f2371c31db62C46a29E8f8A37"  // Example USDC on Sepolia
#define TEST_TOKEN_CONTRACT "0x0000000000000000000000000000000000000000"  // Your test token

Web3* web3;

void setup() {
    Serial.begin(115200);
    delay(1000);
    
    Serial.println("ERC20 Token Operations Example");
    Serial.println("==============================");
    
    // Setup WiFi
    setupWiFi();
    
    // Initialize Web3
    web3 = new Web3(SEPOLIA_ID);
    
    // Run ERC20 examples
    runERC20Examples();
}

void loop() {
    // Check balances every minute
    delay(60000);
    checkAllBalances();
}

void setupWiFi() {
    WiFi.begin(WIFI_SSID, WIFI_PASSWORD);
    while (WiFi.status() != WL_CONNECTED) {
        delay(500);
        Serial.print(".");
    }
    Serial.println("\nWiFi connected!");
}

void runERC20Examples() {
    Serial.println("\nRunning ERC20 Token Examples...");
    
    // Example 1: Get token information
    getTokenInfo(USDC_CONTRACT);
    
    delay(2000);
    
    // Example 2: Check token balance
    checkTokenBalance(USDC_CONTRACT);
    
    delay(2000);
    
    // Example 3: Transfer tokens (commented out for safety)
    // transferTokens(USDC_CONTRACT, "0x742d35Cc6734C5c3d8D654B2C6d1d9BfbFD31930", 1);
    
    // Example 4: Approve token spending
    // approveTokens(USDC_CONTRACT, "0x742d35Cc6734C5c3d8D654B2C6d1d9BfbFD31930", 100);
}

void getTokenInfo(const char* tokenContract) {
    Serial.println("\n=== Getting Token Information ===");
    Serial.print("Contract: ");
    Serial.println(tokenContract);
    
    try {
        Contract contract(web3, tokenContract);
        
        // Get token name
        string nameParam = contract.SetupContractData("name()");
        string nameResult = contract.ViewCall(&nameParam);
        string tokenName = Util::InterpretStringResult(web3->getString(&nameResult).c_str());
        
        // Get token symbol
        string symbolParam = contract.SetupContractData("symbol()");
        string symbolResult = contract.ViewCall(&symbolParam);
        string tokenSymbol = Util::InterpretStringResult(web3->getString(&symbolResult).c_str());
        
        // Get token decimals
        string decimalsParam = contract.SetupContractData("decimals()");
        string decimalsResult = contract.ViewCall(&decimalsParam);
        int decimals = web3->getInt(&decimalsResult);
        
        // Get total supply
        string supplyParam = contract.SetupContractData("totalSupply()");
        string supplyResult = contract.ViewCall(&supplyParam);
        uint256_t totalSupply = web3->getUint256(&supplyResult);
        string supplyStr = Util::ConvertWeiToEthString(&totalSupply, decimals);
        
        Serial.print("Name: ");
        Serial.println(tokenName.c_str());
        Serial.print("Symbol: ");
        Serial.println(tokenSymbol.c_str());
        Serial.print("Decimals: ");
        Serial.println(decimals);
        Serial.print("Total Supply: ");
        Serial.print(supplyStr.c_str());
        Serial.print(" ");
        Serial.println(tokenSymbol.c_str());
        
    } catch (const std::exception& e) {
        Serial.print("Error getting token info: ");
        Serial.println(e.what());
    }
}

void checkTokenBalance(const char* tokenContract) {
    Serial.println("\n=== Checking Token Balance ===");
    
    try {
        Contract contract(web3, tokenContract);
        
        string myAddress = MY_ADDRESS;
        
        // Get token decimals first
        string decimalsParam = contract.SetupContractData("decimals()");
        string decimalsResult = contract.ViewCall(&decimalsParam);
        int decimals = web3->getInt(&decimalsResult);
        
        // Get token balance
        string balanceParam = contract.SetupContractData("balanceOf(address)", &myAddress);
        string balanceResult = contract.ViewCall(&balanceParam);
        uint256_t tokenBalance = web3->getUint256(&balanceResult);
        
        string balanceStr = Util::ConvertWeiToEthString(&tokenBalance, decimals);
        
        Serial.print("Your balance: ");
        Serial.print(balanceStr.c_str());
        Serial.println(" tokens");
        
        // Also show raw balance
        Serial.print("Raw balance: ");
        Serial.print(tokenBalance.str().c_str());
        Serial.println(" (smallest units)");
        
    } catch (const std::exception& e) {
        Serial.print("Error checking balance: ");
        Serial.println(e.what());
    }
}

void transferTokens(const char* tokenContract, const char* toAddress, double amount) {
    Serial.println("\n=== Transferring Tokens ===");
    Serial.print("To: ");
    Serial.println(toAddress);
    Serial.print("Amount: ");
    Serial.println(amount);
    
    try {
        Contract contract(web3, tokenContract);
        contract.SetPrivateKey(PRIVATE_KEY);
        
        string myAddress = MY_ADDRESS;
        string recipient = toAddress;
        
        // Get token decimals
        string decimalsParam = contract.SetupContractData("decimals()");
        string decimalsResult = contract.ViewCall(&decimalsParam);
        int decimals = web3->getInt(&decimalsResult);
        
        // Convert amount to wei
        uint256_t transferAmount = Util::ConvertToWei(amount, decimals);
        
        // Get transaction details
        uint32_t nonceVal = (uint32_t)web3->EthGetTransactionCount(&myAddress);
        uint32_t gasPriceVal = 20000000000ULL; // 20 Gwei
        uint32_t gasLimitVal = 100000;
        string contractAddr = tokenContract;
        string valueStr = "0x00"; // No ETH sent, just token transfer
        
        // Setup transfer function call
        string transferParam = contract.SetupContractData("transfer(address,uint256)", &recipient, &transferAmount);
        
        Serial.println("Sending transfer transaction...");
        
        // Send transaction
        string transferResult = contract.SendTransaction(nonceVal, gasPriceVal, gasLimitVal, &contractAddr, &valueStr, &transferParam);
        string transactionHash = web3->getString(&transferResult);
        
        Serial.println("Transfer transaction sent!");
        Serial.print("TX Hash: ");
        Serial.println(transactionHash.c_str());
        Serial.print("Check on Etherscan: https://sepolia.etherscan.io/tx/");
        Serial.println(transactionHash.c_str());
        
    } catch (const std::exception& e) {
        Serial.print("Error transferring tokens: ");
        Serial.println(e.what());
    }
}

void approveTokens(const char* tokenContract, const char* spenderAddress, double amount) {
    Serial.println("\n=== Approving Token Spending ===");
    Serial.print("Spender: ");
    Serial.println(spenderAddress);
    Serial.print("Amount: ");
    Serial.println(amount);
    
    try {
        Contract contract(web3, tokenContract);
        contract.SetPrivateKey(PRIVATE_KEY);
        
        string myAddress = MY_ADDRESS;
        string spender = spenderAddress;
        
        // Get token decimals
        string decimalsParam = contract.SetupContractData("decimals()");
        string decimalsResult = contract.ViewCall(&decimalsParam);
        int decimals = web3->getInt(&decimalsResult);
        
        // Convert amount to wei
        uint256_t approveAmount = Util::ConvertToWei(amount, decimals);
        
        // Get transaction details
        uint32_t nonceVal = (uint32_t)web3->EthGetTransactionCount(&myAddress);
        uint32_t gasPriceVal = 20000000000ULL; // 20 Gwei
        uint32_t gasLimitVal = 80000;
        string contractAddr = tokenContract;
        string valueStr = "0x00";
        
        // Setup approve function call
        string approveParam = contract.SetupContractData("approve(address,uint256)", &spender, &approveAmount);
        
        Serial.println("Sending approve transaction...");
        
        // Send transaction
        string approveResult = contract.SendTransaction(nonceVal, gasPriceVal, gasLimitVal, &contractAddr, &valueStr, &approveParam);
        string transactionHash = web3->getString(&approveResult);
        
        Serial.println("Approve transaction sent!");
        Serial.print("TX Hash: ");
        Serial.println(transactionHash.c_str());
        
    } catch (const std::exception& e) {
        Serial.print("Error approving tokens: ");
        Serial.println(e.what());
    }
}

void checkAllowance(const char* tokenContract, const char* ownerAddress, const char* spenderAddress) {
    Serial.println("\n=== Checking Allowance ===");
    
    try {
        Contract contract(web3, tokenContract);
        
        string owner = ownerAddress;
        string spender = spenderAddress;
        
        // Get token decimals
        string decimalsParam = contract.SetupContractData("decimals()");
        string decimalsResult = contract.ViewCall(&decimalsParam);
        int decimals = web3->getInt(&decimalsResult);
        
        // Get allowance
        string allowanceParam = contract.SetupContractData("allowance(address,address)", &owner, &spender);
        string allowanceResult = contract.ViewCall(&allowanceParam);
        uint256_t allowance = web3->getUint256(&allowanceResult);
        
        string allowanceStr = Util::ConvertWeiToEthString(&allowance, decimals);
        
        Serial.print("Allowance: ");
        Serial.print(allowanceStr.c_str());
        Serial.println(" tokens");
        
    } catch (const std::exception& e) {
        Serial.print("Error checking allowance: ");
        Serial.println(e.what());
    }
}

void checkAllBalances() {
    Serial.println("\n=== Periodic Balance Check ===");
    
    // Check ETH balance
    string myAddress = MY_ADDRESS;
    try {
        uint256_t ethBalance = web3->EthGetBalance(&myAddress);
        string ethBalanceStr = Util::ConvertWeiToEthString(&ethBalance, 18);
        Serial.print("ETH Balance: ");
        Serial.print(ethBalanceStr.c_str());
        Serial.println(" ETH");
    } catch (const std::exception& e) {
        Serial.print("Error checking ETH balance: ");
        Serial.println(e.what());
    }
    
    // Check token balances
    if (strlen(USDC_CONTRACT) > 10) {
        checkTokenBalance(USDC_CONTRACT);
    }
    
    if (strlen(TEST_TOKEN_CONTRACT) > 10) {
        checkTokenBalance(TEST_TOKEN_CONTRACT);
    }
} 