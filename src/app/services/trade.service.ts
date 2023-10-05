import { Injectable } from "@angular/core";
import { Observable, catchError, mergeMap, of, tap } from "rxjs";
import { ethers } from "ethers";
import { environment } from "../../environments/environment";
import FlashLoan from "../../../artifacts/contracts/FlashLoan.sol/FlashLoan.json";

@Injectable()
export class tradeService {

	contractAddress: string;
	
	constructor() {
		this.contractAddress = environment.blockchain.network.FlashLoan;
	}
	
	getBalance(tokenAddress: string): Observable<any> {
		let contract;
        return of(this.getContract()).pipe(
            tap(c => (contract = c)),
            mergeMap((contract: any) => {
                return contract.getBalance(tokenAddress);
            }),
            catchError(error => {
                throw this.embellishError(`balanceOf('${this.contractAddress}')`, error);
            })
        );
	}

	getContract(): ethers.Contract {
        let provider;
        if(environment.blockchain.network.name === "hardhat") {
            provider = ethers.getDefaultProvider("http://localhost:8545/");
        // } else {
        //     provider = new ethers.providers.Web3Provider(ethereum);
        }
        // const signer = new ethers.Wallet(<string>process.env.PrivateKey, provider);
        let contract = new ethers.Contract(this.contractAddress, FlashLoan.abi, provider);
        return contract;
    }

    embellishError(message: string, error: Error): Error {
        error.message = `Smart contract error: ${message} - ${error.message}`;
        return error;
    }
}