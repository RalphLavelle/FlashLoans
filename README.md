# FlashLoans

## Start the blockchain
> npm run hhup  
> npm run hhdep

## Start the app
> npm run start

Check balance, mint ERC20, etc.
> npx hardhat mintERC20 --network localhost

## Mumbai
Deploy using Remix.
FlashLoan address: 0xFbbE12578d0c269368C36157203DA43534Bd328C

Mumbai ERC20 addresses 
$DAI: 0xc8c0Cf9436F4862a8F60Ce680Ca5a9f0f99b5ded
$USDC: 0x52D800ca262522580CeBAD275395ca6e7598C014

https://mumbai.polygonscan.com/

Aave pool Address Provider, on Mumbai: 0x4CeDCB57Af02293231BAA9D39354D6BFDFD251e0

## Remix imports:
import {FlashLoanReceiverBase} from "https://github.com/aave/protocol-v2/blob/master/contracts/flashloan/base/FlashLoanReceiverBase.sol";
import {ILendingPool} from "https://github.com/aave/protocol-v2/blob/master/contracts/interfaces/ILendingPool.sol";
import {ILendingPoolAddressesProvider} from "https://github.com/aave/protocol-v2/blob/master/contracts/interfaces/ILendingPoolAddressesProvider.sol";
import {IERC20} from "https://github.com/aave/protocol-v2/blob/master/contracts/dependencies/openzeppelin/contracts/IERC20.sol";

## Documentation:
https://docs.aave.com/developers/guides/flash-loans
https://docs.aave.com/developers/deployed-contracts/v3-testnet-addresses