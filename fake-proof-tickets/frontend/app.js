let web3;
let accounts;
let ticketsContract;

// Load Web3
async function loadWeb3() {
    if (window.ethereum) {
        web3 = new Web3(window.ethereum);
        await window.ethereum.enable();
    } else if (window.web3) {
        web3 = new Web3(window.web3.currentProvider);
    } else {
        console.log('Non-Ethereum browser detected. You should consider trying MetaMask!');
    }
}

// Load Blockchain Data
async function loadBlockchainData() {
    await loadWeb3();
    accounts = await web3.eth.getAccounts();

    const networkId = await web3.eth.net.getId();
    const TicketsAbi = [
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "uint256",
                "name": "id",
                "type": "uint256"
            },
            {
                "indexed": false,
                "internalType": "string",
                "name": "eventName",
                "type": "string"
            },
            {
                "indexed": true,
                "internalType": "address",
                "name": "owner",
                "type": "address"
            }
        ],
        "name": "TicketIssued",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "uint256",
                "name": "id",
                "type": "uint256"
            },
            {
                "indexed": true,
                "internalType": "address",
                "name": "from",
                "type": "address"
            },
            {
                "indexed": true,
                "internalType": "address",
                "name": "to",
                "type": "address"
            }
        ],
        "name": "TicketTransferred",
        "type": "event"
    },
    {
        "inputs": [],
        "name": "nextTicketId",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "name": "tickets",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "id",
                "type": "uint256"
            },
            {
                "internalType": "string",
                "name": "eventName",
                "type": "string"
            },
            {
                "internalType": "address",
                "name": "owner",
                "type": "address"
            },
            {
                "internalType": "bool",
                "name": "isValid",
                "type": "bool"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "string",
                "name": "_eventName",
                "type": "string"
            }
        ],
        "name": "issueTicket",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "_ticketId",
                "type": "uint256"
            },
            {
                "internalType": "address",
                "name": "_to",
                "type": "address"
            }
        ],
        "name": "transferTicket",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "_ticketId",
                "type": "uint256"
            }
        ],
        "name": "verifyTicket",
        "outputs": [
            {
                "internalType": "bool",
                "name": "",
                "type": "bool"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "_ticketId",
                "type": "uint256"
            }
        ],
        "name": "invalidateTicket",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    }
];

    // Replace with the deployed address of your contract
    // You'll get this after running 'truffle migrate'
    const deployedNetwork = 'YOUR_DEPLOYED_CONTRACT_ADDRESS'; // You'll need to fill this in after deploying

    if (deployedNetwork) {
        ticketsContract = new web3.eth.Contract(TicketsAbi, deployedNetwork);
    } else {
        console.error('Tickets contract not deployed to detected network.');
    }

    setupEventListeners();
}

// Event Listeners
function setupEventListeners() {
    document.getElementById('issueTicketBtn').addEventListener('click', issueTicket);
    document.getElementById('transferTicketBtn').addEventListener('click', transferTicket);
    document.getElementById('verifyTicketBtn').addEventListener('click', verifyTicket);
    document.getElementById('invalidateTicketBtn').addEventListener('click', invalidateTicket);
}

// Issue Ticket
async function issueTicket() {
    const eventName = document.getElementById('issueEventName').value;
    if (!ticketsContract) {
        document.getElementById('issueTicketResult').innerText = 'Error: Contract not loaded. Please ensure it\'s deployed.';
        return;
    }
    try {
        const result = await ticketsContract.methods.issueTicket(eventName).send({ from: accounts[0] });
        document.getElementById('issueTicketResult').innerText = `Ticket Issued! ID: ${result.events.TicketIssued.returnValues.id}`;
    } catch (error) {
        console.error(error);
        document.getElementById('issueTicketResult').innerText = `Error issuing ticket: ${error.message}`;
    }
}

// Transfer Ticket
async function transferTicket() {
    const ticketId = document.getElementById('transferTicketId').value;
    const toAddress = document.getElementById('transferToAddress').value;
    if (!ticketsContract) {
        document.getElementById('transferTicketResult').innerText = 'Error: Contract not loaded. Please ensure it\'s deployed.';
        return;
    }
    try {
        await ticketsContract.methods.transferTicket(ticketId, toAddress).send({ from: accounts[0] });
        document.getElementById('transferTicketResult').innerText = `Ticket ${ticketId} transferred to ${toAddress}`;
    } catch (error) {
        console.error(error);
        document.getElementById('transferTicketResult').innerText = `Error transferring ticket: ${error.message}`;
    }
}

// Verify Ticket
async function verifyTicket() {
    const ticketId = document.getElementById('verifyTicketId').value;
    if (!ticketsContract) {
        document.getElementById('verifyTicketResult').innerText = 'Error: Contract not loaded. Please ensure it\'s deployed.';
        return;
    }
    try {
        const isValid = await ticketsContract.methods.verifyTicket(ticketId).call();
        document.getElementById('verifyTicketResult').innerText = `Ticket ${ticketId} is valid: ${isValid}`;
    } catch (error) {
        console.error(error);
        document.getElementById('verifyTicketResult').innerText = `Error verifying ticket: ${error.message}`;
    }
}

// Invalidate Ticket
async function invalidateTicket() {
    const ticketId = document.getElementById('invalidateTicketId').value;
    if (!ticketsContract) {
        document.getElementById('invalidateTicketResult').innerText = 'Error: Contract not loaded. Please ensure it\'s deployed.';
        return;
    }
    try {
        await ticketsContract.methods.invalidateTicket(ticketId).send({ from: accounts[0] });
        document.getElementById('invalidateTicketResult').innerText = `Ticket ${ticketId} invalidated.`;
    } catch (error) {
        console.error(error);
        document.getElementById('invalidateTicketResult').innerText = `Error invalidating ticket: ${error.message}`;
    }
}

// Load data when the page loads
window.addEventListener('load', loadBlockchainData);