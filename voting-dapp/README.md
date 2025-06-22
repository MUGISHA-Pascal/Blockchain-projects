# Voting dApp

A decentralized voting system built on Ethereum blockchain that enables transparent and immutable voting for candidates.

## 🎯 Overview

This dApp demonstrates blockchain-based voting with:
- One vote per Ethereum address
- Pre-defined candidate list
- Transparent vote counting
- Immutable voting records

## 🏗️ Smart Contract

The `Voting.sol` contract provides:

### Data Structures
```solidity
struct Candidate {
    uint id;
    string name;
    uint voteCount;
}
```

### Functions
- **`vote(uint _candidateId)`**: Cast a vote for a candidate
- **`addCandidate(string memory _name)`**: Add a new candidate (private)

### Events
- `votedEvent`: Emitted when a vote is cast

### Pre-defined Candidates
- Rama
- Nick
- Jose

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

1. **View Candidates:** See the list of available candidates
2. **Cast Vote:** Select a candidate and click "Vote"
3. **View Results:** See real-time vote counts for each candidate
4. **Transaction Confirmation:** Confirm your vote in MetaMask

## 🧪 Testing

```bash
truffle test
```

## 📁 Structure

```
voting-dapp/
├── contracts/Voting.sol       # Main voting contract
├── migrations/                # Deployment scripts
├── test/                      # Test files
├── frontend/                  # Web interface
└── truffle-config.js          # Configuration
```

## 🔍 Key Features

- **One Vote Per Address:** Prevents double voting
- **Transparent Results:** Real-time vote counting
- **Immutable Records:** All votes are permanently recorded
- **Event Logging:** Vote events for transparency

## 🔒 Security Features

- **Vote Validation:** Ensures valid candidate IDs
- **Duplicate Prevention:** Prevents multiple votes from same address
- **Access Control:** Only registered voters can participate

## 📄 License

MIT License 