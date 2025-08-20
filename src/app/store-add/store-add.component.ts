import { Component } from '@angular/core';
import { StoreService } from '../services/store.service';
import { AddStoreWithProducts, ProductWithOptionalImage } from '../models/add-store-with-products.model';
import { Router, ActivatedRoute } from '@angular/router';
import Swal from 'sweetalert2';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-store-add',
  templateUrl: './store-add.component.html',
  styleUrls: ['./store-add.component.css']
})
export class StoreAddComponent {
  model = new AddStoreWithProducts({ createdBy: 'Niks23' });
  productImageFiles: (File | null)[] = [];
  storeTypes: any[] = [];
  products: { productId: number; productName: string }[] = [];
  isEditMode = false;
  backendImageUrl2 = 'http://localhost:56262/Content/images/';

  constructor(
    private storeService: StoreService,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.loadStoreTypes();
    this.loadProducts();

    this.route.paramMap.subscribe(params => {
      const storeName = params.get('storeName');
      if (storeName) {
        this.isEditMode = true;
        this.loadStoreDetails(storeName);
      } else {
        this.isEditMode = false;
        this.addProduct();
      }
    });
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

  loadStoreDetails(storeName: string) {
    this.storeService.getStoreWithProducts(storeName).subscribe(storeData => {
      this.model = new AddStoreWithProducts({
        storeName: storeData.StoreName,
        storeTypeId: storeData.StoreTypeId,
        createdBy: storeData.CreatedBy,
        products: (storeData.Products || []).map((prod: any) => ({
          productId: prod.ProductId,
          storePrice: prod.StorePrice,
          stock: prod.Stock,
          imagePath: prod.ImagePath || ''

        }))
      });

      this.productImageFiles = new Array(this.model.products.length).fill(null);
    });
  }

  addProduct() {
    this.model.products.push(new ProductWithOptionalImage());
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

    if (this.isEditMode) {
      this.storeService.updateStoreWithProducts(formData).subscribe({
        next: () => {
          Swal.fire({
            title: '🎉 Store Updated!',
            text: 'The store and products were updated successfully.',
            icon: 'success',
            timer: 3000,
            timerProgressBar: true
          }).then(() => this.router.navigateByUrl('/'));
        },
        error: () => {
          Swal.fire({
            title: 'Error!',
            text: 'Something went wrong while updating the store.',
            icon: 'error'
          });
        }
      });
    } else {
      this.storeService.addStoreWithProducts(formData).subscribe({
        next: () => {
          Swal.fire({
            title: '🎉 Store Added!',
            text: 'The store and products were added successfully.',
            icon: 'success',
            timer: 3000,
            timerProgressBar: true
          }).then(() => this.router.navigateByUrl('/'));
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
}
