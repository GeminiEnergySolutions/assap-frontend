import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {inject, Injectable} from '@angular/core';
import {Router} from '@angular/router';
import {ToastService} from '@mean-stream/ngbx';
import {Observable, tap} from 'rxjs';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  private toaster = inject(ToastService);
  private router = inject(Router);

  intercept(req: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    return next.handle(req).pipe(tap({
      error: (err) => this.handleError(err),
    }));
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  handleError(err: any) {
    if (typeof err.error === 'string') {
      try {
        err.error = JSON.parse(err.error);
      } catch {
        // ignore
      }
    }
    const message = err.error.message ? err.error.message : err.error.email && err.error.email.length ? err.error.email[0] : err.statusText;
    switch (err.status) {
      case 401:
        this.toaster.error('Access Denied', message);
        localStorage.clear();
        this.router.navigate(['/auth/login']);
        break;
      case 500:
        break;
      case 400:
        if (err.error?.message === 'Authorized still in pending') {
          // Don't show a toast -- this error is handled by the login component
          break;
        }
        // fallthrough
      default:
        this.toaster.error('Error', message);
        break;
    }
  }
}
