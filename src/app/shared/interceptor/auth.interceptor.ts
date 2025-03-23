import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  intercept(req: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    if (req.url.includes('s3.amazonaws.com') || req.url.includes('localhost:9000')) {
      // Don't add Authorization header for S3/Minio uploads
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
