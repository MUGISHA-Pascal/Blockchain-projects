pragma solidity ^0.8.0;

contract Tickets {
    struct Ticket {
        uint256 id;
        string eventName;
        address owner;
        bool isValid;
    }

    mapping(uint256 => Ticket) public tickets;
    uint256 public nextTicketId;

    event TicketIssued(uint256 indexed id, string eventName, address indexed owner);
    event TicketTransferred(uint256 indexed id, address indexed from, address indexed to);

    constructor() {
        nextTicketId = 0;
    }

    function issueTicket(string memory _eventName) public returns (uint256) {
        tickets[nextTicketId] = Ticket(nextTicketId, _eventName, msg.sender, true);
        emit TicketIssued(nextTicketId, _eventName, msg.sender);
        nextTicketId++;
        return nextTicketId - 1;
    }

    function transferTicket(uint256 _ticketId, address _to) public {
        require(tickets[_ticketId].isValid, "Ticket is not valid.");
        require(tickets[_ticketId].owner == msg.sender, "Only the ticket owner can transfer.");

        tickets[_ticketId].owner = _to;
        emit TicketTransferred(_ticketId, msg.sender, _to);
    }

    function verifyTicket(uint256 _ticketId) public view returns (bool) {
        return tickets[_ticketId].isValid;
    }

    function invalidateTicket(uint256 _ticketId) public {
        require(tickets[_ticketId].isValid, "Ticket is already invalid.");
        require(tickets[_ticketId].owner == msg.sender, "Only the ticket owner can invalidate a ticket.");
        tickets[_ticketId].isValid = false;
    }
} 