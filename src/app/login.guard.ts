import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './shared/services/auth.service';
import { AppSetting } from './shared/setting';

@Injectable({
  providedIn: 'root',
})
export class LoginGuard  {
  constructor(private router: Router) {}

  canActivate(): boolean {
    const token = localStorage.getItem('accessToken');
    if (token) {
      this.router.navigate(['/audits']);
      return true;
    } else {
      return true;
    }
  }
}