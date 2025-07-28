
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { StoreListComponent } from './store-list/store-list.component';
import { StockListComponent } from './stock-list/stock-list.component'; 
const routes: Routes = [
  { path: '', component: StoreListComponent },
  { path: 'store/:storeName/stock', component: StockListComponent },
   { path: 'stock/:storeName', component: StockListComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
