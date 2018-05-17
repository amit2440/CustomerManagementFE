import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs';
import 'rxjs/add/operator/map';
import { Customer } from './../services/customer';


@Injectable()
export class CustomerService {
        observableItems: Observable<Customer[]>
	    allCustomers: Customer[] = [];
		selectedItems: Customer[] = [];
        errorMessage: string;
	    url = "http://localhost:8080/custManagement/allCustomers";
	    constructor(private http:Http) { 
	      this.observableItems = this.http.get(this.url).map(this.extractData);
	      this.observableItems.subscribe(
	            data => this.allCustomers = data,
		        error =>  this.errorMessage = <any>error);
	    }
	getItems(): Observable<Customer[]> {
	   return this.observableItems;
	}
	
	private extractData(res: Response) {        
		return res.text() ? res.json() : {};
	}
}