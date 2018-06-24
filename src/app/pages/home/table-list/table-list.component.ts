import { Component, OnInit } from '@angular/core';
import { DashboardComponent } from '../../home/dashboard/dashboard.component';
import { Connection } from '../../../services/connection';
import { ConnectionService } from '../../../services/connection.service';
import { CustomerService } from '../../../services/customer.service';
import { ConnectionPipe } from '../../../pipes/connection.pipe';
import { Customer } from '../../../services/customer';
import { PaymentDetails } from '../../../services/paymentDetails';
import { Address } from '../../../services/address';
import { Payment } from '../../../services/payment';
import { PaymentService } from '../../../services/payment.service';
import  jspdf  from 'jspdf';
import { UploadFileService } from '../../../services/fileUpload.service';
import { HttpClient, HttpResponse, HttpEventType } from '@angular/common/http';
import { HttpClientModule } from '@angular/common/http';


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
  selectedConnection = new Connection();
  connectionForSelectedCust: Connection[];
  paymentDetailsHeaders: String[] = ["ConnectionID","PaymentID","From","To","InternetPlan","InvoiceNo","Amount","Date","By", "Status"];
  paymentDetailsContent: PaymentDetails[] = [];
  showHide: false;

  constructor(private uploadService: UploadFileService,private custService: CustomerService,private connectionService: ConnectionService,
  private paymentService: PaymentService) { }

  ngOnInit() {
    this.getAllCustomers();
    this.getAllConnections();
  }

  showHistory(){
    this.paymentDetailsContent = this.getHistoryForConn();
    this.isHistory = true;
  }

  getHistoryForConn(): PaymentDetails[]{
  
    let paymentTable = new Array();
    let selectedConn = this.allConnections.filter( conn => conn.connectionId == this.selectedConnection.connectionId);
    if(selectedConn.length>0)
    selectedConn[0].payments.forEach(payment =>{
      let connDetailsContent = new PaymentDetails();
      connDetailsContent.ConnectionID = selectedConn[0].connectionId;
      connDetailsContent.Amount = payment.paymentAmount;
      connDetailsContent.By = payment.paymentMethod;
      connDetailsContent.Date = payment.date;
      connDetailsContent.From = payment.paymentFrom;
      connDetailsContent.To =payment.paymentTo;
      connDetailsContent.InternetPlan = payment.internetPlan;
      connDetailsContent.PaymentID = payment.paymentId;
      connDetailsContent.Status = payment.paymentStatus;
      connDetailsContent.InvoiceNo = payment.invoiceNo;
      // if(conn.customer != undefined && conn.customer instanceof Object){
      // //  let a = activeConn.customer;
      //  // this.allCustomers.forEach(element => {
      //     connDetailsContent.CustomerName = conn.customer.firstName.concat(" ").concat(conn.customer.lastName);
      //     connDetailsContent.Mobile = conn.customer.mobileNo;
      //   connDetailsContent.Email = conn.customer.emailId;
      // //  });
      // }
      // else{
      //   let temp = new Connection;
      //   temp.customer = conn.customer;
      //   let cust  = this.allCustomers.filter(cust => {
      //     return cust.customerId == temp.customer;
      //   });
      //   if(cust.length>0){
      //     connDetailsContent.CustomerName = cust[0].firstName.concat(" ").concat(cust[0].lastName);
      //     connDetailsContent.Mobile = cust[0].mobileNo;
      //    connDetailsContent.Email = cust[0].emailId;
      //   }
      // }
      
      //connDetailsContent.ConnectionName = conn.connectionName;
      //connDetailsContent.ConnectionDate = conn.connectionDate;
     // connDetailsContent.ConnectionStatus = conn.connectionStatus;
     // connDetailsContent.ConnectionAddress = conn.addresses == null ? null: conn.addresses.address;
      //connDetailsContent.PaymentStatus = "Unknown";
      // this.unpaidConnections.forEach(element => {
      //   if(element.connectionId == conn.connectionId)
      //     connDetailsContent.PaymentStatus = "Not Paid";
      // });
      // this.paidConnections.forEach(element => {
      //   if(element.connectionId == conn.connectionId)
      //     connDetailsContent.PaymentStatus = "Paid";
      // });
      paymentTable.push(connDetailsContent);
  
    })
    return paymentTable;
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
    this.connectionForSelectedCust = new Array();
    if(this.allCustomers!=undefined && this.allCustomers.length>0){
       this.allCustomers.forEach(customer =>{
         if(this.searchCustomer.firstName!=undefined && this.searchCustomer.firstName!=''){
          if(customer.firstName == this.searchCustomer.firstName){
            if(this.searchCustomer.emailId!=undefined && this.searchCustomer.emailId!=''){
              if(customer.emailId == this.searchCustomer.emailId){
              if(this.searchCustomer.mobileNo!=undefined && this.searchCustomer.mobileNo!=null){
                if(customer.mobileNo == this.searchCustomer.mobileNo){
                  this.currentSearchedCustomer.push(customer)
                  return;
                }
              }
              else{
                if(this.searchCustomer.mobileNo==undefined || this.searchCustomer.mobileNo==null){
                this.currentSearchedCustomer.push(customer)
                return;
                }
              }
            }
              
            }
          //   else{
         //      this.currentSearchedCustomer.push(customer)
         //     return;
         //   }
             if(this.searchCustomer.mobileNo!=undefined && this.searchCustomer.mobileNo!=null){
              if(customer.mobileNo == this.searchCustomer.mobileNo){
                if(this.searchCustomer.emailId!=undefined && this.searchCustomer.emailId!=''){
                  if(customer.emailId == this.searchCustomer.emailId){
                //  if(this.searchCustomer.mobileNo!=undefined && this.searchCustomer.mobileNo!=null){
                  //  if(customer.mobileNo == this.searchCustomer.mobileNo){
                      this.currentSearchedCustomer.push(customer)
                      return;
                  //   }
                  // }
                  // else{
                   // this.currentSearchedCustomer.push(customer)
                 //   return;
                //  }
                }
                  
                }
                else{
                this.currentSearchedCustomer.push(customer)
                return;
                }
              }
            }
            else{
              if(this.searchCustomer.emailId==undefined || this.searchCustomer.emailId==''){
              this.currentSearchedCustomer.push(customer)
              return;
              }
            }
          }
          if(customer.lastName == this.searchCustomer.firstName){
            if(this.searchCustomer.emailId!=undefined && this.searchCustomer.emailId!=''){
              if(customer.emailId == this.searchCustomer.emailId){
              if(this.searchCustomer.mobileNo!=undefined && this.searchCustomer.mobileNo!=null){
                if(customer.mobileNo == this.searchCustomer.mobileNo){
                  this.currentSearchedCustomer.push(customer)
                  return;
                }
              }
              else{
                if(this.searchCustomer.mobileNo==undefined || this.searchCustomer.mobileNo==null){
                this.currentSearchedCustomer.push(customer)
                return;
                }
              }
            }
              
            }
          //   else{
         //      this.currentSearchedCustomer.push(customer)
         //     return;
         //   }
             if(this.searchCustomer.mobileNo!=undefined && this.searchCustomer.mobileNo!=null){
              if(customer.mobileNo == this.searchCustomer.mobileNo){
                if(this.searchCustomer.emailId!=undefined && this.searchCustomer.emailId!=''){
                  if(customer.emailId == this.searchCustomer.emailId){
                //  if(this.searchCustomer.mobileNo!=undefined && this.searchCustomer.mobileNo!=null){
                  //  if(customer.mobileNo == this.searchCustomer.mobileNo){
                      this.currentSearchedCustomer.push(customer)
                      return;
                  //   }
                  // }
                  // else{
                   // this.currentSearchedCustomer.push(customer)
                 //   return;
                //  }
                }
                  
                }
                else{
                this.currentSearchedCustomer.push(customer)
                return;
                }
              }
            }
            else{
              if(this.searchCustomer.emailId==undefined || this.searchCustomer.emailId==''){
              this.currentSearchedCustomer.push(customer)
              return;
              }
            }
          }
        }
        if(this.searchCustomer.emailId!=undefined && this.searchCustomer.emailId!=''){
          if(customer.emailId == this.searchCustomer.emailId){
            if(this.searchCustomer.mobileNo!=undefined && this.searchCustomer.mobileNo!=null){
              if(this.searchCustomer.firstName==undefined || this.searchCustomer.firstName=='')
              if(customer.mobileNo == this.searchCustomer.mobileNo){
                this.currentSearchedCustomer.push(customer)
                return;
              }
            }
             else{
              if(this.searchCustomer.firstName==undefined || this.searchCustomer.firstName==''){
                if(this.searchCustomer.mobileNo==undefined || this.searchCustomer.mobileNo==null){
               this.currentSearchedCustomer.push(customer)
               return;
                }
              }
             }
          }
            
         }
        
        if(this.searchCustomer.mobileNo!=undefined && this.searchCustomer.mobileNo!=null){
          if(customer.mobileNo == this.searchCustomer.mobileNo){
            if(this.searchCustomer.firstName==undefined || this.searchCustomer.firstName=='')
            if(this.searchCustomer.emailId==undefined || this.searchCustomer.emailId=='')
            this.currentSearchedCustomer.push(customer)
            return;
          }
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
      if(cust.customerId == this.selectedCustomer.customerId){
        this.connectionForSelectedCust = cust.connections;
        this.selectedCustomer.firstName = cust.firstName;
        this.selectedCustomer.lastName = cust.lastName;
        return;
      }
    })

  }


  onConnectionSelect():void{
    this.allCustomers.forEach(cust => {
     if(cust.customerId == this.selectedCustomer.customerId){
       this.connectionForSelectedCust = cust.connections;
       return;
     }
   })
 }

 newConnection = new Connection();
 newAddress = new Address();
 errorMessage: string;
  response: any;
  newPayment = new Payment();

 onConnectionAdd(): void{
   this.newConnection.customer = this.selectedCustomer;
   this.newConnection.addresses = this.newAddress;
  this.response = this.connectionService.create(this.newConnection);
  this.errorMessage = this.connectionService.errorMessage;
  this.errorMessage = JSON.parse(this.errorMessage).message;
 }

  doc = new jspdf();

generateInvoice():void{
  let date = new Date();
  this.doc.setFontSize(40);
this.doc.text('Infinity Network',45, 25)
this.doc.save(date.getMonth()+'-'+date.getFullYear()+'-'+this.selectedCustomer.firstName+'.pdf')

}

onRecharge():void {
  this.newPayment.connectionId = this.selectedConnection.connectionId;
  console.log(this.doc);
   this.response = this.paymentService.create(this.newPayment);
  this.errorMessage = this.connectionService.errorMessage;
  this.errorMessage = JSON.parse(this.errorMessage).message;
}

selectedFiles: FileList;
   currentFileUpload: File;
  
  selectFile(event) {
    console.log("in selected files");
    this.selectedFiles = event.target.files;
  }
  upload() {
    this.currentFileUpload = this.selectedFiles.item(0);
    this.uploadService.pushFileToStorage(this.currentFileUpload).subscribe(event => {
     if (event instanceof HttpResponse) {
        console.log('File is completely uploaded!');
      }
    });
    this.selectedFiles = undefined;
  }


}
