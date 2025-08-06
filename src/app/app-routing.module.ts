
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { StoreListComponent } from './store-list/store-list.component';
import { StockListComponent } from './stock-list/stock-list.component'; 
import { LayoutComponent } from './layout/layout.component';
import { StoreAddComponent } from './store-add/store-add.component';
// const routes: Routes = [
//   { path: '', component: StoreListComponent },
//   { path: 'store/:storeName/stock', component: StockListComponent },
//    { path: 'stock/:storeName', component: StockListComponent },
// ];


const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      { path: '', component: StoreListComponent },
      { path: 'store/:storeName/stock', component: StockListComponent },
      { path: 'stock/:storeName', component: StockListComponent },
      { path: 'store/add', component: StoreAddComponent },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
