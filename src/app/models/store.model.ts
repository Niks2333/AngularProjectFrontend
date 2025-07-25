export interface Store {
  storeId: number;
  storeName: string;
  createdBy: string;
  createdOn: string;
  storeImage?: string; // optional base64 image
}
