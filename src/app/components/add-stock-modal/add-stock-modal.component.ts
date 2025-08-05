import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
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
  form!: FormGroup;
  availableProducts: string[] = [];
  selectedFile!: File;

  constructor(private fb: FormBuilder, private stockService: StoreStockService) {}
ngOnInit() {
this.form = this.fb.group({
  ProductName: ['', Validators.required],
  StorePrice: ['', [Validators.required, Validators.min(1)]],
  Stock: ['', [Validators.required, Validators.min(0)]],
});


  console.log('Fetching available products for store:', this.storeName);

  this.stockService.getAddStockFormData(this.storeName).subscribe({
    next: (data) => {
      this.availableProducts = data.AvailableProducts ?? [];
      console.log('Available Products:', this.availableProducts); 
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
  if (this.form.invalid) {
    this.form.markAllAsTouched(); 
    return;
  }

  const formData = new FormData();
  formData.append('StoreName', this.storeName);
  formData.append('ProductName', this.form.value.ProductName);
  formData.append('StorePrice', this.form.value.StorePrice);
  formData.append('Stock', this.form.value.Stock);
  if (this.selectedFile) {
    formData.append('ImageFile', this.selectedFile);
  }

  this.stockService.addStock(formData).subscribe({
    next: (res: any) => {
      if (res.success) {
        this.close(true); 
      } else {
        
        this.form.setErrors({ apiError: res.message }); 
      }
    },
    error: err => {
      this.form.setErrors({ apiError: 'Failed to add stock.' });
    }
  });
}


  close(refresh: boolean = false) {
    this.closed.emit(refresh);
  }
  
}
