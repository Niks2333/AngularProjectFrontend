export interface WebAddStockViewModel {
  StoreName: string;
  ProductName: string;
  StorePrice: number;
  Stock: number;
  ImageFile?: File;
  AvailableProducts?: string[];
}
