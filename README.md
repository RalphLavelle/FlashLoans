Tradie (FlashLoan trading app)
==============================

## Server-side
1. Start the blockchain
> cd server
> npm run hhup  
> npm run hhdep  

2. Start the Node app
> node tradie

Mske sure to copy the MockERC20 and FlashLoan addresses to the .env config file(s).

## Client-side
1. Start the Angular app
> npm run start

Check balance, mint DAI, etc.
> npx hardhat mintDAI --network localhost

Request a flash loan!
> npx hardhat request --network localhost

Test a swap on Mumbai (for example)
> npx hardhat swap --network mumbai

## Local env
Locally, I use a fake ERC20 coin to stand in for $DAI (no $USDC yet). Also, in the local version, the call in FlashLoan to POOL is commented out. 

## Deployment strategy
For phase 1, there will be no need to deploy the front end to a prod environment. Maybe there never will be. I'm the only one using it, and I don't need it online. The things that needs to change are:

* the environment tag ('local', 'staging', 'prod')
* blockchain address
* address of the lending pool
* address(es) of the borrowing coin(s), i.e. $DAI, $USDC
* addresses of the app's contract(s)
* the private key

Also, I will restrict things initially to two exchanges: Uniswap and SushiSwap. Everything will boil down to the arbitrage opp. between the prices of a particular coin on those two dexes. 

## Loan providers
1. Aave
Docs: https://docs.aave.com/developers/guides/flash-loans, 
Addresses:  
    Testnet: https://docs.aave.com/developers/deployed-contracts/v3-testnet-addresses
    Polygon mainnet: https://docs.aave.com/developers/deployed-contracts/v3-mainnet/polygon

Be careful that there are some tokens that may seem to be DAI or LINK, etc., but are in fact an Aave-wrapped version.

## Dexes
1. Uniswap
Since the Uniswap router has the same address for all chains, testnets and main, I'm hardcoding the address into the UniswapSingleSwap contract. So, one less thing to worry about for testnet/mainnet config.
2. SushiSwap
3. Balancer
4. PancakeSwap