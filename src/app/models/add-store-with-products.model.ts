export interface AddStoreWithProducts {
  storeName: string;
  storeTypeId: number;
  createdBy: string;
  products: ProductWithOptionalImage[];
}

export interface ProductWithOptionalImage {
  productId: number;
  storePrice: number;
  stock: number;
  imagePath?: string;
}
