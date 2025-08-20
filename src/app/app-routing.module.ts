
// import { NgModule } from '@angular/core';
// import { RouterModule, Routes } from '@angular/router';
// import { StoreListComponent } from './store-list/store-list.component';
// import { StockListComponent } from './stock-list/stock-list.component'; 
// import { LayoutComponent } from './layout/layout.component';
// import { StoreAddComponent } from './store-add/store-add.component';


// const routes: Routes = [
//   {
//     path: '',
//     component: LayoutComponent,
//     children: [
//       { path: '', component: StoreListComponent },
//       { path: 'store/:storeName/stock', component: StockListComponent },
//       { path: 'stock/:storeName', component: StockListComponent },
//       { path: 'store/add', component: StoreAddComponent },
//       { path: 'store-edit/:storeName', component: StoreAddComponent },
//     ]
//   }
// ];

// @NgModule({
//   imports: [RouterModule.forRoot(routes)],
//   exports: [RouterModule]
// })
// export class AppRoutingModule { }


import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { StoreListComponent } from './store-list/store-list.component';
import { StockListComponent } from './stock-list/stock-list.component';
import { LayoutComponent } from './layout/layout.component';
import { StoreAddComponent } from './store-add/store-add.component';
import { LoginComponent } from './login/login.component';
import { AuthGuard } from './auth.guard';
 
const routes: Routes = [
 { path: 'login', component: LoginComponent },  
 
  {
    path: '',
    component: LayoutComponent,
    canActivate: [AuthGuard],  
    children: [
      { path: '', redirectTo: 'stores', pathMatch: 'full' },
      { path: 'stores', component: StoreListComponent },
      { path: 'store/:storeName/stock', component: StockListComponent },
      { path: 'stock/:storeName', component: StockListComponent },
      { path: 'store/add', component: StoreAddComponent },
      { path: 'store-edit/:storeName', component: StoreAddComponent },
    ]
  },
 
  { path: '**', redirectTo: 'login' } 
];
 
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
 