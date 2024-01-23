import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { ChangeDetectorRef, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { ToastService } from 'ng-bootstrap-ext';
import { catchError, Observable, throwError } from 'rxjs';
import { AuditService } from '../services/audit.service';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  constructor(private toaster: ToastService,
    private auditService: AuditService,
    private router: Router,
    // private cd: ChangeDetectorRef,
  ) {
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    return next.handle(req).pipe(catchError(err => {
      try {
        err.error = JSON.parse(err.error)
      }
      catch(e) {
      }
      const error = err.error.message ? err.error.message: err.error.email && err.error.email.length ? err.error.email[0] : err.statusText;
      this.auditService.isCompleted = true;
      // this.cd.detectChanges();
      if (err.status === 401) {
        this.toaster.error('UnAuthorized', 'Access Denied');
        localStorage.clear();
        this.router.navigate(['/auth/login']);
      } else {
        this.toaster.error(error, 'Error');
      }
      return throwError(error)
    }))
  }
}
