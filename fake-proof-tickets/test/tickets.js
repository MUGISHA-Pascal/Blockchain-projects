const Tickets = artifacts.require("Tickets");

contract("Tickets", (accounts) => {
  it("should issue a new ticket", async () => {
    const ticketsInstance = await Tickets.deployed();
    const eventName = "Concert A";
    const ticketId = await ticketsInstance.issueTicket(eventName, { from: accounts[0] });
    const ticket = await ticketsInstance.tickets(ticketId.logs[0].args.id);

    assert.equal(ticket.eventName, eventName, "The event name should be 'Concert A'");
    assert.equal(ticket.owner, accounts[0], "The owner should be the issuer");
    assert.equal(ticket.isValid, true, "The ticket should be valid");
  });

  it("should transfer a ticket", async () => {
    const ticketsInstance = await Tickets.deployed();
    const eventName = "Concert B";
    const ticketId = await ticketsInstance.issueTicket(eventName, { from: accounts[0] });
    const originalTicketId = ticketId.logs[0].args.id;

    await ticketsInstance.transferTicket(originalTicketId, accounts[1], { from: accounts[0] });
    const ticket = await ticketsInstance.tickets(originalTicketId);

    assert.equal(ticket.owner, accounts[1], "The owner should be accounts[1] after transfer");
  });

  it("should verify a ticket", async () => {
    const ticketsInstance = await Tickets.deployed();
    const eventName = "Concert C";
    const ticketId = await ticketsInstance.issueTicket(eventName, { from: accounts[0] });
    const originalTicketId = ticketId.logs[0].args.id;

    const isValid = await ticketsInstance.verifyTicket(originalTicketId);
    assert.equal(isValid, true, "The ticket should be valid");
  });

  it("should invalidate a ticket", async () => {
    const ticketsInstance = await Tickets.deployed();
    const eventName = "Concert D";
    const ticketId = await ticketsInstance.issueTicket(eventName, { from: accounts[0] });
    const originalTicketId = ticketId.logs[0].args.id;

    await ticketsInstance.invalidateTicket(originalTicketId, { from: accounts[0] });
    const ticket = await ticketsInstance.tickets(originalTicketId);
    assert.equal(ticket.isValid, false, "The ticket should be invalid");
  });
}); 