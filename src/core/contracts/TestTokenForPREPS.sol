pragma solidity 0.4.24;

contract TestTokenForPREPS {
    /* This creates an array with all balances */
    mapping (address => uint256) public balanceOf;
    address[] public users;
    /* Initializes contract with initial supply tokens to the creator of the contract */
    constructor(
        uint256 initialSupply
    ) public {
        balanceOf[msg.sender] = initialSupply;              // Give the creator all initial tokens
        users.push(msg.sender);
    }

    /* Send coins */
    function transfer(address _to, uint256 _value) public returns (bool success) {
        require(balanceOf[msg.sender] >= _value);           // Check if the sender has enough
        require(balanceOf[_to] + _value >= balanceOf[_to]); // Check for overflows
        balanceOf[msg.sender] -= _value;                    // Subtract from the sender
        balanceOf[_to] += _value;                           // Add the same to the recipient
        if(isUser(_to)==false){
            users.push(_to);
        }
        return true;
    }

    function isUser(address _user) private returns(bool){
        for(uint i=0; i<users.length;i++){
            if(_user==users[i]) return true;
        }
        return false;
    }

}
