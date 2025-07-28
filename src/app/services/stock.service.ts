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
  let params = new HttpParams()
    .set('storeName', storeName)
    .set('search', filters.search || '')
    .set('category', filters.category || '')
    .set('page', filters.page)
    .set('pageSize', filters.pageSize)
    .set('sortColumn', filters.sortColumn || '')
    .set('sortOrder', filters.sortOrder || '');

  return this.http.get<StoreProductViewModel>('http://localhost:56262/api/stock/bystore', { params });
}

}
