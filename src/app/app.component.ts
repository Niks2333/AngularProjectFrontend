import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'InventoryManagementFrontend';

  id:any = 10;

 ngOnInit(): void {
    localStorage.setItem('id', this.id.toString());
  }
}
