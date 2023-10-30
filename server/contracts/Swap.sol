// SPDX-License-Identifier: MIT
pragma solidity >=0.5.0;

import '@uniswap/v2-periphery/contracts/interfaces/IUniswapV2Router02.sol';
import '@uniswap/v2-core/contracts/interfaces/IERC20.sol';
import '@uniswap/v2-core/contracts/interfaces/IUniswapV2Factory.sol';
import '@uniswap/v2-core/contracts/interfaces/IUniswapV2Pair.sol';

contract Swap {
    
    address payable owner;

    address public constant buyAddress = 0xE592427A0AEce92De3Edee1F18E0157C05861564; // Uniswap
    address public constant factoryAddress = 0x5757371414417b8C6CAad45bAeF941aBc7d3Ab32;

    // events
    event TokensBought(uint256 amount, address router);
    event TokensSold(uint256 amount, address router);

    // arbitrage tokens, amount, and fee
    IERC20 public tokenIn;
    IERC20 public tokenOut;
	uint256 public amount;

    constructor() {
        owner = payable(msg.sender);
    }

    function trade(address _tokenIn, uint256 _amount, address _tokenOut) external {
		tokenIn = IERC20(_tokenIn);
        amount = _amount;
        tokenOut = IERC20(_tokenOut);

        // Buy tokens
        uint256 boughtAmount = swap(buyAddress);

        // Tokens have been bought
        emit TokensBought(boughtAmount, buyAddress);
    }

    function swap(address routerAddress) private returns (uint256) {

        // address pairAddress = IUniswapV2Factory(factoryAddress).getPair(address(tokenIn), address(tokenOut));
        // require(pairAddress != address(0), "This pair does not exist");



        // Define the path for the swap
        address[] memory path = new address[](2);
        path[0] = address(tokenIn);
        path[1] = address(tokenOut);

        IUniswapV2Router02 swapRouter = IUniswapV2Router02(routerAddress);
        swapRouter.swapExactTokensForTokens(amount, 0, path, address(this), block.timestamp + 3600);
    }

	function getBalance(address _tokenAddress) external view returns (uint256) {
        return IERC20(_tokenAddress).balanceOf(address(this));
    }

    receive() external payable {}
}
