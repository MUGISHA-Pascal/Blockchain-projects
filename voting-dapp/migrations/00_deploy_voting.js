const VotingInit = artifacts.require("voting");
module.exports = function (deployer) {
  deployer.deploy(VotingInit);
};
