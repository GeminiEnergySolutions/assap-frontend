import {Injectable} from '@angular/core';

@Injectable()
export class ParseCredentialService {
  #appId: string;
  #masterKey: string;
  #url: string;

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

  get url(): string {
    return this.#url || localStorage.getItem('parse/url') || '';
  }

  set url(value: string) {
    this.#url = value;
    localStorage.setItem('parse/url', value);
  }
}
