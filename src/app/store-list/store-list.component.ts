
import { Component, OnInit } from '@angular/core';
import { Store } from '../models/store.model';
import { StoreService } from '../services/store.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-store-list',
  templateUrl: './store-list.component.html',
  styleUrls: ['./store-list.component.css']
})
export class StoreListComponent implements OnInit {
  stores: any; 
  error = '';

  constructor(
    private storeService: StoreService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.storeService.getStores().subscribe({
      next: (data: any) => {
        console.log('Raw API data:', data);
       // debugger;
        this.stores = data;
        console.log('Processed stores:', this.stores);
      },
      error: (err) => {
        this.error = 'Failed to load store data';
        console.error(err);
      }
    });
  }

  viewStock(storeName: string) {
    this.router.navigate(['/store', storeName, 'stock']);
  }
}
