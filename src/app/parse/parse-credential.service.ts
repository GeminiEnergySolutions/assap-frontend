import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';

@Injectable()
export class ParseCredentialService {
  #appId: string;
  #masterKey: string;
  #url = new BehaviorSubject<string>(localStorage.getItem('parse/url') || '');
  #sessionToken: string;

  get appId(): string {
    return this.#appId || localStorage.getItem('parse/appId') || '';
  }

  set appId(value: string) {
    this.#appId = value;
    localStorage.setItem('parse/appId', value);
  }

  get masterKey(): string {
    return this.#masterKey || localStorage.getItem('parse/masterKey') || '';
  }

  set masterKey(value: string) {
    this.#masterKey = value;
    localStorage.setItem('parse/masterKey', value);
  }

  get sessionToken(): string {
    return this.#sessionToken || localStorage.getItem('parse/sessionToken') || '';
  }

  set sessionToken(sessionToken: string) {
    this.#sessionToken = sessionToken;
    localStorage.setItem('parse/sessionToken', sessionToken);
  }

  get url(): string {
    return this.#url.value;
  }

  get url$(): Observable<string> {
    return this.#url;
  }

  set url(value: string) {
    this.#url.next(value);
    localStorage.setItem('parse/url', value);
  }
}
