import {CanActivateFn, Router} from '@angular/router';
import {inject} from '@angular/core';
import {AuthService} from './shared/services/auth.service';

export const AuthGuard: CanActivateFn = () => {
  const token = localStorage.getItem('accessToken');
  if (token) {
    const authService = inject(AuthService);
    authService.getUser().subscribe((res: any) => {
      authService.currentLoginUser = res;
    });
    return true;
  } else {
    inject(Router).navigate(['/auth/login']);
    return false;
  }
};
