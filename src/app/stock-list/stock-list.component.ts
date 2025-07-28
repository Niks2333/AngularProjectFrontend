import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { StoreStockService } from '../services/stock.service';
import { StoreProductViewModel } from '../models/store-product-view.model';

@Component({
  selector: 'app-stock-list',
  templateUrl: './stock-list.component.html',
  styleUrls: ['./stock-list.component.css']
})
export class StockListComponent implements OnInit {
  storeName = '';
  stockData?: StoreProductViewModel;

  filters = {
    search: '',
    category: '',
    page: 1,
    pageSize: 5,
    sortColumn: 'ProductName',
    sortOrder: 'ASC' as 'ASC' | 'DESC'
  };

  constructor(
    private stockService: StoreStockService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.storeName = this.route.snapshot.paramMap.get('storeName') || '';
    this.fetchStock();
  }

  fetchStock() {
    this.stockService.getStockWithParams(this.storeName, this.filters).subscribe({
      next: (data) => (this.stockData = data),
      error: (err) => console.error('Error fetching stock', err)
    });
  }

  applyFilters() {
    this.filters.page = 1;
    this.fetchStock();
  }

  sortBy(column: string) {
    if (this.filters.sortColumn === column) {
      this.filters.sortOrder = this.filters.sortOrder === 'ASC' ? 'DESC' : 'ASC';
    } else {
      this.filters.sortColumn = column;
      this.filters.sortOrder = 'ASC';
    }
    this.fetchStock();
  }

  nextPage() {
    this.filters.page++;
    this.fetchStock();
  }

  prevPage() {
    if (this.filters.page > 1) {
      this.filters.page--;
      this.fetchStock();
    }
  }
}
