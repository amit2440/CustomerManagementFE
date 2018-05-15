import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-table-list',
  templateUrl: './table-list.component.html',
  styleUrls: ['./table-list.component.css']
})
export class TableListComponent implements OnInit {

  isHistory:boolean;

  constructor() { }

  ngOnInit() {
  }

  showHistory(){
    console.log("Hello");
    this.isHistory = true;
  }
}
