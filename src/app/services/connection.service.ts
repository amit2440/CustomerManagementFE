import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions, URLSearchParams } from '@angular/http';
import { Observable } from 'rxjs';
import 'rxjs/add/operator/map';
import { Connection } from './../services/connection';


@Injectable()
export class ConnectionService {
        observableItems: Observable<Connection[]>
		url = "http://localhost:8080/custManagement/allConnections";
		headers: Headers;
    	options: RequestOptions;
        constructor(private http:Http) {}
        
		getAllConnections(): Promise<any> {
			return this.http
				.get(this.url, this.options)
				.toPromise()
				.then(this.extractData)
				.catch(this.handleError);
		}
	
		private extractData(res: Response) {
			let body = res.json();
			return body || {};
		}
	
		private handleError(error: any): Promise<any> {
			console.error('An error occurred', error);
			return Promise.reject(error.message || error);
		}
}