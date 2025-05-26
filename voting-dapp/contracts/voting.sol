// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
contract voting{
    struct Candidate{
        uint id;
        string name;
        uint voteCount;
    }
    mapping (uint => Candidate) public candidates;
    mapping (address => bool) public voters;
    uint public candidatesCount;
    event voteEvent(uint indexed candidateId);
}