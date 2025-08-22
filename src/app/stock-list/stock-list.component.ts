import { Component, OnInit } from '@angular/core';
import { StoreStockService } from '../services/stock.service';
import { StoreProductViewModel } from '../models/store-product-view.model';
import { Router, ActivatedRoute } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { TranslocoService } from '@ngneat/transloco';
import { ExcelExportService } from '../services/export-excel.service';

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
    private spinner: NgxSpinnerService,
    private transloco: TranslocoService,
    private excelService: ExcelExportService
  ) { }

  dropdownSettings = {
    singleSelection: false,
    idField: 'value',
    textField: 'value',
    selectAllText: this.transloco.translate('stock.filters.selectAll'),
    unSelectAllText: this.transloco.translate('stock.filters.unselectAll'),
    itemsShowLimit: 3,
    allowSearchFilter: true
  };

  ngOnInit(): void {
    const nameFromRoute = this.route.snapshot.paramMap.get('storeName') || '';
    this.storeName = nameFromRoute;
    this.filters.storeName = nameFromRoute;
    this.fetchStock();
  }

  fetchStock() {
    this.spinner.show(undefined, { type: 'ball-spin-clockwise' });

    this.stockService.getStockWithParams(this.filters)
      .subscribe({
        next: (data) => {
          this.stockData = data;
          this.categoryDropdownList = data.Categories.map(c => ({ value: c }));
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

  getSortArrow(column: string): string {
    if (this.filters.sortColumn === column) {
      return this.filters.sortOrder === 'ASC' ? '▲' : '▼';
    } else {
      return '⇅';
    }
  }

  showAddModal = false;
  openAddModal() {
    this.showAddModal = true;
  }

  onAddModalClosed(refresh: boolean) {
    this.showAddModal = false;
    if (refresh) {
      this.successMessage = this.transloco.translate('stock.messages.added');
      this.applyFilters();
      setTimeout(() => this.successMessage = '', 3000);
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
      this.successMessage = this.transloco.translate('stock.messages.updated');
      this.applyFilters();
      setTimeout(() => this.successMessage = '', 3000);
    }
  }

  deleteStock(id: number) {
    if (confirm(this.transloco.translate('stock.messages.deleteConfirm'))) {
      this.spinner.show();

      this.stockService.deleteStock(id).subscribe({
        next: (res) => {
          if (res.success) {
            this.successMessage = this.transloco.translate('stock.messages.deleted');
            this.applyFilters();
          } else {
            alert(this.transloco.translate('stock.messages.deleteFailed') + res.message);
          }
          this.spinner.hide();
          setTimeout(() => this.successMessage = '', 3000);
        },
        error: (err) => {
          console.error('Delete error', err);
          alert(this.transloco.translate('stock.messages.deleteError'));
          this.spinner.hide();
        }
      });
    }
  }
  downloadExcel() {
    if (this.stockData && this.stockData.Products) {
      this.excelService.exportToExcel(this.stockData.Products, 'Productslist');
    } else {
      console.warn('No product data available for export');
    }
  }

}
