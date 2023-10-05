// SPDX-License-Identifier: MIT
pragma solidity 0.8.10;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";

contract MockERC20 is ERC20, ERC20Burnable, Ownable {

    constructor() ERC20("MockERC20", "MERC") {}

    function mint(address to, uint256 amount) public {
        _mint(to, amount);
    }
}