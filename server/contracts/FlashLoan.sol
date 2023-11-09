// SPDX-License-Identifier: MIT
pragma solidity 0.8.10;
pragma abicoder v2;

import { FlashLoanSimpleReceiverBase } from "./Aave/FlashLoanSimpleReceiverBase.sol";
import { IERC20 } from './IERC20.sol';
import { IPoolAddressesProvider } from './Aave/IPoolAddressesProvider.sol';
import { ISwapRouter } from '@uniswap/v3-periphery/contracts/interfaces/ISwapRouter.sol';
import { IUniswapV2Router02 } from '@uniswap/v2-periphery/contracts/interfaces/IUniswapV2Router02.sol';

contract FlashLoan is FlashLoanSimpleReceiverBase {
    
    address payable owner;

    address public constant uniswapRouterAddress = 0xE592427A0AEce92De3Edee1F18E0157C05861564; // Uniswap
    ISwapRouter public immutable uniswapRouter = ISwapRouter(uniswapRouterAddress);
    address public constant sushiswapRouterAddress = 0x1b02dA8Cb0d097eB8D57A175b88c7D8b47997506; // Sushiswap
    IUniswapV2Router02 public immutable sushiswapRouter = IUniswapV2Router02(sushiswapRouterAddress);

    // events
    event LoanRequested(address borrowingToken, uint256 amount, address buyingToken, uint24 poolFee);
    event LoanReceived(uint256 amount, uint256 amountOwed);
    event TokensBought(uint256 amount, address router);
    event TokensSold(uint256 amount, address router);

    // arbitrage tokens, amount, and fee
    IERC20 public tokenIn;
    IERC20 public tokenOut;
    uint24 poolFee;

    constructor(address _addressProvider)
        FlashLoanSimpleReceiverBase(IPoolAddressesProvider(_addressProvider)) {
        owner = payable(msg.sender);
    }

    receive() external payable {}

    modifier onlyOwner() {
        require(msg.sender == owner, "Only the contract owner can call this function");
        _;
    }

    function requestFlashLoan(address _borrowingToken, uint256 _borrowingAmount, address _buyingToken, uint24 _poolFee) external onlyOwner {

        tokenIn = IERC20(_borrowingToken);
        tokenOut = IERC20(_buyingToken);
        poolFee = _poolFee; 

        address receiverAddress = address(this);
        address asset = address(tokenIn);
        uint256 amount = _borrowingAmount;
        bytes memory params = "";
        uint16 referralCode = 0;

        POOL.flashLoanSimple(
            receiverAddress,
            asset,
            amount,
            params,
            referralCode
        );
        emit LoanRequested(address(tokenIn), _borrowingAmount, address(tokenOut), poolFee);
    }

    /**
        This function is called after your contract has received the flash loaned amount
     */
    function executeOperation(
        address asset,
        uint256 amount,
        uint256 premium,
        address initiator,
        bytes calldata params
    ) external override returns (bool) {

        // the loan has been received
        uint256 amountOwed = amount + premium;
        // emit LoanReceived(amount, amountOwed);

        // // Buy tokens
        // uint256 boughtAmount = swapV3(uniswapRouter, tokenIn, tokenOut, amount);

        // // Tokens have been bought
        // emit TokensBought(boughtAmount, address(uniswapRouter));

        // // Sell tokens
        // uint256 soldAmount = swapV2(sushiswapRouter, tokenOut, tokenIn, boughtAmount);

        // // Tokens have been sold
        // emit TokensSold(soldAmount, address(sushiswapRouter));

        // if we don't have enough to pay back the loan, revert
        uint256 balance = getBalance(address(tokenIn));
        if (balance < amountOwed) {
            revert("Insufficient balance to repay the loan");
        }

        // Finally, approve the Pool contract allowance to *pull* the owed amount of borrowingToken
        IERC20(asset).approve(address(POOL), amountOwed);

        return true;
    }

    function swapV2(IUniswapV2Router02 _router, IERC20 _token0, IERC20 _token1, uint256 _amount) private returns (uint256) {
        
        _token0.approve(address(_router), _amount);

        // Define the path for the swap
        address[] memory path = new address[](2);
        path[0] = address(_token0);
        path[1] = address(_token1);
        uint256[] memory amountsOut = _router.swapExactTokensForTokens(
            _amount,
            1000,
            path,
            address(this),
            block.timestamp + 3600
        );
        return amountsOut[0];
    }

    function swapV3(ISwapRouter _router, IERC20 _token0, IERC20 _token1, uint256 _amount) private returns (uint256) {

        _token0.approve(address(_router), _amount);

        ISwapRouter.ExactInputSingleParams memory params =
            ISwapRouter.ExactInputSingleParams({
                tokenIn: address(_token0),
                tokenOut: address(_token1),
                fee: poolFee,
                recipient: address(this),
                deadline: block.timestamp,
                amountIn: _amount,
                amountOutMinimum: 0,
                sqrtPriceLimitX96: 0
            });

        return _router.exactInputSingle(params);
    }

	function getBalance(address _tokenAddress) public view returns (uint256) {
        return IERC20(_tokenAddress).balanceOf(address(this));
    }

    function withdraw(address _tokenAddress) external onlyOwner {
        IERC20 token = IERC20(_tokenAddress);
        token.transfer(msg.sender, token.balanceOf(address(this)));
    }
}