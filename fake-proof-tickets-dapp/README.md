# Fake Proof Tickets dApp

A decentralized ticket management system built on Ethereum blockchain for creating, transferring, and verifying digital tickets.

## 🎯 Overview

This dApp demonstrates blockchain-based ticketing with:
- Digital ticket creation and ownership
- Secure ticket transfers
- Ticket verification system
- Ticket invalidation capabilities

## 🏗️ Smart Contract

The `Tickets.sol` contract provides:

### Functions
- **`issueTicket(string memory _eventName)`**: Creates a new ticket
- **`transferTicket(uint256 _ticketId, address _to)`**: Transfers ticket ownership
- **`verifyTicket(uint256 _ticketId)`**: Verifies ticket validity
- **`invalidateTicket(uint256 _ticketId)`**: Invalidates a ticket

### Events
- `TicketIssued`: When a new ticket is created
- `TicketTransferred`: When a ticket is transferred

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

1. **Create Ticket:** Enter event name and click "Issue Ticket"
2. **Transfer Ticket:** Enter ticket ID and recipient address
3. **Verify Ticket:** Enter ticket ID to check validity
4. **Invalidate Ticket:** Owner can invalidate their ticket

## 🧪 Testing

```bash
truffle test
```

## 📁 Structure

```
fake-proof-tickets-dapp/
├── contracts/Tickets.sol     # Main contract
├── migrations/               # Deployment scripts
├── test/                     # Test files
├── frontend/                 # Web interface
└── truffle-config.js         # Configuration
```

## 🔍 Key Features

- **Ownership Management:** Secure ticket ownership tracking
- **Transfer System:** Safe ticket transfers between addresses
- **Verification:** On-chain ticket validation
- **Event Logging:** Transparent operation history

## 📄 License

MIT License 