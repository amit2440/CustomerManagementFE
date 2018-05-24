import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions, URLSearchParams } from '@angular/http';
import { Observable } from 'rxjs';
import 'rxjs/add/operator/map';
import { Customer } from './../services/customer';



@Injectable()
export class CustomerService {
        observableItems: Observable<Customer[]>
	    allCustomers: Customer[] = [];
        errorMessage: string;
		url = "http://localhost:8080/custManagement/allCustomers";
		headers: Headers;
		options: RequestOptions;
		
	    constructor(private http:Http) {}
		
		getAllCustomers(): Promise<any> {
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
			this.errorMessage = error;
			return Promise.reject(error.message || error);
		}

		create(customer: Customer): Promise<Customer> {
			const headers = new Headers();
  			headers.append('Content-Type', 'application/json');
  			let options = new RequestOptions({ headers: headers })
			return this.http
			  .post("http://localhost:8080/custManagement/createCustomer", JSON.stringify(customer), options)
			  .toPromise()
			  .then(res => res.json() as Customer)
			  .catch(this.handleError);
		  }

		  getErrorMessage(): String{
			  return this.errorMessage;
		  }
}