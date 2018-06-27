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

  isHistory:boolean = false;
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
  isAddConnection:boolean= false;
  isRecharge:boolean = false;
  maxInvoiceNo:String;

  constructor(private uploadService: UploadFileService,private custService: CustomerService,private connectionService: ConnectionService,
  private paymentService: PaymentService) { }

  ngOnInit() {
    this.getAllCustomers();
    this.getAllConnections();
    this.getMaxInvoiceNo();
  }

  showHistory(){
    this.getAllConnections();
    this.isHistory = true;
    this.isAddConnection = false;
    this.isRecharge = false;
    this.paymentDetailsContent = this.getHistoryForConn();
  }

  addConnection(){
    this.isAddConnection = true;
    this.isHistory = false;
    this.isRecharge = false;
  }

  recharge(){
    this.isAddConnection = false;
    this.isHistory = false;
    this.isRecharge = true;
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

 getMaxInvoiceNo(): void{
   this.paymentService.getMaxInvoiceNo()
   .then(result=>{
      this.maxInvoiceNo = result.invoiceNo;
      if(this.maxInvoiceNo == null)
        this.maxInvoiceNo = "INV-1000";
     // this.newPayment.invoiceNo = this.maxInvoiceNo;
    //  console.log(this.maxInvoiceNo);
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
        this.addConnBtn = true;
        return;
      }
    })

  }


  onConnectionSelect():void{
    this.allConnections.forEach(conn => {
     if(conn.connectionId == this.selectedConnection.connectionId){
       this.selectedConnection.connectionName = conn.connectionName;
       this.historyBtn = true;
       this.rechargeHomeBtn = true;
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
 // this.newConnection.addresses.connection = this.newConnection;   
  this.response = this.connectionService.create(this.newConnection);
  this.errorMessage = this.connectionService.errorMessage;
  this.errorMessage = JSON.parse(this.errorMessage).message;
 }

  

generateInvoice():void{
  //  let date = new Date();
  // this.doc.setFontSize(40);
  // this.doc.addImage(img);
  // //this.doc.text('Infinity Network',45, 25)
  // this.doc.
  
//this.doc.save(date.getMonth()+'-'+date.getFullYear()+'-'+this.selectedCustomer.firstName+'.pdf')
//this.chooseFile = true;
this.getImageFromUrl('Invoice_Logo.jpg', this.createPDF);
this.newPayment.invoiceNo = "INV"+'-'+(parseInt(this.maxInvoiceNo.split('-')[1])+1);
}

createPDF = function(imgData) {
	  var doc = new jspdf();
    let date = new Date();
	  doc.addImage(imgData, 'JPEG', 10, 10, 50, 50);
	  doc.addImage(imgData, 'JPEG', 70, 10, 100, 120);
    this.doc.save(date.getMonth()+'-'+date.getFullYear()+'-'+this.selectedCustomer.firstName+'.pdf')
	// Output as Data URI
	doc.output('datauri');
}

getImageFromUrl = function(url, callback) {
	var img = new Image, data, ret={data: null, pending: true};
	
	 img.onerror = function() {
	 	throw new Error('Cannot load image: "'+url+'"');
   }
   
	img.onload = function() {
		var canvas = document.createElement('canvas');
		document.body.appendChild(canvas);
		canvas.width = img.width;
		canvas.height = img.height;

		var ctx = canvas.getContext('2d');
		ctx.drawImage(img, 0, 0);
		// Grab the image as a jpeg encoded in base64, but only the data
		data = canvas.toDataURL('image/jpeg').slice('data:image/jpeg;base64,'.length);
		// Convert the data to binary form
		data = atob(data)
		document.body.removeChild(canvas);

		ret['data'] = data;
		ret['pending'] = false;
		if (typeof callback === 'function') {
			callback(data);
		}
	}
	img.src = url;
	return ret;
}

onRecharge():void {
  let conn = new Connection();
  conn.connectionId = this.selectedConnection.connectionId;
  this.newPayment.connection = conn;
  this.newPayment.date = new Date();
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

  invoiceBtn:boolean=false;
  sendInvoiceBtn:boolean=false;
  invoiceNoField= false;
  paymentMethodField = false;
  rechargeBtn= false;
  chooseFile = false;
  rechargeHomeBtn= false;
  addConnBtn= false;
  historyBtn= false;

  onPaymentStatusSelect(): void{
    if(this.newPayment.paymentStatus=="Paid"){
      this.invoiceBtn = true;
      this.paymentMethodField = true;
  }

    if(this.newPayment.paymentStatus=="Not Paid"){
      this.invoiceBtn = false;
      this.paymentMethodField = false;
    }
      //this.invoiceNoField = true;
  }

  formatDate(date) {
    var d = new Date(date),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;

    return [year, month, day].join('-');
}

}
