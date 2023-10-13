// SPDX-License-Identifier: MIT
pragma solidity 0.8.0;

import "./OpenZeppelin/ERC20.sol";

contract DAI is ERC20 {

    constructor() ERC20("DAI", "DAI") {}

    function mint(address to, uint256 amount) public {
        _mint(to, amount);
    }
}