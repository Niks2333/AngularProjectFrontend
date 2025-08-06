export interface AddStoreWithProducts {
  storeName: string;
  storeTypeId: number;
  createdBy: string;
  storeImage: File | null;
  products: ProductWithOptionalImage[];
}

export interface ProductWithOptionalImage {
  productId: number;
  storePrice: number;
  stock: number;
  imagePath?: string;
  imageFile?: File | null;
}
