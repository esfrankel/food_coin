pragma solidity ^0.4.11;

contract Purchase {

  address[4] public purchases;
  address public seller;

  function Purchase(address _seller) {
    seller = _seller;
  }

  function purchase(uint foodId) public payable returns (uint) {
    require(foodId >= 0 && foodId <= 3);
    purchases[foodId] = msg.sender;
    return foodId;
  }

  function getPurchases() public returns (address[4]) {
    return purchases;
  }
}
