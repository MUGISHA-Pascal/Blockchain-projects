const ScholarshipFund = artifacts.require("Scholarship");
module.exports = function (deployer) {
  deployer.deploy(ScholarshipFund);
};
