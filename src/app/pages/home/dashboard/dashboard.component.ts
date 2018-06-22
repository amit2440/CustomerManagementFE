import { Component, OnInit, Pipe } from '@angular/core';
import { ChartsModule } from 'ng2-charts';
import { CustomerService } from '../../../services/customer.service';
import { Customer } from '../../../services/customer';
import { Connection } from '../../../services/connection';
import { Address } from '../../../services/address';
import { ConnectionService } from '../../../services/connection.service';
import { ConnectionPipe } from '../../../pipes/connection.pipe';
import { DashBoardTable } from '../../../services/dashBoardTable';
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
  ,"ConnectionName","ConnectionDate","ConnectionStatus","ConnectionAddress","PaymentStatus"];


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
        if(label == "Paid Connections")
        this.dashBoardTableContent = this.getPaidConnectionForDash();
        if(label == "Unpaid Connections")
        this.dashBoardTableContent = this.getUnpaidConnectionForDash();
        if(label == "New Connections")
        this.dashBoardTableContent = this.getNewConnectionForDash();
        if(label == "Past Connections")
        this.dashBoardTableContent = this.getOldConnectionForDash ();
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
    if(activeConn.customer != undefined && activeConn.customer instanceof Object){
    //  let a = activeConn.customer;
     // this.allCustomers.forEach(element => {
        activeDashContents.CustomerName = activeConn.customer.firstName.concat(" ").concat(activeConn.customer.lastName);
        activeDashContents.Mobile = activeConn.customer.mobileNo;
      activeDashContents.Email = activeConn.customer.emailId;
    //  });
    }
    else{
      let temp = new Connection;
      temp.customer = activeConn.customer;
      let cust  = this.allCustomers.filter(cust => {
        return cust.customerId == temp.customer;
      });
      if(cust.length>0){
        activeDashContents.CustomerName = cust[0].firstName.concat(" ").concat(cust[0].lastName);
        activeDashContents.Mobile = cust[0].mobileNo;
       activeDashContents.Email = cust[0].emailId;
      }
    }
    
    activeDashContents.ConnectionName = activeConn.connectionName;
    activeDashContents.ConnectionDate = activeConn.connectionDate;
    activeDashContents.ConnectionStatus = activeConn.connectionStatus;
    activeDashContents.ConnectionAddress = activeConn.addresses == null ? null: activeConn.addresses.address;
    activeDashContents.PaymentStatus = "Unknown";
    this.unpaidConnections.forEach(element => {
      if(element.connectionId == activeConn.connectionId)
        activeDashContents.PaymentStatus = "Not Paid";
    });
    this.paidConnections.forEach(element => {
      if(element.connectionId == activeConn.connectionId)
        activeDashContents.PaymentStatus = "Paid";
    });
    dashBoardTable.push(activeDashContents);

  })
  return dashBoardTable;
}

getInActiveConnectionForDash(): DashBoardTable[]{
  
  let dashBoardTable = new Array();
  this.dashBoardTableTitle = "Inactive Connections";
  this.dashBoardTableSubTitle = "List of inactive connections";
  this.inactiveConnections.forEach(activeConn =>{
    let activeDashContents = new DashBoardTable();
    activeDashContents.ConnectionID = activeConn.connectionId;
    if(activeConn.customer != undefined && activeConn.customer instanceof Object){
      //  let a = activeConn.customer;
       // this.allCustomers.forEach(element => {
          activeDashContents.CustomerName = activeConn.customer.firstName.concat(" ").concat(activeConn.customer.lastName);
          activeDashContents.Mobile = activeConn.customer.mobileNo;
          activeDashContents.Email = activeConn.customer.emailId;
      //  });
      }
      else{
        let temp = new Connection;
        temp.customer = activeConn.customer;
        let cust  = this.allCustomers.filter(cust => {
          return cust.customerId == temp.customer;
        });
        if(cust.length>0){
         activeDashContents.CustomerName = cust[0].firstName.concat(" ").concat(cust[0].lastName);
         activeDashContents.Mobile = cust[0].mobileNo;
         activeDashContents.Email = cust[0].emailId;
        }
      }
    //else
     // activeDashContents.CustomerName = activeConn.customer.firstName.concat(activeConn.customer.lastName);
   
    activeDashContents.ConnectionName = activeConn.connectionName;
    activeDashContents.ConnectionDate = activeConn.connectionDate;
    activeDashContents.ConnectionStatus = activeConn.connectionStatus;
    activeDashContents.ConnectionAddress = activeConn.addresses == null ? null: activeConn.addresses.address;
    this.unpaidConnections.forEach(element => {
      if(element.connectionId == activeConn.connectionId)
        activeDashContents.PaymentStatus = "Not Paid";
    });
    this.paidConnections.forEach(element => {
      if(element.connectionId == activeConn.connectionId)
        activeDashContents.PaymentStatus = "Paid";
    });
    
    //"Last Payment Status" :String;
    dashBoardTable.push(activeDashContents);

  })
  return dashBoardTable;
}

