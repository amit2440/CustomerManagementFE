import { Component, OnInit ,ViewChild,ElementRef} from '@angular/core';
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
import { html2pdf } from 'html2pdf.js'




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
  @ViewChild('updateDiv') updateDiv: ElementRef;

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
    this.isUpdatePayment = false;
  }

  addConnection(){
    this.isAddConnection = true;
    this.isHistory = false;
    this.isRecharge = false;
    this.isUpdatePayment = false;
  }

  recharge(){
    this.isAddConnection = false;
    this.isHistory = false;
    this.isRecharge = true;
    this.isUpdatePayment = false;
    this.getMaxInvoiceNo();
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
       this.selectedConnection.payments = conn.payments;
       this.historyBtn = true;
       this.rechargeHomeBtn = true;
       this.updatePaymentBtn = true;
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

invoiceLogoPath = '../assets/img/Invoice_Logo.jpg'
doc = new jspdf(); 

generateInvoice():void{
    let date = new Date();
   //this.doc.setFontSize(40);
 //  var img = new Image();
  // img.src =this.invoiceLogoPath; 
  // this.doc.addImage(img,'JPEG', 10, 10, 50, 50);
//this.doc.text('Infinity Network',45, 25)
  // this.doc.
  
  //this.chooseFile = true;
  
  //var element = document.getElementById('updateDiv');
//  html2pdf(this.updateDiv);
  
  //this.getImageFromUrl(this.invoiceLogoPath, this.createPDF);
  this.doc.save(date.getMonth()+'-'+date.getFullYear()+'-'+this.selectedCustomer.firstName+'.pdf')
  if(this.isRecharge)
    this.newPayment.invoiceNo = "INV"+'-'+(parseInt(this.maxInvoiceNo.split('-')[1])+1);
  if(this.isUpdatePayment)
    this.updatePayment.invoiceNo = "INV"+'-'+(parseInt(this.maxInvoiceNo.split('-')[1])+1);
}

createPDF = function(imgData) {
    var doc = new jspdf();
    
    let date = new Date();
	  doc.addImage(imgData, 'jpg', 10, 10, 50, 50);
	  //doc.addImage(imgData, 'JPEG', 70, 10, 100, 120);
    doc.save(date.getMonth()+'-'+date.getFullYear()+'-'+this.selectedCustomer.firstName+'.pdf')
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
  console.log(url);
  img.src = url;
console.log(img.src);  
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
  updatePaymentBtn = false;
  isUpdatePayment =false;
  paymentsForConn :  Payment[];
  updatePaymentRadio :String;

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

  onRadioSelect(value:String):void{
     this.connectionService.getAllConnections();
     let conns = this.allConnections.filter(conn => conn.connectionId == this.selectedConnection.connectionId);
     this.selectedConnection = conns[0];
      if(this.updatePaymentRadio == "Paid"){
        this.paymentsForConn = this.selectedConnection.payments.filter(payment => payment.paymentStatus == "Paid");
        if(this.paymentsForConn.length>0){
          this.paymentsForConn.forEach(payment =>{
            payment.radioPaymentFrom = this.formatDate(payment.paymentFrom);
            payment.radioPaymentTo = this.formatDate(payment.paymentTo);
          })
        }
        return;
      }
      if(this.updatePaymentRadio == "NotPaid"){
        this.paymentsForConn = this.selectedConnection.payments.filter(payment => payment.paymentStatus == "Not Paid");
        if(this.paymentsForConn.length>0){
          this.paymentsForConn.forEach(payment =>{
            payment.radioPaymentFrom = this.formatDate(payment.paymentFrom);
            payment.radioPaymentTo = this.formatDate(payment.paymentTo);
          })
        }
        return;
      }
  }

  formatDate(date) {
    const monthNames = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
    ];
    var d = new Date(date),
        month = '' + monthNames[(d.getMonth())],
        day = '' + d.getDate(),
        year = d.getFullYear();

    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;

    return [day,month,year].join('-');
}

updatePaymentClick(): void{
  this.isUpdatePayment = true;
  this.isHistory = false;
  this.isAddConnection = false;
  this.isRecharge = false;
  this.getMaxInvoiceNo();
}

updateInvoiceBtn = false;
updatePaymentMethodField = false;
updatePaymentInvoiceNoField = false;
updatePayment = new Payment();

onUpdatePaymentStatusSelect(): void{
  if(this.updatePayment.paymentStatus=="Paid"){
    this.updateInvoiceBtn = true;
    this.updatePaymentMethodField = true;
}

  if(this.updatePayment.paymentStatus=="Not Paid"){
    this.updateInvoiceBtn = false;
    this.updatePaymentMethodField = false;
  }
}

onUpdatePaymentSubmit():void{
  let conn = new Connection();
  conn.connectionId = this.selectedConnection.connectionId;
  this.updatePayment.connection = conn;
  this.updatePayment.date = new Date();
  this.response = this.paymentService.update(this.updatePayment);
  this.errorMessage = this.paymentService.errorMessage;
  this.errorMessage = JSON.parse(this.errorMessage).message;
}

onPaymentMonthSelect():void{
 
  let selectedConn = this.allConnections.filter(conn => conn.connectionId ==this.selectedConnection.connectionId);
  let payments = selectedConn[0].payments.filter(payment => payment.paymentId == this.updatePayment.paymentId);
  if(payments.length>0){
    this.updatePayment.date = payments[0].date;
    this.updatePayment.paymentAmount = payments[0].paymentAmount;
    this.updatePayment.paymentStatus = payments[0].paymentStatus;
    this.updatePayment.internetPlan = payments[0].internetPlan;
    this.updatePayment.paymentMethod = payments[0].paymentMethod;
    this.updatePayment.invoiceNo = payments[0].invoiceNo;
  }
}

}
