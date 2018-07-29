var Migrations = artifacts.require("./Migrations.sol");
var FoodToken = artifacts.require("./FoodToken.sol");

module.exports = function(deployer, network, accounts) {
  deployer.deploy(Migrations);
  deployer.deploy(FoodToken, accounts[0]);
};
