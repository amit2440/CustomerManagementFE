import { Component, OnInit } from '@angular/core';
import { ChartsModule } from 'ng2-charts';
import { CustomerService } from '../../../services/customer.service';
import { Customer } from '../../../services/customer';

declare function require(path: string): any;

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  storeItems: Customer[] = [];
  errorMessage: string;
  // Doughnut
  
 
  // Active Customers
  
  public activeDoughnutChartLabels:string[] = ['Paid Customers', 'Unpaid Customers'];
  public activeDoughnutChartData:number[] = [200, 50];

  // This month Customers
  public  thisMonthDoughnutChartLabels:string[] = ['Past Customers', 'New Customers'];
  public  thisMonthDoughnutChartData:number[] = [290, 10];

  constructor(private custService: CustomerService) { }

  // events
  public chartClicked(e:any):void {
    console.log(e);
  }
 
  public chartHovered(e:any):void {
    console.log(e);
  }
  

  ngOnInit() {
    require('../../../../assets/js/charts.js')();
    this.getStoreItems();
  }

  
  

   getStoreItems(): void {
	    this.custService.getItems().subscribe(
		   data => this.storeItems = data,
		   error =>  this.errorMessage = <any>error);
   }
   
   public doughnutChartLabels:string[] = ['Active Customers', 'Inactive Customers'];
  public doughnutChartData:number[] = [this.storeItems.length, 50];
  public doughnutChartType:string = 'doughnut';
}
