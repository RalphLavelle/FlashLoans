// SPDX-License-Identifier: MIT
pragma solidity 0.8.0;

interface IERC20 {
    event Transfer(address indexed from, address indexed to, uint256 value);
    event Approval(address indexed owner, address indexed spender, uint256 value);
    function balanceOf(address account) external view returns (uint256);
    function transfer(address to, uint256 amount) external returns (bool);
    function approve(address spender, uint256 amount) external returns (bool);
}

import { IPoolAddressesProvider } from "./Aave/IPoolAddressesProvider.sol";
import '@uniswap/v2-periphery/contracts/interfaces/IUniswapV2Router02.sol';
import './Aave/FlashLoanSimpleReceiverBase.sol';

contract FlashLoan is FlashLoanSimpleReceiverBase {
    
    address payable owner;

    address public constant buyAddress = 0xE592427A0AEce92De3Edee1F18E0157C05861564; // Uniswap
    address public constant sellAddress = 0x1b02dA8Cb0d097eB8D57A175b88c7D8b47997506; // Sushiswap

    // events
    event LoanRequested(address borrowingToken, uint256 borrowingAmount, address buyingToken, uint24 poolFee);
    event LoanReceived(uint256 amount, uint256 amountOwed);
    event TokensBought(uint256 amount, address router);
    event TokensSold(uint256 amount, address router);

    // arbitrage tokens, amount, and fee
    IERC20 public borrowingToken;
    uint256 borrowingAmount;
    IERC20 public buyingToken;
    uint24 poolFee;

    constructor(address _addressProvider)
        FlashLoanSimpleReceiverBase(IPoolAddressesProvider(_addressProvider))
    {
        owner = payable(msg.sender);
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
        emit LoanReceived(amount, amountOwed);

        // Buy tokens
        uint256 boughtAmount = swap(buyAddress, borrowingToken, buyingToken);

        // Tokens have been bought
        emit TokensBought(boughtAmount, buyAddress);

        // Sell tokens
        uint256 soldAmount = swap(sellAddress, buyingToken, borrowingToken);

        // Tokens have been sold
        emit TokensSold(soldAmount, sellAddress);

        // if we don't have enough to pay back the loan, revert
        uint256 balance = getBalance(address(borrowingToken));
        if (balance < amountOwed) {
            revert("Insufficient balance to repay the loan");
        }

        // Finally, approve the Pool contract allowance to *pull* the owed amount of borrowingToken
        IERC20(asset).approve(address(POOL), amountOwed);

        return true;
    }

    function requestFlashLoan(address _borrowingToken, uint256 _borrowingAmount, address _buyingToken, uint24 _poolFee) external onlyOwner {

        borrowingToken = IERC20(_borrowingToken);
        borrowingAmount = _borrowingAmount;
        buyingToken = IERC20(_buyingToken);
        poolFee = _poolFee; 

        address receiverAddress = address(this);
        address asset = address(borrowingToken);
        uint256 amount = borrowingAmount;
        bytes memory params = "";
        uint16 referralCode = 0;

        POOL.flashLoanSimple(
            receiverAddress,
            asset,
            amount,
            params,
            referralCode
        );

        emit LoanRequested(address(borrowingToken), borrowingAmount, address(buyingToken), poolFee);
    }

    function swap(address routerAddress, IERC20 tokenIn, IERC20 tokenOut) private returns (uint256) {

        ISwapRouter swapRouter = ISwapRouter(routerAddress);

        borrowingToken.approve(address(swapRouter), borrowingAmount);

        ISwapRouter.ExactInputSingleParams memory params =
            ISwapRouter.ExactInputSingleParams({
                tokenIn: address(tokenIn),
                tokenOut: address(tokenOut),
                fee: poolFee,
                recipient: address(this),
                deadline: block.timestamp,
                amountIn: borrowingAmount,
                amountOutMinimum: 0,
                sqrtPriceLimitX96: 0
            });

        return swapRouter.exactInputSingle(params);
    }

    function getBalance(address _tokenAddress) public view returns (uint256) {
        return IERC20(_tokenAddress).balanceOf(address(this));
    }

    function withdraw(address _tokenAddress) external onlyOwner {
        IERC20 token = IERC20(_tokenAddress);
        token.transfer(msg.sender, token.balanceOf(address(this)));
    }

    modifier onlyOwner() {
        require(
            msg.sender == owner,
            "Only the contract owner can call this function"
        );
        _;
    }

    receive() external payable {}
}
