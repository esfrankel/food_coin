var Migrations = artifacts.require("./Migrations.sol");
var FoodToken = artifacts.require("./FoodToken.sol");
var Purchase = artifacts.require("./FoodToken.sol");

module.exports = function(deployer, network, accounts) {
  deployer.deploy(Migrations);
  deployer.deploy(FoodToken, accounts[0]);
  deployer.deploy(Purchase, accounts[1]);
};
