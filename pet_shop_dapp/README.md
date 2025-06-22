# Pet Shop dApp

A complete decentralized pet adoption platform built on Ethereum blockchain with a modern web interface for adopting pets.

## 🎯 Overview

This dApp demonstrates a full-stack blockchain application with:
- Pet adoption system
- Modern Bootstrap-based UI
- Complete dApp workflow
- Web3 integration

## 🏗️ Smart Contract

The `Migrations.sol` contract provides:
- Contract deployment tracking
- Migration management
- Owner access control

## 🚀 Getting Started

### Prerequisites
- Node.js (v14+)
- npm or yarn
- Truffle (`npm install -g truffle`)
- Ganache (local blockchain)
- MetaMask

### Installation

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Deploy contracts:**
   ```bash
   truffle migrate --reset
   ```

3. **Start development server:**
   ```bash
   npm run dev
   ```

## 🎮 Usage

1. **Browse Pets:** View available pets in the adoption gallery
2. **Adopt Pet:** Click "Adopt" button for your chosen pet
3. **Confirm Transaction:** Approve the adoption in MetaMask
4. **Complete Adoption:** Pet ownership transferred to your address

## 🧪 Testing

```bash
truffle test
```

## 📁 Structure

```
pet_shop_dapp/
├── contracts/Migrations.sol   # Migration contract
├── src/                       # Frontend source
│   ├── index.html            # Main page
│   ├── js/                   # JavaScript files
│   ├── css/                  # Stylesheets
│   ├── images/               # Pet images
│   └── pets.json             # Pet data
├── migrations/               # Deployment scripts
├── test/                     # Test files
├── package.json              # Dependencies
└── truffle-config.js         # Configuration
```

## 🌐 Frontend Features

- **Responsive Design:** Bootstrap-based modern UI
- **Pet Gallery:** Display available pets with images
- **Adoption Interface:** Simple adoption process
- **Web3 Integration:** Seamless blockchain interaction

## 🔍 Key Features

- **Pet Management:** Display and manage pet information
- **Adoption System:** Transfer pet ownership on blockchain
- **User Interface:** Clean, intuitive adoption platform
- **Data Persistence:** Pet information stored in JSON

## 🎨 UI Components

- **Pet Cards:** Individual pet display with images
- **Adoption Buttons:** Interactive adoption controls
- **Responsive Layout:** Mobile-friendly design
- **Bootstrap Styling:** Professional appearance

## 📄 License

ISC License 