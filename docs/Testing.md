Testing
=======

Just stick with one pair of tokens for testnet, since it's not guaranteed that a pair that exists on mainnet exists as a pool on testnet. I just need one pair to work, some combination of USDC, DAI, and WETH, probably.

# Mumbai
Deploy using Remix.
Aave Pool Address Provider (APP): 0x4CeDCB57Af02293231BAA9D39354D6BFDFD251e0
Latest:
    UniswapSingleSwap: 0xB6eF565BAE9455429eCa94d361D39d686eA080Cf
    FlashLoan: 0xa01e3F3C105D867F7501f0A3DF4E94d2eA2E6732

0x52D800ca262522580CeBAD275395ca6e7598C014, 1000000, 0xc8c0Cf9436F4862a8F60Ce680Ca5a9f0f99b5ded, 3000
This is 1 $DAI, so in order to start anything the contract has to be sent at least that much. Send it 1 $DAI in Metamask.

https://mumbai.polygonscan.com/

# Polygon Mainnet
Deploy using Remix.
Aave Pool Address Provider (APP): 0x4CeDCB57Af02293231BAA9D39354D6BFDFD251e0

Borrowing 1 USDC to swap GHST
0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174, 1000000, 0x385Eeac5cB85A38A9a07A70c73e0a3271CfB54A7, 3000

## Swap contract
The actual swap (Uniswap & Sushi) is causing problems without letting me know exactly what's happening. Steps to work with the contract:

1. Deploy in Remix
2. Check balance in USDC - should be 0. Check DAI: also 0.
3. Using Metamask, send 8 USDC to the contract.
4. Check USDC balance - should say 8000000.
4. Swap USDC for DAI...

USDC to DAI
0x52D800ca262522580CeBAD275395ca6e7598C014, 0xc8c0Cf9436F4862a8F60Ce680Ca5a9f0f99b5ded, 2000000000000000000

Latest on Polygon
0x37e471c6bbb0c31D7b62B40Ad2643DeFF9a71F66