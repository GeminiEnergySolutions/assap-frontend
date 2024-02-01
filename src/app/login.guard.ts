import {inject} from '@angular/core';
import {CanActivateFn, Router} from '@angular/router';

export const LoginGuard: CanActivateFn = async () => {
  const token = localStorage.getItem('accessToken');
  if (token) {
    await inject(Router).navigate(['/audits']);
  }
  return true;
};
