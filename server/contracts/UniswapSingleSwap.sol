// SPDX-License-Identifier: GPL-2.0-or-later
pragma solidity 0.8.0;
pragma abicoder v2;

import '@uniswap/v3-periphery/contracts/interfaces/ISwapRouter.sol';
import './OpenZeppelin/IERC20.sol';

contract UniswapSingleSwap {

    address public constant routerAddress = 0xE592427A0AEce92De3Edee1F18E0157C05861564;
    ISwapRouter public immutable swapRouter = ISwapRouter(routerAddress);

    // This contract swaps Token1 (e.g. DAI) for Token2 (some other ERC20)
    address public Token1; //  = 0x6B175474E89094C44Da98b954EedeAC495271d0F;
    IERC20 public Token2; //  = 0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2;
    uint24 poolFee;

    // this is the method called from FlashLoan 
    function swap(address _borrowingToken, uint256 _borrowingAmount, address _swapToken, uint24 _poolFee) external {
        Token1 = _borrowingToken;
        Token2 = IERC20(_swapToken);
        poolFee = _poolFee;

        swapExactInputSingle(_borrowingAmount);
    }

    function swapExactInputSingle(uint256 amountIn) public returns (uint256 amountOut) {

        // Approve the router to spend Token1.
        Token1.approve(address(swapRouter), amountIn);

        // Naively set amountOutMinimum to 0. In production, use an oracle or other data source to choose a safer value for amountOutMinimum.
        // We also set the sqrtPriceLimitx96 to be 0 to ensure we swap our exact input amount.
        // ISwapRouter.ExactInputSingleParams memory params =
        //     ISwapRouter.ExactInputSingleParams({
        //         tokenIn: Token1,
        //         tokenOut: address(Token2),
        //         fee: poolFee,
        //         recipient: address(this),
        //         deadline: block.timestamp,
        //         amountIn: amountIn,
        //         amountOutMinimum: 0,
        //         sqrtPriceLimitX96: 0
        //     });

        // // The call to `exactInputSingle` executes the swap.
        // amountOut = swapRouter.exactInputSingle(params);
    }
}