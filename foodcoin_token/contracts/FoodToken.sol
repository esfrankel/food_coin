pragma solidity ^0.4.11;
import "./Token.sol";

contract FoodToken is Token {
    function () {
        throw;
    }

    string public name;
    uint8 public decimals;
    string public symbol;

    function FoodToken() {
        balances[msg.sender] = 1000;
        totalSupply = 1000;
        name = "FoodCoin";
        decimals = 0;
        symbol = "FCT";
    }

    function approveAndCall(address _spender, uint256 _value, bytes _extraData) returns (bool success) {
        allowed[msg.sender][_spender] = _value;
        Approval(msg.sender, _spender, _value);

        if(!_spender.call(bytes4(bytes32(sha3("receiveApproval(address,uint256,address,bytes)"))), msg.sender, _value, this, _extraData)) { throw; }
        return true;
    }
}