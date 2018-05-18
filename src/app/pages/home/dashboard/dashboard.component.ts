import { Component, OnInit, Pipe } from '@angular/core';
import { ChartsModule } from 'ng2-charts';
import { CustomerService } from '../../../services/customer.service';
import { Customer } from '../../../services/customer';
import { Connection } from '../../../services/connection';
import { ConnectionService } from '../../../services/connection.service';
import { ConnectionPipe } from '../../../pipes/connection.pipe';
import { pipe } from 'rxjs';

declare function require(path: string): any;

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
  providers: [ConnectionPipe]
})
export class DashboardComponent implements OnInit {

  storeItems: Customer[] = [];
  allConnections: Connection[] = [];
  errorMessage: string;
  activeConnections: Connection[] = [];
  inactiveConnections: Connection[] = [];

  // Doughnut
  public doughnutChartLabels:string[] = ['Active Connections', 'Inactive Connections'];
  public doughnutChartData:number[] = [0,0];
  public doughnutChartType:string = 'doughnut';
  
  // Active Customers
  public activeDoughnutChartLabels:string[] = ['Paid Connections', 'Unpaid Connections'];
  public activeDoughnutChartData:number[] = [200, 50];

  // This month Customers
  public  thisMonthDoughnutChartLabels:string[] = ['Past Connections', 'New Connections'];
  public  thisMonthDoughnutChartData:number[] = [290, 10];
  constructor(private custService: CustomerService,private connectionService: ConnectionService,private connectionPipe: ConnectionPipe) { }

  // events
  public chartClicked(e:any):void {
    console.log(e);
  }
 
  public chartHovered(e:any):void {
    console.log(e);
  }
  
  ngOnInit() {
    require('../../../../assets/js/charts.js')();
    this.getAllCustomers();
    this.getAllConnections();
  }

   getAllCustomers(): void {
      this.custService
          .getAllCustomers()
          .then(result => {
            //this.storeItems = result;
          })
          .catch(error => console.log(error));
   }

   getAllConnections(): void {
    this.connectionService
        .getAllConnections()
        .then(result => {
          this.allConnections= result;
          this.activeConnections = this.connectionPipe.transform(this.allConnections,['Active']);
          this.inactiveConnections = this.connectionPipe.transform(this.allConnections,['Inactive']);
          this.doughnutChartData  = [this.activeConnections.length, this.inactiveConnections.length];
          console.log(this.activeConnections,this.inactiveConnections);
        })
        .catch(error => console.log(error));
 }
   
}
