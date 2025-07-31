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

categoryDropdownList: any[] = [];
filters = {
  search: '',
  SelectedCategories: [] as string[],
  page: 1,
  pageSize: 5,
  sortColumn: 'ProductName',
  sortOrder: 'ASC' as 'ASC' | 'DESC'
};
  constructor(
    private stockService: StoreStockService,
    private route: ActivatedRoute
  ) {}

  get pageNumbers(): number[] {
  const totalPages = Math.ceil((this.stockData?.TotalCount || 0) / this.filters.pageSize);
  const currentPage = this.filters.page;
  const pages: number[] = [];

  const start = Math.max(currentPage - 2, 1);
  const end = Math.min(currentPage + 3, totalPages);

  for (let i = start; i <= end; i++) {
    pages.push(i);
  }

  return pages;
}
dropdownSettings = {
  singleSelection: false,
  idField: 'value',
  textField: 'value',
  selectAllText: 'Select All',
  unSelectAllText: 'Unselect All',
  itemsShowLimit: 3,
  allowSearchFilter: true
};
  goToPage(page: number) {
  if (page !== this.filters.page) {
    this.filters.page = page;
    this.fetchStock();
  }
}

  ngOnInit(): void {
    this.storeName = this.route.snapshot.paramMap.get('storeName') || '';
    this.fetchStock();
  }
fetchStock() {
  this.stockService.getStockWithParams(this.storeName, this.filters).subscribe({
    next: (data) => {
      this.stockData = data;
      this.categoryDropdownList = data.Categories.map(c => ({ value: c }));
    },
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
