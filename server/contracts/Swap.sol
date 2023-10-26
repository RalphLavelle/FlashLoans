// SPDX-License-Identifier: MIT
pragma solidity 0.8.0;

interface IERC20 {
    event Transfer(address indexed from, address indexed to, uint256 value);
    event Approval(address indexed owner, address indexed spender, uint256 value);
    function balanceOf(address account) external view returns (uint256);
    function transfer(address to, uint256 amount) external returns (bool);
    function approve(address spender, uint256 amount) external returns (bool);
}

import '@uniswap/v3-periphery/contracts/interfaces/ISwapRouter.sol';

contract Swap {
    
    address payable owner;

    address public constant buyAddress = 0xE592427A0AEce92De3Edee1F18E0157C05861564; // Uniswap
    // address public constant sellAddress = 0x1b02dA8Cb0d097eB8D57A175b88c7D8b47997506; // Sushiswap

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

    /**
        This function is called after your contract has received the flash loaned amount
     */
    function trade(address _tokenIn, uint256 _amount, address _tokenOut) external {
		tokenIn = IERC20(_tokenIn);
        amount = _amount;
        tokenOut = IERC20(_tokenOut);

        // Buy tokens
        uint256 boughtAmount = swap(buyAddress);

        // Tokens have been bought
        emit TokensBought(boughtAmount, buyAddress);

        // Sell tokens
        //uint256 soldAmount = swap(sellAddress, buyingToken, borrowingToken);

        // Tokens have been sold
       // emit TokensSold(soldAmount, sellAddress);
    }

    function swap(address routerAddress) private returns (uint256) {

        ISwapRouter swapRouter = ISwapRouter(routerAddress);

        tokenIn.approve(address(swapRouter), amount);

        ISwapRouter.ExactInputSingleParams memory params =
            ISwapRouter.ExactInputSingleParams({
                tokenIn: address(tokenIn),
                tokenOut: address(tokenOut),
                fee: poolFee,
                recipient: address(this),
                deadline: block.timestamp,
                amountIn: amount,
                amountOutMinimum: 0,
                sqrtPriceLimitX96: 0
            });

        return swapRouter.exactInputSingle(params);
    }

	function getBalance(address _tokenAddress) external view returns (uint256) {
        return IERC20(_tokenAddress).balanceOf(address(this));
    }

    receive() external payable {}
}
