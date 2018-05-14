import { Component, OnInit } from '@angular/core';
import { ROUTES } from './sidebar-routes.config';

declare var $:any;

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {
  menuItems: any[];
  myDataset: [100, 200, 300, 400, 500];
  constructor() { }

  ngOnInit() {
    $.getScript('../../assets/js/sidebar-moving-tab.js');
    this.menuItems = ROUTES.filter(menuItem => menuItem);
  }

}
