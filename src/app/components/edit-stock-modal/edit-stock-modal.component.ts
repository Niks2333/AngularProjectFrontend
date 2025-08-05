import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { StoreStockService } from 'src/app/services/stock.service';

@Component({
  selector: 'app-edit-stock-modal',
  templateUrl: './edit-stock-modal.component.html',
  styleUrls: ['./edit-stock-modal.component.css']
})
export class EditStockModalComponent implements OnInit {
  @Input() storeProductId!: number;
  @Input() isVisible: boolean = false;
  @Output() closed = new EventEmitter<boolean>();

  editForm!: FormGroup;
  imagePreview: string = '';
  backendImageUrl = 'http://localhost:56262/Content/images/';

  constructor(private fb: FormBuilder, private stockService: StoreStockService) {}

  ngOnInit(): void {
    this.initForm();

    if (this.storeProductId) {
      this.stockService.getEditStockFormData(this.storeProductId).subscribe({
        next: (data) => {
          this.editForm.patchValue(data);
          this.imagePreview = this.backendImageUrl + data.ImagePath;
        }
      });
    }
  }

  initForm() {
  this.editForm = this.fb.group({
    StoreProductId: [0],
    StorePrice: [0, [Validators.required, Validators.min(1)]], 
    Stock: [0, [Validators.required, Validators.min(0)]],       
    StoreName: [''],
    ProductName: [''],
    ImageFile: [null]
  });
}


  onImageChange(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.editForm.patchValue({ ImageFile: file });

      const reader = new FileReader();
      reader.onload = e => this.imagePreview = reader.result as string;
      reader.readAsDataURL(file);
    }
  }

  submit() {
    const formData = new FormData();
    Object.entries(this.editForm.value).forEach(([key, value]) => {
      formData.append(key, value as any);
    });

    if (this.editForm.value.ImageFile) {
      formData.append('ImageFile', this.editForm.value.ImageFile);
    }

    this.stockService.updateStock(formData).subscribe({
      next: (res: any) => {
        if (res.success) {
          //alert("✅ Stock updated!");
          this.closed.emit(true);
        } else {
          alert("❌ Error: " + res.message);
        }
      }
    });
  }

  close() {
    this.closed.emit(false);
  }
}
