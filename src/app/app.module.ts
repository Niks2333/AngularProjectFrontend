import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { StoreListComponent } from './store-list/store-list.component';
import { HttpClientModule } from '@angular/common/http';
import { StockListComponent } from './stock-list/stock-list.component';
import { FormsModule } from '@angular/forms';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { AddStockModalComponent } from './components/add-stock-modal/add-stock-modal.component';
import { ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { LayoutComponent } from './layout/layout.component';
@NgModule({
  declarations: [
    AppComponent,
    StoreListComponent,
    StockListComponent,
    AddStockModalComponent,
    LayoutComponent,
    
  ],
  imports: [
    BrowserModule,
    HttpClientModule ,
    AppRoutingModule,
    FormsModule,
     NgMultiSelectDropDownModule.forRoot(),
    ReactiveFormsModule,
    NgbModule,
     NgbPaginationModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
