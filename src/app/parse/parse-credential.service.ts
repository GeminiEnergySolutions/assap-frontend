import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {ParseCredentials} from './parse-credentials';

const KEY_PREFIX = 'parse/profiles/';

@Injectable({
  providedIn: 'root',
})
export class ParseCredentialService {
  #activeProfile?: string;
  #credentials = new BehaviorSubject<ParseCredentials | undefined>(undefined);

  constructor() {
    let legacyProfile: ParseCredentials | undefined = undefined;
    for (const property of ['url', 'appId', 'masterKey', 'sessionToken'] as const) {
      const key = 'parse/' + property;
      const value = localStorage.getItem(key);
      if (value) {
        legacyProfile ??= {url: '', appId: ''};
        legacyProfile[property] = value;
        localStorage.removeItem(key);
      }
    }

    if (legacyProfile) {
      this.saveProfile('legacy', legacyProfile);
      this.activeProfile = 'legacy';
    } else {
      const activeId = localStorage.getItem('parse/profile');
      if (activeId) {
        this.#activeProfile = activeId;
        const activeCredentials = this.getProfile(activeId);
        if (activeCredentials) {
          this.#credentials.next(activeCredentials);
        }
      }
    }
  }

  get activeProfile(): string | undefined {
    return this.#activeProfile;
  }

  set activeProfile(id: string | undefined) {
    this.#activeProfile = id;
    if (id) {
      localStorage.setItem('parse/profile', id);
      this.#credentials.next(this.getProfile(id));
    } else {
      localStorage.removeItem('parse/profile');
      this.#credentials.next(undefined);
    }
  }

  getProfile(id: string): ParseCredentials | undefined {
    let value = localStorage.getItem(KEY_PREFIX + id);
    return value ? JSON.parse(value) : undefined;
  }

  getProfiles(): Map<string, ParseCredentials> {
    const profiles = new Map<string, ParseCredentials>();
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (!key || !key.startsWith(KEY_PREFIX)) {
        continue;
      }
      const id = key.substring(KEY_PREFIX.length);
      const value = localStorage.getItem(key);
      if (!value) {
        continue;
      }

      const profile = JSON.parse(value);
      profiles.set(id, profile);
    }
    return profiles;
  }

  saveProfile(id: string, credentials: ParseCredentials) {
    if (id === this.activeProfile) {
      this.#credentials.next(credentials);
    }
    localStorage.setItem(KEY_PREFIX + id, JSON.stringify(credentials));
  }

  deleteProfile(id: string) {
    localStorage.removeItem(KEY_PREFIX + id);
  }

  get credentials(): ParseCredentials | undefined {
    return this.#credentials.value;
  }

  get credentials$(): Observable<ParseCredentials | undefined> {
    return this.#credentials;
  }

  get appId(): string {
    return this.#credentials.value?.appId || '';
  }

  get masterKey(): string {
    return this.#credentials.value?.masterKey || '';
  }

  get sessionToken(): string {
    return this.#credentials.value?.sessionToken || '';
  }

  get url(): string {
    return this.#credentials.value?.url || '';
  }

  get url$(): Observable<string> {
    return this.#credentials.pipe(map(p => p?.url || ''));
  }
}
