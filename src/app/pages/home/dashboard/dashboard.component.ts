import { Component, OnInit, Pipe } from '@angular/core';
import { ChartsModule } from 'ng2-charts';
import { CustomerService } from '../../../services/customer.service';
import { Customer } from '../../../services/customer';
import { Connection } from '../../../services/connection';
import { ConnectionService } from '../../../services/connection.service';
import { ConnectionPipe } from '../../../pipes/connection.pipe';
import { DashBoardTable } from '../../../services/dashBoardTable'
import { pipe } from 'rxjs';

declare function require(path: string): any;

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
  providers: [ConnectionPipe]
})
export class DashboardComponent implements OnInit {

  allCustomers: Customer[] = [];
  allConnections: Connection[] = [];
  errorMessage: string;
  activeConnections: Connection[] = [];
  inactiveConnections: Connection[] = [];
  paidConnections: Connection[] = [];
  unpaidConnections: Connection[] = [];
  oldConnections: Connection[] = [];
  newConnections: Connection[] = [];
  dashBoardTableTitle: String = "None";
  dashBoardTableSubTitle: String = "None";
  dashBoardTableContent: DashBoardTable[] = [];
  dashBoardTableHeaders: String[] = ["ConnectionID","CustomerName","Mobile","Email"
  ,"ConnectionName","ConnectionDate","ConnectionStatus","ConnectionAddress","LastPaymentStatus"];

  // Doughnut
  public doughnutChartLabels:string[] = ['Active Connections', 'Inactive Connections'];
  public doughnutChartData:number[] = [0,0];
  public doughnutChartType:string = 'doughnut';
  
  // Active Customers
  public paymentsDoughnutChartLabels:string[] = ['Paid Connections', 'Unpaid Connections'];
  public paymentDoughnutChartData:number[] = [0, 0];

  // This month Customers
  public  oldNewDoughnutChartLabels:string[] = ['Past Connections', 'New Connections'];
  public  oldNewDoughnutChartData:number[] = [290, 10];
  constructor(private custService: CustomerService,private connectionService: ConnectionService,private connectionPipe: ConnectionPipe) { }

  // events
  public chartClicked(e:any):void {
     if (e.active.length > 0) {
    const chart = e.active[0]._chart;
    const activePoints = chart.getElementAtEvent(e.event);
    if ( activePoints.length > 0) {
      // get the internal index of slice in pie chart
      const clickedElementIndex = activePoints[0]._index;
      const label = chart.data.labels[clickedElementIndex];
      // get value by index
      const value = chart.data.datasets[0].data[clickedElementIndex];
       var x = document.getElementById("dashboardTable");

       if(label == "Active Connections")
        this.dashBoardTableContent = this.getActiveConnectionForDash();
        if(label == "Inactive Connections")
        this.dashBoardTableContent = this.getInActiveConnectionForDash();
    if (x.style.display === "none") {
        x.style.display = "block";
    } else {
        x.style.display = "none";
        x.style.display = "block";
    }
    }
  }
  }
 
  public chartHovered(e:any):void {
    console.log(e);
  }
  
