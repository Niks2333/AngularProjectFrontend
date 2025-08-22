import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { TranslocoService } from '@ngneat/transloco';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.css']
})

export class LayoutComponent implements OnInit {
  sidebarOpen = false;
  isLoggedIn = false;
  currentLang = 'en';
  onStockPage = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    private transloco: TranslocoService
  ) { }

  ngOnInit() {
    this.authService.isLoggedIn().subscribe(status => {
      this.isLoggedIn = status;
    });

    this.onStockPage = this.router.url.includes('/stock');

    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: any) => {
      this.onStockPage = event.url.includes('/stock');
    });
  }


  toggleSidebar() {
    this.sidebarOpen = !this.sidebarOpen;
  }

  logout() {
    this.authService.logout();
  }

  switchLanguage() {
    this.currentLang = this.currentLang === 'en' ? 'fr' : 'en';
    this.transloco.setActiveLang(this.currentLang);
  }
}
