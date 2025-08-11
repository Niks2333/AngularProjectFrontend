import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { StoreProductViewModel } from '../models/store-product-view.model';
import { environment } from 'src/environments/environment';
import { WebAddStockViewModel } from '../models/web-add-stock.model';
import { WebEditStockViewModel } from '../models/web-edit-stock.model';

@Injectable({
  providedIn: 'root'
})
export class StoreStockService {
  private baseUrl = `${environment.apiBaseUrl}/stock`;

  constructor(private http: HttpClient) { }

  getStock(storeName: string): Observable<StoreProductViewModel> {
    return this.http.get<StoreProductViewModel>(`${this.baseUrl}/bystore?storeName=${storeName}`);
  }

  getStockWithParams(filters: any): Observable<StoreProductViewModel> {
    const model: StoreProductViewModel = {
      StoreName: filters.storeName,
      Search: filters.search,
      SelectedCategories: filters.SelectedCategories.map((cat: any) => typeof cat === 'string' ? cat : cat.value),
      Page: filters.page,
      PageSize: filters.pageSize,
      SortColumn: filters.sortColumn,
      SortOrder: filters.sortOrder,
      Products: [],
      Categories: [],
      TotalCount: 0
    };
    return this.http.post<StoreProductViewModel>(`${this.baseUrl}/bystore`, model);
  }

  getAddStockFormData(storeName: string): Observable<WebAddStockViewModel> {
    return this.http.get<WebAddStockViewModel>(`${this.baseUrl}/add-form-data?storeName=${storeName}`);
  }
  addStock(formData: FormData): Observable<any> {
    return this.http.post(`${this.baseUrl}/add`, formData);
  }
  updateStock(formData: FormData) {
    return this.http.post(`${this.baseUrl}/update`, formData);
  }

  getEditStockFormData(id: number): Observable<WebEditStockViewModel> {
    return this.http.get<WebEditStockViewModel>(`${this.baseUrl}/edit-form-data/${id}`);
  }
  deleteStock(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/delete/${id}`);
  }

}
