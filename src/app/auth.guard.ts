import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './shared/services/auth.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard  {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(): boolean {
    // Replace this with your actual login check logic
    // For example, you can use a service to check if the user is logged in
    const token = localStorage.getItem('accessToken');

    if (token) {
      this.authService.getUser().subscribe((res: any) => {
        this.authService.currentLoginUser = res;
      });
      return true;
    } else {
      this.router.navigate(['/auth/login']);
      return false;
    }
  }
}
