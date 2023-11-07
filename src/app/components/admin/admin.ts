import { Component } from "@angular/core";
import { computePoolAddress, FeeAmount } from "@uniswap/v3-sdk";
import { IQuoteConfig } from "src/app/interfaces";
import { ChainId, Token } from "@uniswap/sdk-core";
import { ethers, providers } from 'ethers';
import IUniswapV3PoolABI from "@uniswap/v3-core/artifacts/contracts/interfaces/IUniswapV3Pool.sol/IUniswapV3Pool.json";

@Component({
    selector: 'admin',
    templateUrl: './admin.html',
    styleUrls: ['./admin.less']
  })
  export class Admin {

	config: IQuoteConfig;
	POOL_FACTORY_CONTRACT_ADDRESS = "0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f";
	poolAddress: string;
	
	constructor() {}

	async ngOnInit() {
		const chainId = ChainId.POLYGON_MUMBAI;
		console.log(`chainId: ${chainId}`);
  
		const DAI = new Token(chainId, '0xc8c0Cf9436F4862a8F60Ce680Ca5a9f0f99b5ded', 6);
		const USDC = new Token(chainId, '0x52D800ca262522580CeBAD275395ca6e7598C014', 6);

		//const DAI = new Token(chainId, '0xc8c0Cf9436F4862a8F60Ce680Ca5a9f0f99b5ded', 6);
		//const USDC = new Token(chainId, '0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174', 6);

		this.config = {
			rpc: {
				local: '',
				testnet: 'https://polygon-mumbai.infura.io/v3/ef103a8360e542d38197b38941e77249',
				mainnet: '',
			},
			tokens: {
				in: USDC,
				amountIn: 1000,
				out: DAI,
				poolFee: FeeAmount.MEDIUM,
			}
		}
		this.poolAddress = this.getPoolAddress();
		debugger;
		const contract = this.getPoolContract();
		const values = await this.getPoolMethods(contract);
	}

	getPoolAddress() {
		const currentPoolAddress = computePoolAddress({
			factoryAddress: this.POOL_FACTORY_CONTRACT_ADDRESS,
			tokenA: this.config.tokens.in,
			tokenB: this.config.tokens.out,
			fee: this.config.tokens.poolFee
		});
		return currentPoolAddress;
	}

	getPoolContract(): ethers.Contract {
		const provider: providers.Provider = new ethers.providers.JsonRpcProvider(this.config.rpc.testnet);
		const contract = new ethers.Contract(
			this.poolAddress,
			IUniswapV3PoolABI.abi,
			provider);
		return contract;
	}

	async getPoolMethods(c: ethers.Contract): Promise<any> {
		//const l = await c.liquidity();
		//return l; 
		const [
			token0,
			token1,
			fee
		// 	liquidity,
		// 	//slot0
		] = await Promise.all([
			c.token0(),
			c.token1(),
			c.fee()
		// 	c.liquidity(),
		// 	//c.slot0()
		]);
		console.log(`fee: ${fee}`);
		return {
			token0,
			token1,
			fee
		// 	liquidity,
		// 	//slot0
		};
	}
}