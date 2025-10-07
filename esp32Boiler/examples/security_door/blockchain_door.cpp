/*
 * Blockchain Security Door Example
 * 
 * This example demonstrates a real-world IoT application using Web3:
 * - Token-based access control
 * - Challenge-response authentication
 * - Integration with physical hardware (relays, sensors)
 * 
 * Based on AlphaWallet's office door implementation
 */

#include <WiFi.h>
#include <WebServer.h>
#include <Web3.h>
#include <Contract.h>
#include <Crypto.h>
#include <Util.h>

// Configuration
const char* WIFI_SSID = "YOUR_WIFI_SSID";
const char* WIFI_PASSWORD = "YOUR_WIFI_PASSWORD";
#define DOOR_CONTRACT "0x0000000000000000000000000000000000000000"  // Access token contract
#define SERVER_PORT 80

// Hardware pins
#define DOOR_RELAY_PIN 2
#define STATUS_LED_PIN 13
#define BUZZER_PIN 4

// Global variables
Web3* web3;
WebServer server(SERVER_PORT);
String currentChallenge;
unsigned long challengeTime;
const unsigned long CHALLENGE_TIMEOUT = 300000; // 5 minutes

void setup() {
    Serial.begin(115200);
    delay(1000);
    
    Serial.println("Blockchain Security Door System");
    Serial.println("===============================");
    
    // Initialize hardware
    setupHardware();
    
    // Setup WiFi
    setupWiFi();
    
    // Initialize Web3
    web3 = new Web3(SEPOLIA_ID);
    
    // Setup web server
    setupWebServer();
    
    // Generate initial challenge
    updateChallenge();
    
    Serial.println("Security door system ready!");
    Serial.print("Access URL: http://");
    Serial.println(WiFi.localIP());
}

void loop() {
    server.handleClient();
    
    // Update challenge periodically
    if (millis() - challengeTime > CHALLENGE_TIMEOUT) {
        updateChallenge();
    }
    
    delay(100);
}

void setupHardware() {
    // Initialize pins
    pinMode(DOOR_RELAY_PIN, OUTPUT);
    pinMode(STATUS_LED_PIN, OUTPUT);
    pinMode(BUZZER_PIN, OUTPUT);
    
    // Set initial states
    digitalWrite(DOOR_RELAY_PIN, LOW);  // Door locked
    digitalWrite(STATUS_LED_PIN, LOW);  // Status off
    digitalWrite(BUZZER_PIN, LOW);      // Buzzer off
    
    Serial.println("Hardware initialized");
}

void setupWiFi() {
    WiFi.begin(WIFI_SSID, WIFI_PASSWORD);
    Serial.print("Connecting to WiFi");
    
    while (WiFi.status() != WL_CONNECTED) {
        delay(500);
        Serial.print(".");
        digitalWrite(STATUS_LED_PIN, !digitalRead(STATUS_LED_PIN)); // Blink while connecting
    }
    
    Serial.println();
    Serial.println("WiFi connected!");
    Serial.print("IP address: ");
    Serial.println(WiFi.localIP());
    
    digitalWrite(STATUS_LED_PIN, HIGH); // Solid LED when connected
}

void setupWebServer() {
    // Serve main page
    server.on("/", handleRoot);
    
    // API endpoints
    server.on("/api/getChallenge", handleGetChallenge);
    server.on("/api/checkSignature", handleCheckSignature);
    server.on("/api/status", handleStatus);
    
    // Start server
    server.begin();
    Serial.println("Web server started");
}

void handleRoot() {
    String html = generateDAppHTML();
    server.send(200, "text/html", html);
}

