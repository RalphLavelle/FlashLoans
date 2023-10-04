# FlashLoans

Because this relies so much on the interaction between differetn contracts, I am skipping the local dev part of this, and going straight to (Mumbai) testnet. Deploy using Remix.

## Aave v3 Flash Loan documentation:
https://docs.aave.com/developers/guides/flash-loans
https://docs.aave.com/developers/deployed-contracts/v3-testnet-addresses

## Remix imports:
import {FlashLoanReceiverBase} from "https://github.com/aave/protocol-v2/blob/master/contracts/flashloan/base/FlashLoanReceiverBase.sol";
import {ILendingPool} from "https://github.com/aave/protocol-v2/blob/master/contracts/interfaces/ILendingPool.sol";
import {ILendingPoolAddressesProvider} from "https://github.com/aave/protocol-v2/blob/master/contracts/interfaces/ILendingPoolAddressesProvider.sol";
import {IERC20} from "https://github.com/aave/protocol-v2/blob/master/contracts/dependencies/openzeppelin/contracts/IERC20.sol";

Pool Address Provider, on Mumbai: 0x4CeDCB57Af02293231BAA9D39354D6BFDFD251e0

Mumbai ERC20 addresses 
$DAI: 0xc8c0Cf9436F4862a8F60Ce680Ca5a9f0f99b5ded
$USDC: 0x52D800ca262522580CeBAD275395ca6e7598C014

FlashLoan on Mumbai
0xFbbE12578d0c269368C36157203DA43534Bd328C

https://mumbai.polygonscan.com/