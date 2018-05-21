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

  constructor(private custService: CustomerService,private connectionService: ConnectionService) { }

  ngOnInit() {
  }

  customer = new Customer();
  onSubmit(): void {
  this.custService.create(this.customer);
}
   
}
