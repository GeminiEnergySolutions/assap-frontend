import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Router} from '@angular/router';
import {ToastService} from '@mean-stream/ngbx';
import {Observable, tap} from 'rxjs';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  constructor(
    private toaster: ToastService,
    private router: Router,
  ) {
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(tap({
      error: (err) => this.handleError(err),
    }));
  }

  handleError(err: any) {
    if (typeof err.error === 'string') {
      try {
        err.error = JSON.parse(err.error);
      } catch (e) {
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
      default:
        this.toaster.error('Error', message);
        break;
    }
  }
}
