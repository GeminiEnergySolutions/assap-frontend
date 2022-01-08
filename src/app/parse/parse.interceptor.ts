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
    const {url} = this.parseCredentialService;
    if (!req.url.startsWith(url)) {
      return next.handle(req);
    }

    const {appId, masterKey, sessionToken} = this.parseCredentialService;
    let headers = req.headers;
    if (appId) {
      headers = headers.set('X-Parse-Application-Id', appId);
    }
    if (masterKey) {
      headers = headers.set('X-Parse-Master-Key', masterKey);
    }
    if (sessionToken) {
      headers = headers.set('X-Parse-Session-Token', sessionToken);
    }
    const newReq = req.clone({headers});
    return next.handle(newReq);
  }
}
