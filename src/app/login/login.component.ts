import { Component } from '@angular/core';
import { AuthService } from 'src/app/services/authentication.service';
import { UserModel } from 'src/app/models/user.model';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  model: UserModel = new UserModel();
  otp: string = '';
  step: 'login' | 'otp' = 'login';

  constructor(private authService: AuthService) { }

  onLogin() {
    this.authService.login(this.model).subscribe({
      next: (res) => {
        alert(res.message || 'OTP sent!');
        this.step = 'otp';
      },
      error: (err) => {
        console.error(err);
        alert('Login failed');
      }
    });
  }

  onVerifyOtp() {
    this.authService.verifyOtp(this.otp).subscribe({
      next: (res) => {
        alert(res.message || 'Login successful!');
      },
      error: (err) => {
        console.error(err);
        alert('OTP verification failed');
      }
    });
  }
}
