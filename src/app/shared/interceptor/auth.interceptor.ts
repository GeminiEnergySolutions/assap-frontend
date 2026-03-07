import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {environment} from '../../../environments/environment';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  intercept(req: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    if (!req.url.startsWith('/')
      && !req.url.startsWith(environment.api)
      && !req.url.startsWith(environment.authApi)
    ) {
      // Don't add Authorization header for S3/Minio/cross-origin requests
      return next.handle(req);
    }

    const token = localStorage.getItem('accessToken');
    let headers = req.headers;
    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    }
    const newReq = req.clone({headers});
    return next.handle(newReq);
  }
}
