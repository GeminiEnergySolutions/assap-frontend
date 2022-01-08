import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {CompanycamCredentialService} from './companycam-credential.service';

@Injectable()
export class CompanycamInterceptor implements HttpInterceptor {
  constructor(
    private companycamCredentialService: CompanycamCredentialService,
  ) {
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (!req.url.startsWith('https://api.companycam.com')) {
      return next.handle(req);
    }

    const {apiKey} = this.companycamCredentialService;
    let headers = req.headers;
    if (apiKey) {
      headers = headers.set('Authorization', 'Bearer ' + apiKey);
    }
    const newReq = req.clone({headers});
    return next.handle(newReq);
  }
}
