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

  function transfer(address _to, uint256 _value) public returns (bool success) {
      require(balances[msg.sender] >= _value);
      require(_to != address(0));

      balances[msg.sender] -= _value;
      balances[_to] += _value;
      emit Transfer(msg.sender, _to, _value);
      return true;
  }

  function balanceOf (address _owner) public view returns (uint256 balance) {
    return balances[_owner];
  }
}
