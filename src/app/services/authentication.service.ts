import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UserModel } from '../models/user.model';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private baseUrl = `${environment.apiBaseUrl}/Account`;; 
  constructor(private http: HttpClient) {}

  
  login(user: UserModel): Observable<any> {
    return this.http.post<any>(
      `${this.baseUrl}/Login`,
      user,
      { withCredentials: true } 
    );
  }

 
  verifyOtp(otp: string): Observable<any> {
    return this.http.post<any>(
      `${this.baseUrl}/VerifyOTP`,
      { otp },
      { withCredentials: true }
    );
  }

  
  logout(): Observable<any> {
    return this.http.get<any>(
      `${this.baseUrl}/Logout`,
      { withCredentials: true }
    );
  }
}
