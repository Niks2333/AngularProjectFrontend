import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { LoginModel } from '../models/login.model';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html'
})
export class LoginComponent {
  loginData: LoginModel = new LoginModel();
  errorMessage = '';

  constructor(private authService: AuthService, private router: Router) {}

  onSubmit() {

    if (!this.loginData.username || !this.loginData.password) {
      this.errorMessage = "Both fields are required";
      return;
    }

    this.authService.login(this.loginData).subscribe({
      next: (response: any) => {
        //console.log(" Login success:", response);
        this.router.navigate(['/stores']);
      },
      error: (err) => {
       // console.error(" Login failed:", err);
        this.errorMessage = "Invalid username or password";
      }
    });
  }
}
