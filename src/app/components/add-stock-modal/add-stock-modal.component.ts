import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { StoreStockService } from 'src/app/services/stock.service';
import { WebAddStockViewModel } from 'src/app/models/web-add-stock.model';

@Component({
  selector: 'app-add-stock-modal',
  templateUrl: './add-stock-modal.component.html',
  styleUrls: ['./add-stock-modal.component.css']
})
export class AddStockModalComponent implements OnInit {
  @Input() storeName!: string;
  @Input() isVisible = false;
  @Output() closed = new EventEmitter<boolean>();

  model!: WebAddStockViewModel;  
  availableProducts: string[] = [];
  selectedFile?: File;

  constructor(private stockService: StoreStockService) {}

  ngOnInit() {
    
    this.model = new WebAddStockViewModel(this.storeName);

   
    this.stockService.getAddStockFormData(this.storeName).subscribe({
      next: (data) => {
        this.availableProducts = data.AvailableProducts ?? [];
      },
      error: (err) => {
        console.error('Failed to fetch available products', err);
      }
    });
  }

  onFileChange(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
    }
  }

  submit() {
    if (!this.model.ProductName || this.model.StorePrice <= 0 || this.model.Stock < 0) {
      alert('Please fill all required fields correctly.');
      return;
    }

    const formData = new FormData();
    formData.append('Data', JSON.stringify(this.model));
    if (this.selectedFile) {
      formData.append('ImageFile', this.selectedFile);
    }

    this.stockService.addStock(formData).subscribe({
      next: (res: any) => {
        if (res.success) {
          this.close(true);
        } else {
          alert(res.message || 'Failed to add stock.');
        }
      },
      error: () => {
        alert('Error occurred while adding stock.');
      }
    });
  }

  close(refresh: boolean = false) {
    this.closed.emit(refresh);
  }
}
