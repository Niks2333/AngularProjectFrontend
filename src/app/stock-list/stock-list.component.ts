import { Component, OnInit } from '@angular/core';

import { StoreStockService } from '../services/stock.service';
import { StoreProductViewModel } from '../models/store-product-view.model';
import { Router, ActivatedRoute } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';

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

  successMessage: string = '';

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
    private spinner: NgxSpinnerService
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
    this.spinner.show(undefined, {
      type: 'ball-spin-clockwise'
    });

    this.stockService.getStockWithParams(this.filters)
      .subscribe({
        next: (data) => {
          debugger;
          this.stockData = data;
          this.categoryDropdownList = data.Categories.map(c => ({ value: c }));
          //console.log("📦 Products Received:", this.stockData.Products);
          this.spinner.hide();
        },

        error: (err) => {
          console.error('Error fetching stock', err);
          this.spinner.hide();
        }
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
      this.successMessage = '✅ Stock added successfully!';
      this.applyFilters();

      setTimeout(() => {
        this.successMessage = '';
      }, 3000);
    }
  }

  navigateBack() {
    this.router.navigate(['']);
  }

  showEditModal = false;
  selectedStockId = 0;

  openEditModal(id: number) {
    this.selectedStockId = id;
    this.showEditModal = true;
  }

  onEditModalClosed(refresh: boolean) {
    this.showEditModal = false;
    if (refresh) {
      this.successMessage = "✅ Stock updated successfully!";
      this.applyFilters();

      setTimeout(() => this.successMessage = '', 3000);
    }
  }

  deleteStock(id: number) {
    if (confirm('❗ Are you sure you want to delete this stock item?')) {
      this.spinner.show();

      this.stockService.deleteStock(id).subscribe({

        next: (res) => {

          if (res.success) {
            this.successMessage = "🗑️ Stock deleted successfully!";
            this.applyFilters();
          } else {
            alert("❌ Failed to delete: " + res.message);
          }
          this.spinner.hide();
          setTimeout(() => this.successMessage = '', 3000);
        },
        error: (err) => {
          console.error('Delete error', err);
          alert("❌ Unexpected error during deletion.");
          this.spinner.hide();
        }
      });
    }
  }


}
