// SPDX-License-Identifier: MIT
pragma solidity 0.8.0;
pragma abicoder v2;

interface IERC20 {
    event Transfer(address indexed from, address indexed to, uint256 value);
    event Approval(address indexed owner, address indexed spender, uint256 value);
    function balanceOf(address account) external view returns (uint256);
    function transfer(address to, uint256 amount) external returns (bool);
    function approve(address spender, uint256 amount) external returns (bool);
}

// import { ISwapRouter } from 'https://github.com/Uniswap/v3-periphery/blob/master/contracts/interfaces/ISwapRouter.sol';
// import { IUniswapV2Router02 } from 'https://github.com/Uniswap/v2-periphery/blob/master/contracts/interfaces/IUniswapV2Router02.sol';
import { ISwapRouter } from '@uniswap/v3-periphery/blob/master/contracts/interfaces/ISwapRouter.sol';
import { IUniswapV2Router02 } from '@uniswap/v2-periphery/blob/master/contracts/interfaces/IUniswapV2Router02.sol';

contract Swap {
    
    address payable owner;

    address public constant uniswapRouterAddress = 0xE592427A0AEce92De3Edee1F18E0157C05861564; // Uniswap
    ISwapRouter public immutable uniswapRouter = ISwapRouter(uniswapRouterAddress);
    address public constant sushiswapRouterAddress = 0x1b02dA8Cb0d097eB8D57A175b88c7D8b47997506; // Sushiswap
    IUniswapV2Router02 public immutable sushiswapRouter = IUniswapV2Router02(sushiswapRouterAddress);
    

    // events
    event TokensBought(uint256 amount, address router);
    event TokensSold(uint256 amount, address router);

    // arbitrage tokens, amount, and fee
    IERC20 public tokenIn;
    IERC20 public tokenOut;
	uint256 public amount;
    uint24 poolFee = 3000;

    constructor() {
        owner = payable(msg.sender);
    }

    receive() external payable {}

    /**
        This function is called after your contract has received the flash loaned amount
     */
    function trade(address _tokenIn, uint256 _amount, address _tokenOut) external {
		tokenIn = IERC20(_tokenIn);
        amount = _amount;
        tokenOut = IERC20(_tokenOut);

        // Buy tokens
        uint256 boughtAmount = swapV3(uniswapRouter, tokenIn, tokenOut);

        // Tokens have been bought
        emit TokensBought(boughtAmount, address(uniswapRouter));

        // Sell tokens
        // uint256 soldAmount = swapV2(sushiswapRouter, tokenOut, tokenIn);

        // Tokens have been sold
        // emit TokensSold(soldAmount, address(sushiswapRouter));
    }

    function swapV2(IUniswapV2Router02 _router, IERC20 _token0, IERC20 _token1) private returns (uint256) {
        
        tokenOut.approve(address(_router), amount);

        // Define the path for the swap
        address[] memory path = new address[](2);
        path[0] = address(_token0);
        path[1] = address(_token1);
        uint256[] memory amountsOut = _router.swapExactTokensForTokens(
            amount,
            1000,
            path,
            address(this),
            block.timestamp + 3600
        );
        return amountsOut[0];
    }

    function swapV3(ISwapRouter _router, IERC20 _token0, IERC20 _token1) private returns (uint256) {

        // uint256 maxAllowance = type(uint256).max;
        _token0.approve(address(_router), amount);

        ISwapRouter.ExactInputSingleParams memory params =
            ISwapRouter.ExactInputSingleParams({
                tokenIn: address(_token0),
                tokenOut: address(_token1),
                fee: poolFee,
                recipient: address(this),
                deadline: block.timestamp,
                amountIn: amount,
                amountOutMinimum: 0,
                sqrtPriceLimitX96: 0
            });

        return _router.exactInputSingle(params);
    }

	function getBalance(address _tokenAddress) external view returns (uint256) {
        return IERC20(_tokenAddress).balanceOf(address(this));
    }
}