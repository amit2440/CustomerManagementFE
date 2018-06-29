import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions, URLSearchParams } from '@angular/http';
import { Observable } from 'rxjs';
import 'rxjs/add/operator/map';
import { Payment } from './../services/payment';



@Injectable()
export class PaymentService {
        observableItems: Observable<Payment[]>
	    allCustomers: Payment[] = [];
        errorMessage: string;
		url = "http://localhost:8080/custManagement/addPayment";
		headers: Headers;
		options: RequestOptions;
		
	    constructor(private http:Http) {}
		
		// getAllCustomers(): Promise<any> {
		// 	return this.http
		// 		.get(this.url, this.options)
		// 		.toPromise()
		// 		.then(this.extractData)
		// 		.catch(this.handleError);
		// }
	
		private extractData(res: Response) {
			let body = res.json();
			return body || {};
		}
	
		private handleError(error: any): Promise<any> {
			console.error('An error occurred', error);
			this.errorMessage = error;
			return Promise.reject(error.message || error);
		}

		create(payment: Payment): Promise<Payment> {
			const headers = new Headers();
  			headers.append('Content-Type', 'application/json');
  			let options = new RequestOptions({ headers: headers })
			return this.http
			  .post("http://localhost:8080/custManagement/addPayment", JSON.stringify(payment), options)
			  .toPromise() 
			  .then(res => res.json() as Payment)
			  .catch(this.handleError);
		  }

		  getErrorMessage(): String{
			  return this.errorMessage;
		  }

		  

		  getMaxInvoiceNo(): Promise<Payment> {
			const headers = new Headers();
  			headers.append('Content-Type', 'application/json');
  			let options = new RequestOptions({ headers: headers })
			return this.http
			  .get("http://localhost:8080/custManagement/getMaxInvoiceNo")
			  .toPromise()
			  .then(res => res.json() as Payment)
			  .catch(this.handleError);
		  }


		  update(payment: Payment): Promise<Payment> {
			const headers = new Headers();
  			headers.append('Content-Type', 'application/json');
  			let options = new RequestOptions({ headers: headers })
			return this.http
			  .post("http://localhost:8080/custManagement/updatePayment", JSON.stringify(payment), options)
			  .toPromise() 
			  .then(res => res.json() as Payment)
			  .catch(this.handleError);
		  }
}