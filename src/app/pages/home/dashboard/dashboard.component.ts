import { Component, OnInit } from '@angular/core';
import { ChartsModule } from 'ng2-charts';

declare function require(path: string): any;

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  // Doughnut
  public doughnutChartLabels:string[] = ['Active Customers', 'Inactive Customers'];
  public doughnutChartData:number[] = [250, 50];
  public doughnutChartType:string = 'doughnut';
 
  // Active Customers
  
  public activeDoughnutChartLabels:string[] = ['Paid Customers', 'Unpaid Customers'];
  public activeDoughnutChartData:number[] = [200, 50];

  // This month Customers
  public  thisMonthDoughnutChartLabels:string[] = ['Past Customers', 'New Customers'];
  public  thisMonthDoughnutChartData:number[] = [290, 10];

  // events
  public chartClicked(e:any):void {
    console.log(e);
  }
 
  public chartHovered(e:any):void {
    console.log(e);
  }

  constructor() { }

  ngOnInit() {
    require('../../../../assets/js/charts.js')();
  }

}