String generateDAppHTML() {
    String html = R"(
<!DOCTYPE html>
<html>
<head>
    <title>Blockchain Security Door</title>
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <style>
        body {
            font-family: Arial, sans-serif;
            max-width: 500px;
            margin: 50px auto;
            padding: 20px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
        }
        .container {
            background: rgba(255,255,255,0.1);
            padding: 30px;
            border-radius: 15px;
            backdrop-filter: blur(10px);
        }
        button {
            background: #4CAF50;
            color: white;
            padding: 15px 30px;
            border: none;
            border-radius: 8px;
            cursor: pointer;
            font-size: 16px;
            width: 100%;
            margin: 10px 0;
        }
        button:hover {
            background: #45a049;
        }
        .status {
            margin: 20px 0;
            padding: 15px;
            border-radius: 8px;
            background: rgba(255,255,255,0.1);
        }
        .error {
            background: rgba(255,0,0,0.3);
        }
        .success {
            background: rgba(0,255,0,0.3);
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>🔐 Blockchain Security Door</h1>
        <p>Authenticate with your Ethereum wallet to access the door</p>
        
        <div id="status" class="status">
            Ready to authenticate...
        </div>
        
        <button onclick="openDoor()">Open Door</button>
        <button onclick="checkStatus()">Check Status</button>
        
        <div style="margin-top: 20px; font-size: 12px; opacity: 0.7;">
            <p>Requirements:</p>
            <ul>
                <li>MetaMask or Web3 wallet</li>
                <li>Valid access token</li>
                <li>Sepolia testnet</li>
            </ul>
        </div>
    </div>

    <script>
        async function openDoor() {
            const statusDiv = document.getElementById('status');
            
            try {
                // Check if Web3 is available
                if (typeof window.ethereum === 'undefined') {
                    throw new Error('Please install MetaMask or another Web3 wallet');
                }
                
                statusDiv.innerHTML = '🔄 Getting challenge...';
                statusDiv.className = 'status';
                
                // Get challenge from device
                const challengeResponse = await fetch('/api/getChallenge');
                const challenge = await challengeResponse.text();
                
                statusDiv.innerHTML = '📝 Please sign the challenge in your wallet...';
                
                // Request account access
                await window.ethereum.request({ method: 'eth_requestAccounts' });
                
                // Sign the challenge
                const accounts = await window.ethereum.request({ method: 'eth_accounts' });
                const signature = await window.ethereum.request({
                    method: 'personal_sign',
                    params: [challenge, accounts[0]]
                });
                
                statusDiv.innerHTML = '🔍 Verifying signature...';
                
                // Send signature to device
                const verifyResponse = await fetch(`/api/checkSignature?sig=${signature}&addr=${accounts[0]}`);
                const result = await verifyResponse.text();
                
                if (result.includes('pass')) {
                    statusDiv.innerHTML = '✅ Access granted! Door opening...';
                    statusDiv.className = 'status success';
                } else {
                    statusDiv.innerHTML = '❌ Access denied: ' + result;
                    statusDiv.className = 'status error';
                }
                
            } catch (error) {
                statusDiv.innerHTML = '❌ Error: ' + error.message;
                statusDiv.className = 'status error';
                console.error('Error:', error);
            }
        }
        
        async function checkStatus() {
            try {
                const response = await fetch('/api/status');
                const status = await response.text();
                document.getElementById('status').innerHTML = status;
            } catch (error) {
                console.error('Status check failed:', error);
            }
        }
        
        // Auto-refresh status every 10 seconds
        setInterval(checkStatus, 10000);
    </script>
</body>
</html>
)";
    return html;
}

void handleGetChallenge() {
    updateChallenge();
    server.send(200, "text/plain", currentChallenge);
    
    Serial.print("Challenge generated: ");
    Serial.println(currentChallenge);
}

void handleCheckSignature() {
    String signature = server.arg("sig");
    String userAddress = server.arg("addr");
    
    if (signature.length() == 0) {
        server.send(400, "text/plain", "Missing signature parameter");
        return;
    }
    
    Serial.println("Checking signature...");
    Serial.print("Signature: ");
    Serial.println(signature);
    Serial.print("User Address: ");
    Serial.println(userAddress);
    
    try {
        // Recover address from signature
        string sigStr = signature.c_str();
        string challengeStr = currentChallenge.c_str();
        string recoveredAddress = Crypto::ECRecoverFromPersonalMessage(&sigStr, &challengeStr);
        
        Serial.print("Recovered address: ");
        Serial.println(recoveredAddress.c_str());
        
        // Verify address matches
        if (userAddress.equalsIgnoreCase(recoveredAddress.c_str())) {
            Serial.println("Address verification passed");
            
            // Check if user has access token
            bool hasToken = checkAccessToken(recoveredAddress);
            
            if (hasToken) {
                server.send(200, "text/plain", "pass");
                grantAccess(userAddress);
                updateChallenge(); // Generate new challenge
            } else {
                server.send(200, "text/plain", "fail: no access token");
                denyAccess(userAddress);
            }
        } else {
            server.send(200, "text/plain", "fail: signature verification failed");
            denyAccess(userAddress);
        }
        
    } catch (const std::exception& e) {
        Serial.print("Error in signature verification: ");
        Serial.println(e.what());
        server.send(500, "text/plain", "fail: verification error");
    }
}

