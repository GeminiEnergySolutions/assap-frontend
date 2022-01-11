import {HttpEvent, HttpHandler, HttpHeaders, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {ParseCredentialService} from './parse-credential.service';
import {ParseCredentials} from './parse-credentials';

@Injectable()
export class ParseInterceptor implements HttpInterceptor {
  constructor(
    private parseCredentialService: ParseCredentialService,
  ) {
  }

  buildHeaders(headers: HttpHeaders, credentials: ParseCredentials): HttpHeaders {
    const {appId, masterKey, sessionToken} = credentials;
    if (appId && !headers.has('X-Parse-Application-Id')) {
      headers = headers.set('X-Parse-Application-Id', appId);
    }
    if (masterKey && !headers.has('X-Parse-Master-Key')) {
      headers = headers.set('X-Parse-Master-Key', masterKey);
    }
    if (sessionToken && !headers.has('X-Parse-Session-Token')) {
      headers = headers.set('X-Parse-Session-Token', sessionToken);
    }
    return headers;
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const credentials = this.parseCredentialService.credentials;
    if (!credentials) {
      return next.handle(req);
    }

    const {url} = credentials;
    if (!req.url.startsWith(url)) {
      return next.handle(req);
    }

    const headers = this.buildHeaders(req.headers, credentials);
    const newReq = req.clone({headers});
    return next.handle(newReq);
  }
}
