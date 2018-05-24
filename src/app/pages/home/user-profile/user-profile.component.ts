import { Component, OnInit } from '@angular/core';
import { Customer } from '../../../services/customer';
import { Connection } from '../../../services/connection';
import { Address } from '../../../services/address';
import { ConnectionService } from '../../../services/connection.service';
import { CustomerService } from '../../../services/customer.service';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent implements OnInit {
  errorMessage: string;
  response: any;
  constructor(private custService: CustomerService,private connectionService: ConnectionService) { }

  ngOnInit() {
  }

  customer = new Customer();
  onSubmit(): void {
  this.response = this.custService.create(this.customer);
  this.errorMessage = this.custService.errorMessage;
  this.errorMessage = JSON.parse(this.errorMessage).message;
}
   
}
