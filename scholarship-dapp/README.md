# Scholarship dApp

A decentralized scholarship management platform built on Ethereum blockchain for collecting donations, managing applications, and distributing funds.

## 🎯 Overview

This dApp demonstrates blockchain-based scholarship management with:
- Donation collection from multiple donors
- Scholarship application system
- Admin-controlled fund distribution
- Transparent fund management

## 🏗️ Smart Contract

The `Scholarship.sol` contract provides:

### Functions
- **`donate()`**: Send ETH donations to the scholarship fund
- **`applyForScholarship()`**: Apply for scholarship (one per address)
- **`releaseFunds(address payable recipient, uint256 amount)`**: Admin distributes funds
- **`getBalance()`**: Check current fund balance

### Events
- `Donated`: When someone makes a donation
- `Applied`: When someone applies for scholarship
- `FundsReleased`: When funds are distributed

### Access Control
- **Admin:** Can release funds to recipients
- **Donors:** Can contribute to the fund
- **Applicants:** Can apply for scholarships

## 🚀 Getting Started

### Prerequisites
- Node.js (v14+)
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

3. **Start server:**
   ```bash
   truffle serve
   ```

## 🎮 Usage

### For Donors
1. **Make Donation:** Enter amount and click "Donate"
2. **Confirm Transaction:** Approve the donation in MetaMask

### For Applicants
1. **Apply for Scholarship:** Click "Apply for Scholarship"
2. **Confirm Application:** Approve the transaction in MetaMask

### For Admin
1. **Release Funds:** Enter recipient address and amount
2. **Distribute:** Confirm the fund distribution

## 🧪 Testing

```bash
truffle test
```

## 📁 Structure

```
scholarship-dapp/
├── contracts/Scholarship.sol  # Main scholarship contract
├── migrations/                # Deployment scripts
├── test/                      # Test files
├── frontend/                  # Web interface
└── truffle-config.js          # Configuration
```

## 🔍 Key Features

- **Donation System:** Accept ETH donations from multiple sources
- **Application Tracking:** One application per address
- **Fund Management:** Admin-controlled distribution
- **Transparency:** All transactions recorded on blockchain

## 🔒 Security Features

- **Admin Control:** Only admin can release funds
- **Balance Checks:** Prevents over-distribution
- **Application Limits:** One application per address
- **Donation Validation:** Ensures positive donation amounts

## 💰 Financial Management

- **Total Donations:** Track cumulative donations
- **Current Balance:** Real-time fund balance
- **Fund Distribution:** Controlled release of funds
- **Transaction History:** Complete audit trail

## 📄 License

MIT License 