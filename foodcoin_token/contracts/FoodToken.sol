pragma solidity ^0.4.11;
import "./zeppelin-solidity/contracts/token/ERC20/StandardToken.sol";

contract FoodToken is StandardToken {

  mapping (address => uint256) balances;
  string public name = "FoodToken";
  string public symbol = "FGT";
  uint public decimals = 18;
  uint public INITIAL_SUPPLY = 10000 * (10 ** decimals);
  event Transfer(address indexed from, address indexed to, uint256 value);

  function FoodToken(address _owner) {
    totalSupply_ = INITIAL_SUPPLY;
    balances[_owner] = INITIAL_SUPPLY;
    Transfer(0x0, _owner, INITIAL_SUPPLY);
  }

  function totalSupply() public view returns (uint256) {
    return totalSupply_;
  }

  function transfer(address _from, address _to, uint256 _value) public returns (bool success) {
      require(balances[_from] >= _value);
      require(_to != address(0));

      balances[_from] -= _value;
      balances[_to] += _value;
      emit Transfer(_from, _to, _value);
      return true;
  }

  function balanceOf (address _owner) public view returns (uint256 balance) {
    return balances[_owner];
  }
}


contract Purchase {

  address[4] public purchases;
  address public seller;

  function Purchase(address _seller) {
    seller = _seller;
  }

  function purchase(uint foodId) public returns (uint) {
    require(foodId >= 0 && foodId <= 3);
    FoodToken foodContract = FoodToken(msg.sender);
    if (foodContract.transfer(seller, 1)) {
      purchases[foodId] = msg.sender;
    }
    return foodId;
  }

  function getPurchases() public returns (address[4]) {
    return purchases;
  }
}

/*
contract Purchase {
  address[8] public purchases;

  address owner public;
  address ft public;

  function Purchase(address FoodToken){
    owner = msg.sender
    ft = FoodToken
  }

  function buy(uint foodId) public returns (uint) {
    require(foodId >= 0 && petId <= 3);

    purchases[foodId] = msg.sender;

    return foodId;
  }

  function purchaseItem(uint item) public view returns (address[8]) {
    FoodToken.transfer(owner, 1)
    purchase[item] = False
  }
}
*/
