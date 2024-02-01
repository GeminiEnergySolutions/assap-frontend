import {CanActivateFn, Router} from '@angular/router';
import {inject} from '@angular/core';
import {AuthService} from './shared/services/auth.service';
import {firstValueFrom} from 'rxjs';

export const AuthGuard: CanActivateFn = async () => {
  const token = localStorage.getItem('accessToken');
  if (token) {
    const authService = inject(AuthService);
    authService.currentLoginUser = await firstValueFrom(authService.getUser());
    return true;
  } else {
    return inject(Router).createUrlTree(['/auth/login']);
  }
};
