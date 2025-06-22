# Blockchain Projects Collection

A comprehensive collection of decentralized applications (dApps) built with Ethereum smart contracts and modern web technologies. This repository contains various blockchain projects demonstrating different use cases and implementations.

## 🚀 Projects Overview

### 1. [Hello World dApp](./hello-world-dapp/)
A simple introduction to blockchain development featuring a name storage contract where users can store and retrieve names associated with their Ethereum addresses.

**Key Features:**
- Basic smart contract interaction
- Name storage and retrieval
- User-friendly web interface

### 2. [Fake Proof Tickets dApp](./fake-proof-tickets-dapp/)
A ticket management system built on blockchain for creating, transferring, and verifying digital tickets with proof of ownership.

**Key Features:**
- Digital ticket issuance
- Secure ticket transfer
- Ticket verification system
- Ticket invalidation capabilities

### 3. [Voting dApp](./voting-dapp/)
A decentralized voting system that allows users to cast votes for candidates in a transparent and immutable manner.

**Key Features:**
- One vote per address
- Pre-defined candidates
- Transparent vote counting
- Event emission for vote tracking

### 4. [Scholarship dApp](./scholarship-dapp/)
A scholarship management platform that enables donations, applications, and fund distribution through smart contracts.

**Key Features:**
- Donation collection
- Scholarship applications
- Admin-controlled fund distribution
- Transparent fund management

### 5. [Pet Shop dApp](./pet_shop_dapp/)
A pet adoption platform demonstrating how to build a complete dApp with a user-friendly interface for adopting pets.

**Key Features:**
- Pet adoption system
- Modern web interface
- Bootstrap-based UI
- Complete dApp workflow

## 🛠️ Technology Stack

- **Blockchain:** Ethereum
- **Smart Contracts:** Solidity (^0.8.0)
- **Development Framework:** Truffle
- **Frontend:** HTML, CSS, JavaScript, Bootstrap
- **Web3 Integration:** Web3.js, Truffle Contract

## 📋 Prerequisites

Before running any of these projects, make sure you have the following installed:

- [Node.js](https://nodejs.org/) (v14 or higher)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)
- [Truffle](https://www.trufflesuite.com/truffle) (`npm install -g truffle`)
- [Ganache](https://www.trufflesuite.com/ganache) (for local blockchain development)
- [MetaMask](https://metamask.io/) (browser extension for wallet integration)

## 🚀 Quick Start

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd blockchain_projects
   ```

2. **Install dependencies for each project:**
   ```bash
   # Navigate to any project directory
   cd hello-world-dapp
   npm install
   ```

3. **Start local blockchain:**
   - Open Ganache and start a local blockchain
   - Note the RPC URL (usually `http://127.0.0.1:8545`)

4. **Deploy smart contracts:**
   ```bash
   truffle migrate --reset
   ```

5. **Run the frontend:**
   ```bash
   npm run dev
   # or
   truffle serve
   ```

## 📁 Project Structure

```
blockchain_projects/
├── hello-world-dapp/          # Basic name storage dApp
├── fake-proof-tickets-dapp/   # Digital ticket management
├── voting-dapp/              # Decentralized voting system
├── scholarship-dapp/         # Scholarship management platform
├── pet_shop_dapp/           # Pet adoption platform
└── .dist/                   # Distribution files
```

## 🔧 Common Commands

### For all projects:
```bash
# Compile contracts
truffle compile

# Deploy to local network
truffle migrate --reset

# Run tests
truffle test

# Start development server
truffle serve
```

## 🧪 Testing

Each project includes comprehensive test suites. Run tests with:
```bash
truffle test
```

## 📚 Learning Resources

- [Truffle Documentation](https://www.trufflesuite.com/docs)
- [Solidity Documentation](https://docs.soliditylang.org/)
- [Web3.js Documentation](https://web3js.org/docs/)
- [Ethereum Developer Resources](https://ethereum.org/developers/)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

If you encounter any issues or have questions:

1. Check the individual project README files
2. Review the Truffle documentation
3. Open an issue in this repository

## 🔗 Useful Links

- [Ethereum Mainnet](https://ethereum.org/)
- [Ethereum Testnets](https://ethereum.org/en/developers/docs/networks/)
- [MetaMask](https://metamask.io/)
- [Ganache](https://www.trufflesuite.com/ganache)

---

**Happy Building! 🚀** 