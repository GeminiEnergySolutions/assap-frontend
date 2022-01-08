import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ParseCredentialService {
  #appId = localStorage.getItem('parse/appId');
  #masterKey = localStorage.getItem('parse/masterKey');
  #url = new BehaviorSubject<string>(localStorage.getItem('parse/url') || '');
  #sessionToken = localStorage.getItem('parse/sessionToken');

  get appId(): string {
    return this.#appId || '';
  }

  set appId(value: string) {
    this.#appId = value;
    localStorage.setItem('parse/appId', value);
  }

  get masterKey(): string {
    return this.#masterKey || '';
  }

  set masterKey(value: string) {
    this.#masterKey = value;
    localStorage.setItem('parse/masterKey', value);
  }

  get sessionToken(): string {
    return this.#sessionToken || '';
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
