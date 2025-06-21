// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract NameStorage {
    mapping(address => string) private names;

    // Set the name for the sender's address
    function setName(string calldata _name) external {
        names[msg.sender] = _name;
    }

    // Get the name associated with an address
    function getName(address _user) external view returns (string memory) {
        return names[_user];
    }

    // Get the name for the sender's address
    function getMyName() external view returns (string memory) {
        return names[msg.sender];
    }
}