  ngOnInit() {
    require('../../../../assets/js/charts.js')();
    this.getAllCustomers();
    this.getAllConnections();
  let activeDashContents = new DashBoardTable();
  let dashBoardTable = new Array();
  activeDashContents.ConnectionID=1;
  activeDashContents.CustomerName="Amit";
   dashBoardTable.push(activeDashContents); 
  }

getActiveConnectionForDash(): DashBoardTable[]{
  
  let dashBoardTable = new Array();
  this.dashBoardTableTitle = "Active Connections";
  this.dashBoardTableSubTitle = "List of active connections";
  this.activeConnections.forEach(activeConn =>{
    let activeDashContents = new DashBoardTable();
    activeDashContents.ConnectionID = activeConn.connectionId;
    if(activeConn.customer instanceof Number){
      let a = activeConn.customer;
      this.allCustomers.forEach(element => {
        //if(element.customerId== a  )
       // activeDashContents.CustomerName = activeConn.customer.firstName.concat(activeConn.customer.lastName);
      });
    }
    //else
     // activeDashContents.CustomerName = activeConn.customer.firstName.concat(activeConn.customer.lastName);
    activeDashContents.Mobile = activeConn.customer.mobileNo;
    activeDashContents.Email = activeConn.customer.emailId;
    activeDashContents.ConnectionName = activeConn.connectionName;
    activeDashContents.ConnectionDate = activeConn.connectionDate;
    activeDashContents.ConnectionStatus = activeConn.connectionStatus;
    activeDashContents.ConnectionAddress = activeConn.addresses==null?null: activeConn.addresses.addressId.toString();
    
    //"Last Payment Status" :String;
    dashBoardTable.push(activeDashContents);

  })
  return dashBoardTable;
}

getInActiveConnectionForDash(): DashBoardTable[]{
  
  let dashBoardTable = new Array();
  this.dashBoardTableTitle = "Inactive Connections";
  this.dashBoardTableSubTitle = "List of Inactive connections";
  this.inactiveConnections.forEach(activeConn =>{
    let activeDashContents = new DashBoardTable();
    activeDashContents.ConnectionID = activeConn.connectionId;
    if(activeConn.customer instanceof Number){
      let a = activeConn.customer;
      this.allCustomers.forEach(element => {
        //if(element.customerId== a  )
       // activeDashContents.CustomerName = activeConn.customer.firstName.concat(activeConn.customer.lastName);
      });
    }
    //else
     // activeDashContents.CustomerName = activeConn.customer.firstName.concat(activeConn.customer.lastName);
    activeDashContents.Mobile = activeConn.customer.mobileNo;
    activeDashContents.Email = activeConn.customer.emailId;
    activeDashContents.ConnectionName = activeConn.connectionName;
    activeDashContents.ConnectionDate = activeConn.connectionDate;
    activeDashContents.ConnectionStatus = activeConn.connectionStatus;
    activeDashContents.ConnectionAddress = activeConn.addresses==null?null: activeConn.addresses.addressId.toString();
    
    //"Last Payment Status" :String;
    dashBoardTable.push(activeDashContents);

  })
  return dashBoardTable;
}
   getAllCustomers(): void {
      this.custService
          .getAllCustomers()
          .then(result => {
            this.allCustomers = result;
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
          this.paidConnections = this.getPaidUpaidConnections(this.allConnections,['Paid']);
          this.unpaidConnections = this.getPaidUpaidConnections(this.allConnections,['Not Paid']);
          this.paymentDoughnutChartData = [this.paidConnections.length,this.unpaidConnections.length];
          let oldNewConnections = this.connectionPipe.getNewPastConnections(this.allConnections);
          this.oldConnections = oldNewConnections.get("oldConnection");
          this.newConnections = oldNewConnections.get("newConnection"); 
          this.oldNewDoughnutChartData = [this.oldConnections.length, this.newConnections.length];
          console.log(this.activeConnections,this.inactiveConnections);
        })
        .catch(error => console.log(error));
 }

   getPaidUpaidConnections(value:any[], args:any[]) : Connection[] {
      let paidUnpaidConnection = new Array();
      value.forEach(connection =>{
        connection.payments.forEach(payment => {
          if(payment.paymentStatus==args[0])
              paidUnpaidConnection.push(connection);
      });
    });
    return paidUnpaidConnection;
  }

   /*getNewPastConnections(value:any[], args:any[]) : Connection[] {
      let newOldConnection = new Array();
      value.forEach(connection =>{
        connection.payments.forEach(payment => {
          if(payment.paymentStatus==args[0])
              newOldConnection.push(connection);
      });
    });
    return paidUnpaidConnection;
}*/
   
}
