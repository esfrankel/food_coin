/*pragma solidity ^0.4.17;

import "./zeppelin-solidity/contracts/token/ERC20/StandardToken.sol";
import "./FoodToken";

contract Purchase {
  address[8] public purchases;


  address owner public;

  function Purchase(address FoodToken){
    owner = msg.sender
  }

  function buy(uint foodId) public returns (uint) {
    require(foodId >= 0 && petId <= 7);

    purchases[foodId] = msg.sender;

    return foodId;
  }

  function purchaseItem(uint item) public view returns (address[8]) {
    FoodToken.transfer(owner, 1)
    purchase[item] = False
  }
}*/
