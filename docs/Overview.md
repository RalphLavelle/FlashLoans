FlashLoan

1. Make sure the contract has enough USDC, or whatever stablecoin it's using to pay the 0.05% loan fee, at least until I work out how to get it all working. That way it doesn't revert, and I can see the dex swaps are actually happening. 

Aave
The pool transfers the requested amounts of the reserves to your contract, then calls executeOperation() on receiver contract.
Swap

26/10
I wasn't getting anywhere with the actual swap functionality - I couldn't even get a simple Swap contract to work with Uniswap V3, so I'm doing what I should have done originally: switching to V2. According to DefiLlama, it's by far the most forked protocol, so my code should be maximally compatible with other dexes.