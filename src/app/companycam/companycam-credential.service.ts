import {Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class CompanycamCredentialService {
  #apiKey = localStorage.getItem('companycam/apiKey');

  get apiKey(): string {
    return this.#apiKey || '';
  }

  set apiKey(value: string) {
    this.#apiKey = value;
    localStorage.setItem('companycam/apiKey', value);
  }
}
