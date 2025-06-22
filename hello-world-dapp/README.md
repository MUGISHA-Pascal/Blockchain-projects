# Hello World dApp

A simple decentralized application (dApp) that demonstrates basic blockchain interaction by allowing users to store and retrieve names associated with their Ethereum addresses.

## 🎯 Overview

This project serves as an excellent starting point for blockchain development beginners. It showcases fundamental concepts like:
- Smart contract deployment
- Web3 integration
- Basic user interactions with blockchain
- Frontend-backend communication

## 🏗️ Smart Contract

The `NameStorage.sol` contract provides three main functions:

### Functions

- **`setName(string calldata _name)`**: Stores a name for the sender's address
- **`getName(address _user)`**: Retrieves the name associated with a specific address
- **`getMyName()`**: Gets the name for the current user's address

### Contract Features

- Uses Solidity ^0.8.0
- Implements a mapping to store address-to-name relationships
- Includes proper access control and data validation

## 🚀 Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Truffle (`npm install -g truffle`)
- Ganache (local blockchain)
- MetaMask (browser extension)

### Installation

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start Ganache:**
   - Open Ganache and start a local blockchain
   - Note the RPC URL (usually `http://127.0.0.1:8545`)

3. **Deploy the contract:**
   ```bash
   truffle migrate --reset
   ```

4. **Start the development server:**
   ```bash
   truffle serve
   ```

5. **Open your browser:**
   - Navigate to `http://localhost:8080`
   - Connect MetaMask to your local network
   - Import an account from Ganache

## 🎮 How to Use

1. **Set Your Name:**
   - Enter your name in the input field
   - Click "Set Name" to store it on the blockchain
   - Confirm the transaction in MetaMask

2. **Get Your Name:**
   - Click "Get My Name" to retrieve your stored name
   - The name will be displayed on the page

3. **Get Other's Name:**
   - Enter an Ethereum address in the input field
   - Click "Get Name" to retrieve the name associated with that address

## 📁 Project Structure

```
hello-world-dapp/
├── contracts/
│   └── NameStorage.sol      # Main smart contract
├── migrations/
│   └── 2_deploy_contracts.js
├── test/
│   └── NameStorage.test.js
├── frontend/
│   ├── index.html
│   └── app.js
├── build/                   # Compiled contracts
├── truffle-config.js        # Truffle configuration
└── README.md
```

## 🧪 Testing

Run the test suite to verify contract functionality:

```bash
truffle test
```

## 🔧 Development

### Compile Contracts
```bash
truffle compile
```

### Deploy to Local Network
```bash
truffle migrate --reset
```

### Run Tests
```bash
truffle test
```

### Start Development Server
```bash
truffle serve
```

## 🌐 Frontend Features

- Clean, responsive interface
- Real-time blockchain interaction
- MetaMask integration
- Transaction status feedback
- Error handling and validation

## 🔍 Key Learning Points

1. **Smart Contract Basics:**
   - State variables and mappings
   - Function visibility and modifiers
   - Event emission

2. **Web3 Integration:**
   - Contract instance creation
   - Function calls and transactions
   - Event listening

3. **User Experience:**
   - MetaMask connection
   - Transaction confirmation
   - Error handling

## 🐛 Troubleshooting

### Common Issues

1. **MetaMask Connection:**
   - Ensure MetaMask is connected to the correct network
   - Import accounts from Ganache

2. **Transaction Failures:**
   - Check if you have sufficient ETH for gas
   - Verify network configuration

3. **Contract Not Found:**
   - Ensure contracts are properly deployed
   - Check migration status

## 📚 Next Steps

After mastering this project, consider exploring:

- [Fake Proof Tickets dApp](../fake-proof-tickets-dapp/) - More complex state management
- [Voting dApp](../voting-dapp/) - Event-driven applications
- [Scholarship dApp](../scholarship-dapp/) - Financial applications
- [Pet Shop dApp](../pet_shop_dapp/) - Complete dApp workflow

## 🤝 Contributing

Feel free to contribute to this project by:
- Reporting bugs
- Suggesting new features
- Improving documentation
- Adding tests

## 📄 License

This project is licensed under the MIT License.

---

**Happy Coding! 🚀** 