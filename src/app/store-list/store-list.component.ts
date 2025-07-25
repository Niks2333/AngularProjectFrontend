import { Component, OnInit } from '@angular/core';
import { Store } from '../models/store.model';
import { StoreService } from '../services/store.service';

@Component({
  selector: 'app-store-list',
  templateUrl: './store-list.component.html',
  styleUrls: ['./store-list.component.css']
})
export class StoreListComponent implements OnInit {
  stores: Store[] = [];
  error = '';

  constructor(private storeService: StoreService) {}

  ngOnInit(): void {
    this.storeService.getStores().subscribe({
      next: (data: any) => {
        console.log('Raw API data:', data);

        const rawStores = Array.isArray(data) ? data : data?.stores || [];
this.stores = rawStores.map((store: any) => {
  const image = store.StoreImage
    ? this.arrayBufferToBase64(store.StoreImage)
    : null;

  return {
    storeId: store.StoreId,       
    storeName: store.StoreName,
    createdBy: store.CreatedBy,
    createdOn: store.CreatedOn,
    storeImage: image
  } as Store;
});

        console.log('Processed stores:', this.stores);
      },
      error: (err) => {
        this.error = 'Failed to load store data';
        console.error(err);
      }
    });
  }

  arrayBufferToBase64(buffer: any): string {
    if (!buffer || !buffer.length) return '';
    const binary = String.fromCharCode(...new Uint8Array(buffer));
    return 'data:image/png;base64,' + btoa(binary);
  }
}
