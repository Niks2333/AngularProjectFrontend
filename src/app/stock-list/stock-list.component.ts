import { Component, OnInit } from '@angular/core';

import { StoreStockService } from '../services/stock.service';
import { StoreProductViewModel } from '../models/store-product-view.model';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-stock-list',
  templateUrl: './stock-list.component.html',
  styleUrls: ['./stock-list.component.css']
})
export class StockListComponent implements OnInit {
  storeName = '';
  stockData?: StoreProductViewModel;
  backendImageUrl = 'http://localhost:56262/Content/images/';
  fallbackImage = 'assets/images/image-not-found.png';

  categoryDropdownList: any[] = [];
  filters = {
    storeName: '',
    search: '',
    SelectedCategories: [] as string[],
    page: 1,
    pageSize: 5,
    sortColumn: 'ProductName',
    sortOrder: 'ASC' as 'ASC' | 'DESC'
  };
  constructor(
    private stockService: StoreStockService,
    private route: ActivatedRoute,
    private router: Router,
  ) { }

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
    const nameFromRoute = this.route.snapshot.paramMap.get('storeName') || '';
    this.storeName = nameFromRoute;
    this.filters.storeName = nameFromRoute;
    this.fetchStock();
  }

  fetchStock() {

    this.stockService.getStockWithParams(this.filters)
      .subscribe({
        next: (data) => {
           debugger;
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


  showAddModal = false;

  openAddModal() {
    this.showAddModal = true;
  }
  getSortArrow(column: string): string {
    if (this.filters.sortColumn === column) {
      return this.filters.sortOrder === 'ASC' ? '▲' : '▼';
    } else {

      return '⇅';
    }
  }

  onAddModalClosed(refresh: boolean) {
    this.showAddModal = false;
    if (refresh) {
      this.applyFilters();
    }
  }
  navigateBack() {
    this.router.navigate(['']);
  }


}
