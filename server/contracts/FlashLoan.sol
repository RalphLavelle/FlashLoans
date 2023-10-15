// SPDX-License-Identifier: MIT
pragma solidity 0.8.0;

import { IPoolAddressesProvider } from "./Aave/IPoolAddressesProvider.sol";
import './UniswapSingleSwap.sol';
import './OpenZeppelin/IERC20.sol';
import './Aave/FlashLoanSimpleReceiverBase.sol';

contract FlashLoan is FlashLoanSimpleReceiverBase {
    
    address payable owner;

    UniswapSingleSwap uniswap;

    event LoanRequested(address borrowingToken, uint256 borrowingAmount, address swapToken, uint24 poolFee);

    // arbitrage tokens, amount, and fee
    address borrowingToken;
    uint256 borrowingAmount;
    address swapToken;
    uint24 poolFee;

    constructor(address _addressProvider)
        FlashLoanSimpleReceiverBase(IPoolAddressesProvider(_addressProvider))
    {
        owner = payable(msg.sender);
        uniswap = new UniswapSingleSwap();
    }

    // this is only to test the Uniswap part 
    function testingUniswap(address _borrowingToken, uint256 _borrowingAmount, address _swapToken, uint24 _poolFee) external {
        uniswap.swap(_borrowingToken, _borrowingAmount, _swapToken, _poolFee);
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

        // Buy swapTokens on Uniswap, using borrowingTokens
        uniswap.swap(borrowingToken, borrowingAmount, swapToken, poolFee);

        // Sell swapTokens on SushiSwap, getting borrowingTokens
        // TODO

        // Finally, approve the Pool contract allowance to *pull* the owed amount of borrowingToken
        uint256 amountOwed = amount + premium;
        IERC20(asset).approve(address(POOL), amountOwed);
    }

    function requestFlashLoan(address _borrowingToken, uint256 _borrowingAmount, address _swapToken, uint24 _poolFee) external {

        borrowingToken = _borrowingToken;
        borrowingAmount = _borrowingAmount;
        swapToken = _swapToken;
        poolFee = _poolFee; 

        address receiverAddress = address(this);
        address asset = borrowingToken;
        uint256 amount = borrowingAmount;
        bytes memory params = "";
        uint16 referralCode = 0;

        /** uncomment this for staging and prod
            POOL.flashLoanSimple(
                receiverAddress,
                asset,
                amount,
                params,
                referralCode
            );
        */

        emit LoanRequested(_borrowingToken, _borrowingAmount, _swapToken, _poolFee);
    }

    function getBalance(address _tokenAddress) external view returns (uint256) {
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
