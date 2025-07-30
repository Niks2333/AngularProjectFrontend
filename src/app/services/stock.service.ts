import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { StoreProductViewModel } from '../models/store-product-view.model';

@Injectable({
  providedIn: 'root'
})
export class StoreStockService {
  private baseUrl = 'http://localhost:56262/api/stock';

  constructor(private http: HttpClient) {}

  getStock(storeName: string): Observable<StoreProductViewModel> {
    return this.http.get<StoreProductViewModel>(`${this.baseUrl}/bystore?storeName=${storeName}`);
  }
getStockWithParams(storeName: string, filters: any): Observable<StoreProductViewModel> {
  const model: StoreProductViewModel = {
    StoreName: storeName,
    Search: filters.search,
    SelectedCategory: filters.category,
    Page: filters.page,
    PageSize: filters.pageSize,
    SortColumn: filters.sortColumn,
    SortOrder: filters.sortOrder,
    Products: [],          // just placeholder, not needed in request
    Categories: [],        // same here
    TotalCount: 0          // ignored by backend
  };

  return this.http.post<StoreProductViewModel>('http://localhost:56262/api/stock/bystore', model);
}


}
