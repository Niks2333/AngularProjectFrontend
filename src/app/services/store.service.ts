import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Store } from '../models/store.model';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class StoreService {
  private apiUrl = `${environment.apiBaseUrl}/store/list`;

  constructor(private http: HttpClient) { }

  getStores(): Observable<Store[]> {
    return this.http.get<Store[]>(this.apiUrl);
  }
  addStoreWithProducts(formData: FormData): Observable<any> {
    return this.http.post('/api/store/add-with-products', formData);
  }
getStoreTypes(): Observable<any[]> {
  return this.http.get<any[]>(`${environment.apiBaseUrl}/store/storetypes`);
}
getAllProducts(): Observable<any[]> {
  return this.http.get<any[]>(`${environment.apiBaseUrl}/store/productlist`);
}




}
