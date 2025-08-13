import { Component, Input, Output, EventEmitter, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { StoreStockService } from 'src/app/services/stock.service';
import { WebEditStockViewModel } from 'src/app/models/web-edit-stock.model';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-edit-stock-modal',
  templateUrl: './edit-stock-modal.component.html',
  styleUrls: ['./edit-stock-modal.component.css']
})
export class EditStockModalComponent implements OnInit, OnChanges {
  @Input() storeProductId!: number;
  @Input() isVisible = false;
  @Output() closed = new EventEmitter<boolean>();

  model = new WebEditStockViewModel();
  selectedFile?: File;
  imagePreview = '';
  backendImageUrl = environment.apiBaseUrl + '/Content/images/';

  constructor(private stockService: StoreStockService) {}

  ngOnInit(): void {
    if (this.storeProductId) {
      this.loadStockData();
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['storeProductId'] && this.storeProductId) {
      this.loadStockData();
    }
  }

  loadStockData() {
    this.stockService.getEditStockFormData(this.storeProductId).subscribe({
      next: (data) => {
        this.model = new WebEditStockViewModel(data);
        this.imagePreview = data.ImagePath ? this.backendImageUrl + data.ImagePath : '';
      },
      error: (err) => console.error(err)
    });
  }

  onImageChange(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
      const reader = new FileReader();
      reader.onload = () => this.imagePreview = reader.result as string;
      reader.readAsDataURL(file);
    }
  }

  submit() {
    if (this.model.StorePrice < 0 || this.model.Stock < 0) {
      return;
    }

    const formData = new FormData();
    formData.append('model', JSON.stringify(this.model));
    if (this.selectedFile) {
      formData.append('ImageFile', this.selectedFile);
    }

    this.stockService.updateStock(formData).subscribe({
      next: (res: any) => {
        if (res.success) {
          this.closed.emit(true);
        } else {
          alert('❌ Error: ' + res.message);
        }
      }
    });
  }

  close() {
    this.closed.emit(false);
  }
}
