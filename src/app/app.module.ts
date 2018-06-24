import { BrowserModule } from '@angular/platform-browser';
import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { RouterModule } from '@angular/router';

import { AppRoutingModule } from './app.routing';
import { PagesModule } from './pages/pages.module';

import { AppComponent } from './app.component';
import { ChartsModule } from 'ng2-charts';
import { CustomerService } from './services/customer.service'
import { ConnectionService } from './services/connection.service'
import { PaymentService } from './services/payment.service'
import { UploadFileService } from './services/fileUpload.service'
import { ConnectionPipe } from './pipes/connection.pipe';
import {NgxPaginationModule} from 'ngx-pagination'; 
import {HttpClient, HttpRequest, HttpEvent} from '@angular/common/http';
import { HttpClientModule } from '@angular/common/http';
import { jspdf } from 'jspdf';


@NgModule({
  declarations: [
    AppComponent,
    ConnectionPipe
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    RouterModule,
    ChartsModule,
    AppRoutingModule,
    PagesModule,
    HttpClientModule
  ],
  providers: [CustomerService,ConnectionService, PaymentService,UploadFileService, HttpClient],
  bootstrap: [AppComponent]
})
export class AppModule { }
