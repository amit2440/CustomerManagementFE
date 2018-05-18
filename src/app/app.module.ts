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
import { ConnectionPipe } from './pipes/connection.pipe';

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
    PagesModule
  ],
  providers: [CustomerService,ConnectionService],
  bootstrap: [AppComponent]
})
export class AppModule { }
