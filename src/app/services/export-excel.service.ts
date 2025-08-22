import { Injectable } from '@angular/core';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
 
@Injectable({
  providedIn: 'root'
})
 
export class ExcelExportService {
  exportToExcel(data: any[], fileName: string): void {
    debugger;
    const headers = ['ProductName', 'CategoryName', 'StorePrice', 'Stock', 'ImagePath', 'StoreProductId'];
    const worksheet = XLSX.utils.json_to_sheet(data, { header: headers });
    const workbook: XLSX.WorkBook = { Sheets: { 'Data': worksheet }, SheetNames: ['Data'] };
 
    const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
 
    const blob: Blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
    saveAs(blob, `${fileName}.xlsx`);
  }
}
 