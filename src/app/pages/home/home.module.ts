import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { ComponentsModule } from '../../components/components.module';
import { HomeRoutingModule } from './home.routing';

import { HomeComponent } from './home.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { TableListComponent } from './table-list/table-list.component';
import { TypographyComponent } from './typography/typography.component';
import { IconsComponent } from './icons/icons.component';
import { MapsComponent } from './maps/maps.component';
import { NotificationsComponent } from './notifications/notifications.component';
import { UpgradeComponent } from './upgrade/upgrade.component';
import { ChartsModule } from 'ng2-charts';
import { CustomerService } from '../../services/customer.service';
import { Customer } from '../../services/customer';
import { FormsModule } from '@angular/forms';
import { jspdf } from 'jspdf';


@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ComponentsModule,
    HomeRoutingModule,
    RouterModule,
    ChartsModule
  ],
  declarations: [
    HomeComponent, 
    DashboardComponent, 
    UserProfileComponent, 
    TableListComponent, 
    TypographyComponent, 
    IconsComponent, 
    MapsComponent, 
    NotificationsComponent, 
    UpgradeComponent,
  ]
})
export class HomeModule { }
