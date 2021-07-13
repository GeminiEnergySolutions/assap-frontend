import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {ParseCredentialService} from './parse-credential.service';

@Injectable()
export class ParseInterceptor implements HttpInterceptor {
  constructor(
    private parseCredentialService: ParseCredentialService,
  ) {
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const headers = req.headers
      .set('X-Parse-Application-Id', this.parseCredentialService.appId)
      .set('X-Parse-Master-Key', this.parseCredentialService.masterKey)
    ;
    const newReq = req.clone({
      headers: headers,
    });
    return next.handle(newReq);
  }
}
