import { Component } from '@angular/core';
import { StoreService } from '../services/store.service';
import { AddStoreWithProducts } from '../models/add-store-with-products.model';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-store-add',
  templateUrl: './store-add.component.html',
  styleUrls: ['./store-add.component.css']
})
export class StoreAddComponent {
  model: AddStoreWithProducts = {
    storeName: '',
    storeTypeId: 0,
    createdBy: 'Niks23',
    products: []
  };

  productImageFiles: (File | null)[] = [];
  storeTypes: any[] = [];
  products: { productId: number; productName: string }[] = [];

  constructor(
    private storeService: StoreService,
    private router: Router
  ) { }

  ngOnInit() {
    this.loadProducts();
    this.loadStoreTypes();
    this.addProduct();
  }

  loadStoreTypes() {
    this.storeService.getStoreTypes().subscribe(data => {
      this.storeTypes = data.map(t => ({
        storeTypeId: t.StoreTypeId,
        storeTypeName: t.StoreTypeName
      }));
    });
  }

  loadProducts() {
    this.storeService.getAllProducts().subscribe(data => {
      this.products = data.map(p => ({
        productId: p.ProductId,
        productName: p.ProductName
      }));
    });
  }

  addProduct() {
    this.model.products.push({
      productId: 0,
      storePrice: 0,
      stock: 0,
      imagePath: ''
    });
    this.productImageFiles.push(null);
  }

  removeProduct(index: number) {
    this.model.products.splice(index, 1);
    this.productImageFiles.splice(index, 1);
  }

  trackByIndex(index: number): number {
    return index;
  }

getFilteredProducts(currentIndex: number) {
  const selectedIds = this.model.products
    .filter((p, idx) => idx !== currentIndex && p.productId > 0)
    .map(p => p.productId);

  return this.products.filter(prod =>
    !selectedIds.includes(prod.productId) ||
    prod.productId === this.model.products[currentIndex].productId
  );
}


  onProductImageSelected(event: any, index: number) {
    const file = event.target.files[0];
    this.productImageFiles[index] = file || null;
  }

  onSubmit() {
    const formData = new FormData();

    
    formData.append('model', JSON.stringify(this.model));

    
    this.productImageFiles.forEach((file, index) => {
      if (file) {
        formData.append(`productImage_${index}`, file);
      }
    });

    this.storeService.addStoreWithProducts(formData).subscribe({
      next: () => {
        Swal.fire({
          title: '🎉 Store Added!',
          text: 'The store and products were added successfully.',
          icon: 'success',
          timer: 3000,
          timerProgressBar: true
        }).then(() => {
          this.router.navigateByUrl('/');
        });
      },
      error: () => {
        Swal.fire({
          title: 'Error!',
          text: 'Something went wrong while adding the store.',
          icon: 'error'
        });
      }
    });
  }
}