getPaidConnectionForDash(): DashBoardTable[]{
  
  let dashBoardTable = new Array();
  this.dashBoardTableTitle = "Paid Connections";
  this.dashBoardTableSubTitle = "List of paid connections";
  this.paidConnections.forEach(paidConn =>{
    let paidDashContents = new DashBoardTable();
    paidDashContents.ConnectionID = paidConn.connectionId;
    if(paidConn.customer != undefined && paidConn.customer instanceof Object){
      //  let a = activeConn.customer;
       // this.allCustomers.forEach(element => {
          paidDashContents.CustomerName = paidConn.customer.firstName.concat(" ").concat(paidConn.customer.lastName);
          paidDashContents.Mobile = paidConn.customer.mobileNo;
          paidDashContents.Email = paidConn.customer.emailId;
      //  });
      }
      else{
        let temp = new Connection;
        temp.customer = paidConn.customer;
        let cust  = this.allCustomers.filter(cust => {
          return cust.customerId == temp.customer;
        });
        if(cust.length>0){
         paidDashContents.CustomerName = cust[0].firstName.concat(" ").concat(cust[0].lastName);
         paidDashContents.Mobile = cust[0].mobileNo;
         paidDashContents.Email = cust[0].emailId;
        }
      }
    //else
     // activeDashContents.CustomerName = activeConn.customer.firstName.concat(activeConn.customer.lastName);
   
    paidDashContents.ConnectionName = paidConn.connectionName;
    paidDashContents.ConnectionDate = paidConn.connectionDate;
    paidDashContents.ConnectionStatus = paidConn.connectionStatus;
    paidDashContents.ConnectionAddress = paidConn.addresses == null ? null: paidConn.addresses.address;
    this.unpaidConnections.forEach(element => {
      if(element.connectionId == paidConn.connectionId)
        paidDashContents.PaymentStatus = "Not Paid";
    });
    this.paidConnections.forEach(element => {
      if(element.connectionId == paidConn.connectionId)
        paidDashContents.PaymentStatus = "Paid";
    });
    
    //"Last Payment Status" :String;
    dashBoardTable.push(paidDashContents);

  })
  return dashBoardTable;
}

getUnpaidConnectionForDash():DashBoardTable[]{
  
  let dashBoardTable = new Array();
  this.dashBoardTableTitle = "Not Paid Connections";
  this.dashBoardTableSubTitle = "List of not paid connections";
  this.unpaidConnections.forEach(unpaidConn =>{
    let paidDashContents = new DashBoardTable();
    paidDashContents.ConnectionID = unpaidConn.connectionId;
    if(unpaidConn.customer != undefined && unpaidConn.customer instanceof Object){
      //  let a = activeConn.customer;
       // this.allCustomers.forEach(element => {
          paidDashContents.CustomerName = unpaidConn.customer.firstName.concat(" ").concat(unpaidConn.customer.lastName);
          paidDashContents.Mobile = unpaidConn.customer.mobileNo;
          paidDashContents.Email = unpaidConn.customer.emailId;
      //  });
      }
      else{
        let temp = new Connection;
        temp.customer = unpaidConn.customer;
        let cust  = this.allCustomers.filter(cust => {
          return cust.customerId == temp.customer;
        });
        if(cust.length>0){
         paidDashContents.CustomerName = cust[0].firstName.concat(" ").concat(cust[0].lastName);
         paidDashContents.Mobile = cust[0].mobileNo;
         paidDashContents.Email = cust[0].emailId;
        }
      }
    //else
     // activeDashContents.CustomerName = activeConn.customer.firstName.concat(activeConn.customer.lastName);
   
    paidDashContents.ConnectionName = unpaidConn.connectionName;
    paidDashContents.ConnectionDate = unpaidConn.connectionDate;
    paidDashContents.ConnectionStatus = unpaidConn.connectionStatus;
    paidDashContents.ConnectionAddress = unpaidConn.addresses == null ? null: unpaidConn.addresses.address;
    this.unpaidConnections.forEach(element => {
      if(element.connectionId == unpaidConn.connectionId)
        paidDashContents.PaymentStatus = "Not Paid";
    });
    this.paidConnections.forEach(element => {
      if(element.connectionId == unpaidConn.connectionId)
        paidDashContents.PaymentStatus = "Paid";
    });
    
    //"Last Payment Status" :String;
    dashBoardTable.push(paidDashContents);

  })
  return dashBoardTable;
}

