import { Component, OnInit } from '@angular/core';
import { DashboardComponent } from '../../home/dashboard/dashboard.component';
import { Connection } from '../../../services/connection';
import { ConnectionService } from '../../../services/connection.service';
import { CustomerService } from '../../../services/customer.service';
import { ConnectionPipe } from '../../../pipes/connection.pipe';
import { Customer } from '../../../services/customer';


@Component({
  selector: 'app-table-list',
  templateUrl: './table-list.component.html',
  styleUrls: ['./table-list.component.css']
})
export class TableListComponent implements OnInit {

  isHistory:boolean;
  connectionsForUser: any;
  allCustomers: Customer[];
  allConnections: Connection[];
  currentSearchedCustomer: any;
  searchCustomer = new Customer();
  selectedCustomer = new Customer();
  connectionForSelectedCust: Connection[];

  constructor(private custService: CustomerService,private connectionService: ConnectionService) { }

  ngOnInit() {
    this.getAllCustomers();
    this.getAllConnections();
  }

  showHistory(){
    console.log("Hello");
    this.isHistory = true;
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
        
      })
      .catch(error => console.log(error));
  }

  search() : void {
    this.currentSearchedCustomer = new Array();
    if(this.allCustomers!=undefined && this.allCustomers.length>0){
       this.allCustomers.forEach(customer =>{
         if(customer.firstName == this.searchCustomer.firstName){
              this.currentSearchedCustomer.push(customer)
         }
         if(customer.lastName == this.searchCustomer.firstName){
          this.currentSearchedCustomer.push(customer)
          }
       });
      //  if(this.currentSearchedCustomer!=undefined){
      //     this.connectionsForUser = new Map();
      //     if(this.currentSearchedCustomer.connection!=undefined){
      //     this.currentSearchedCustomer.connection.forEach(connection =>{
      //       this.connectionsForUser.set(connection.connectionId,connection.connectionStatus);
      //     })
      //   }
      //  }
      }
  }

  onCustSelect():void{
    this.allCustomers.forEach(cust => {
      if(cust.customerId == this.selectedCustomer.customerId)
      return cust;
    })
  }


}
