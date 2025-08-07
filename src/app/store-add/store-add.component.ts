import { Component } from '@angular/core';
import { StoreService } from '../services/store.service';
import { AddStoreWithProducts } from '../models/add-store-with-products.model';

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
    storeImage: null,
    products: []
  };

  storeTypes: any[] = [];
  products: { productId: number; productName: string }[] = [];

  constructor(private storeService: StoreService) {}

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
      console.log('Products loaded from API:', data);
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
      imagePath: '', 
      imageFile: null 
    });
  }
  trackByIndex(index: number, item: any): number {
  return index;
}
isProductSelected(productId: number, currentIndex: number): boolean {
  return this.model.products.some((p, idx) => idx !== currentIndex && p.productId === productId);
}


  getFilteredProducts(currentIndex: number) {
  const selectedProductIds = this.model.products
    .filter((_, index) => index !== currentIndex) 
    .map(p => p.productId);

  return this.products.filter(prod =>
    !selectedProductIds.includes(prod.productId) || 
    prod.productId === this.model.products[currentIndex].productId
  );
}


  removeProduct(index: number) {
    this.model.products.splice(index, 1);
  }

  
  onImageSelected(event: any) {
    this.model.storeImage = event.target.files[0];
  }


  onProductImageSelected(event: any, index: number) {
    const file = event.target.files[0];
    if (file) {
      this.model.products[index].imageFile = file;
    }
  }

  onSubmit() {
    const formData = new FormData();
    formData.append('storeName', this.model.storeName);
    formData.append('storeTypeId', this.model.storeTypeId.toString());
    formData.append('createdBy', this.model.createdBy);

    if (this.model.storeImage) {
      formData.append('storeImage', this.model.storeImage);
    }

 
    this.model.products.forEach((p, index) => {
      if (p.imageFile) {
        formData.append(`productImage_${index}`, p.imageFile);
      }
    });

    
    const productsWithoutFiles = this.model.products.map(p => ({
      productId: p.productId,
      storePrice: p.storePrice,
      stock: p.stock,
      imagePath: p.imagePath  
    }));
    formData.append('products', JSON.stringify(productsWithoutFiles));

    this.storeService.addStoreWithProducts(formData).subscribe({
      next: () => alert('Store & Products added!'),
      error: err => alert('Error while adding store.')
    });
    
  }
}
