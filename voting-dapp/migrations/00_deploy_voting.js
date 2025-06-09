const VotingInit = artifacts.require("Voting");
module.exports = function (deployer) {
  deployer.deploy(VotingInit);
};