void handleStatus() {
    String status = "🔐 Door Status: ";
    status += digitalRead(DOOR_RELAY_PIN) ? "OPEN" : "LOCKED";
    status += "<br>Challenge expires in: ";
    status += String((CHALLENGE_TIMEOUT - (millis() - challengeTime)) / 1000);
    status += " seconds";
    
    server.send(200, "text/html", status);
}

bool checkAccessToken(const string& userAddress) {
    if (strlen(DOOR_CONTRACT) < 10) {
        Serial.println("Warning: No door contract configured, allowing access");
        return true; // Allow access if no contract is configured (for testing)
    }
    
    try {
        Contract contract(web3, DOOR_CONTRACT);
        
        // Check ERC721 balance (NFT-based access)
        string balanceParam = contract.SetupContractData("balanceOf(address)", &userAddress);
        string balanceResult = contract.ViewCall(&balanceParam);
        uint256_t balance = web3->getUint256(&balanceResult);
        
        Serial.print("User token balance: ");
        Serial.println(balance.str().c_str());
        
        return balance > 0;
        
    } catch (const std::exception& e) {
        Serial.print("Error checking access token: ");
        Serial.println(e.what());
        return false;
    }
}

void grantAccess(const String& userAddress) {
    Serial.println("ACCESS GRANTED");
    Serial.print("User: ");
    Serial.println(userAddress);
    
    // Visual feedback
    signalAccess(true);
    
    // Open door
    openDoor();
}

void denyAccess(const String& userAddress) {
    Serial.println("ACCESS DENIED");
    Serial.print("User: ");
    Serial.println(userAddress);
    
    // Visual feedback
    signalAccess(false);
}

void openDoor() {
    Serial.println("Opening door...");
    
    // Activate door relay
    digitalWrite(DOOR_RELAY_PIN, HIGH);
    
    // Keep door open for 5 seconds
    delay(5000);
    
    // Close door
    digitalWrite(DOOR_RELAY_PIN, LOW);
    
    Serial.println("Door closed");
}

void signalAccess(bool granted) {
    if (granted) {
        // Success signal: 2 short beeps, green LED
        for (int i = 0; i < 2; i++) {
            digitalWrite(BUZZER_PIN, HIGH);
            digitalWrite(STATUS_LED_PIN, HIGH);
            delay(200);
            digitalWrite(BUZZER_PIN, LOW);
            digitalWrite(STATUS_LED_PIN, LOW);
            delay(200);
        }
        digitalWrite(STATUS_LED_PIN, HIGH); // Keep LED on
    } else {
        // Denial signal: 1 long beep, red LED blink
        digitalWrite(BUZZER_PIN, HIGH);
        for (int i = 0; i < 5; i++) {
            digitalWrite(STATUS_LED_PIN, HIGH);
            delay(100);
            digitalWrite(STATUS_LED_PIN, LOW);
            delay(100);
        }
        digitalWrite(BUZZER_PIN, LOW);
        digitalWrite(STATUS_LED_PIN, HIGH); // Return to normal
    }
}

void updateChallenge() {
    // Generate random challenge string
    String words[] = {"apple", "banana", "cherry", "dragon", "eagle", "falcon", "grape", "honey"};
    int randomWord = random(0, 8);
    int randomNumber = random(10000, 99999);
    
    currentChallenge = words[randomWord] + " " + String(randomNumber);
    challengeTime = millis();
    
    Serial.print("New challenge: ");
    Serial.println(currentChallenge);
} 