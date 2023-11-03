// SPDX-License-Identifier: MIT
pragma solidity >=0.5.0;

import 'https://github.com/Uniswap/v2-periphery/blob/master/contracts/interfaces/IUniswapV2Router02.sol';
import 'https://github.com/Uniswap/v2-core/blob/master/contracts/interfaces/IERC20.sol';
import 'https://github.com/Uniswap/v2-core/blob/master/contracts/interfaces/IUniswapV2Factory.sol';
import 'https://github.com/Uniswap/v2-core/blob/master/contracts/interfaces/IUniswapV2Pair.sol';

contract Swap {
    
    address payable owner;

    address public constant routerAddress = 0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D; // Uniswap router 
    address public constant factoryAddress = 0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f; // Uniswap factory

    // events
    event TokensBought(uint256 amount, address router);
    event TokensSold(uint256 amount, address router);

    // arbitrage tokens, amount, and fee
    //IERC20 public tokenIn;
    //IERC20 public tokenOut;
	//uint256 public amount;
    uint256 public boughtAmount;

    constructor() {
        owner = payable(msg.sender);
    }

    function trade(address _tokenIn, address _tokenOut, uint256 _amount) external {
        // approve them for the router
        IERC20(_tokenIn).approve(routerAddress, _amount);
        // Buy tokens
        swap(_tokenIn, _tokenOut, _amount, routerAddress);
        // Tokens have been bought
        emit TokensBought(boughtAmount, routerAddress);
    }

    function swap(address _tokenIn, address _tokenOut, uint256 _amount, address _routerAddress) private {

        address pairAddress = IUniswapV2Factory(factoryAddress).getPair(_tokenIn, _tokenOut);
        require(pairAddress != address(0), "This pair does not exist");

        // Define the path for the swap
        address[] memory path = new address[](2);
        path[0] = 0x52D800ca262522580CeBAD275395ca6e7598C014; // _tokenIn;
        path[1] = 0xc8c0Cf9436F4862a8F60Ce680Ca5a9f0f99b5ded; // _tokenOut;

        IUniswapV2Router02 swapRouter = IUniswapV2Router02(_routerAddress);

        IERC20(_tokenIn).approve(_routerAddress, _amount);

        uint256[] memory amountsOut = swapRouter.swapExactTokensForTokens(
            _amount,
            1000,
            path,
            address(this),
            block.timestamp + 3600
        );
        boughtAmount = amountsOut[0];
    }

	function getBalance(address _tokenAddress) external view returns (uint) {
        IERC20 token = IERC20(_tokenAddress);
        return token.balanceOf(address(this));
    }

    receive() external payable {}
}