getOldConnectionForDash(): DashBoardTable[]{
  
  let dashBoardTable = new Array();
  this.dashBoardTableTitle = "Old Connections";
  this.dashBoardTableSubTitle = "List of old connections";
  this.oldConnections.forEach(activeConn =>{
    let oldConnDashContents = new DashBoardTable();
    oldConnDashContents.ConnectionID = activeConn.connectionId;
    if(activeConn.customer != undefined && activeConn.customer instanceof Object){
    //  let a = activeConn.customer;
     // this.allCustomers.forEach(element => {
        oldConnDashContents.CustomerName = activeConn.customer.firstName.concat(" ").concat(activeConn.customer.lastName);
        oldConnDashContents.Mobile = activeConn.customer.mobileNo;
      oldConnDashContents.Email = activeConn.customer.emailId;
    //  });
    }
    else{
      let temp = new Connection;
      temp.customer = activeConn.customer;
      let cust  = this.allCustomers.filter(cust => {
        return cust.customerId == temp.customer;
      });
      if(cust.length>0){
        oldConnDashContents.CustomerName = cust[0].firstName.concat(" ").concat(cust[0].lastName);
        oldConnDashContents.Mobile = cust[0].mobileNo;
       oldConnDashContents.Email = cust[0].emailId;
      }
    }
    
    oldConnDashContents.ConnectionName = activeConn.connectionName;
    oldConnDashContents.ConnectionDate = activeConn.connectionDate;
    oldConnDashContents.ConnectionStatus = activeConn.connectionStatus;
    oldConnDashContents.ConnectionAddress = activeConn.addresses == null ? null: activeConn.addresses.address;
    oldConnDashContents.PaymentStatus = "Unknown";
    this.unpaidConnections.forEach(element => {
      if(element.connectionId == activeConn.connectionId)
        oldConnDashContents.PaymentStatus = "Not Paid";
    });
    this.paidConnections.forEach(element => {
      if(element.connectionId == activeConn.connectionId)
        oldConnDashContents.PaymentStatus = "Paid";
    });
    dashBoardTable.push(oldConnDashContents);

  })
  return dashBoardTable;
}

getNewConnectionForDash(): DashBoardTable[]{
  
  let dashBoardTable = new Array();
  this.dashBoardTableTitle = "New Connections";
  this.dashBoardTableSubTitle = "List of new connections";
  this.newConnections.forEach(newConn =>{
    let newConnDashContents = new DashBoardTable();
    newConnDashContents.ConnectionID = newConn.connectionId;
    if(newConn.customer != undefined && newConn.customer instanceof Object){
      //  let a = activeConn.customer;
       // this.allCustomers.forEach(element => {
          newConnDashContents.CustomerName = newConn.customer.firstName.concat(" ").concat(newConn.customer.lastName);
          newConnDashContents.Mobile = newConn.customer.mobileNo;
          newConnDashContents.Email = newConn.customer.emailId;
      //  });
      }
      else{
        let temp = new Connection;
        temp.customer = newConn.customer;
        let cust  = this.allCustomers.filter(cust => {
          return cust.customerId == temp.customer;
        });
        if(cust.length>0){
         newConnDashContents.CustomerName = cust[0].firstName.concat(" ").concat(cust[0].lastName);
         newConnDashContents.Mobile = cust[0].mobileNo;
         newConnDashContents.Email = cust[0].emailId;
        }
      }
    //else
     // activeDashContents.CustomerName = activeConn.customer.firstName.concat(activeConn.customer.lastName);
   
    newConnDashContents.ConnectionName = newConn.connectionName;
    newConnDashContents.ConnectionDate = newConn.connectionDate;
    newConnDashContents.ConnectionStatus = newConn.connectionStatus;
    newConnDashContents.ConnectionAddress = newConn.addresses == null ? null: newConn.addresses.address;
    this.unpaidConnections.forEach(element => {
      if(element.connectionId == newConn.connectionId)
        newConnDashContents.PaymentStatus = "Not Paid";
    });
    this.paidConnections.forEach(element => {
      if(element.connectionId == newConn.connectionId)
        newConnDashContents.PaymentStatus = "Paid";
    });
    
    //"Last Payment Status" :String;
    dashBoardTable.push(newConnDashContents);

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
