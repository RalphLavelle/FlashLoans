import { Injectable } from "@angular/core";
import { Observable, catchError } from "rxjs";
import { environment } from "../../environments/environment";
import { IBalance, ITrade, ITradeReport } from "../interfaces";
import { HttpClient, HttpHeaders } from "@angular/common/http";

@Injectable()
export class tradeService {

    httpOptions = {
        headers: new HttpHeaders({
            "Content-Type": "application/json",
        }),
    };
	
	constructor(private http: HttpClient) {}
	
	getBalance(): Observable<IBalance> {
        const url = `${environment.serverEndpoint}/balance`;
        return this.http.get<IBalance>(url).pipe(
            catchError(error => {
                throw this.embellishError(`getBalance`, error);
            })
        );
	}

    trade(trade: ITrade): Observable<ITradeReport> {
        const url = `${environment.serverEndpoint}/trade`;
        return this.http.post<any>(url, { trade }, this.httpOptions).pipe(
            catchError(error => {
                throw this.embellishError(`trade`, error);
            })
        );
    }

    embellishError(message: string, error: Error): Error {
        error.message = `Smart contract error: ${message} - ${error.message}`;
        return error;
    }
}
