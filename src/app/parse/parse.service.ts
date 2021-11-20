import {HttpClient, HttpParams} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {map, switchMap, tap} from 'rxjs/operators';
import {ParseCreateResponse, ParseResponse, ParseUpdateResponse} from '../audits/model/parse.interface';
import {ParseCredentialService} from './parse-credential.service';
import {ParseObject} from './parse-object.interface';
import {User} from './user.interface';

export interface FindOptions<T> {
  keys?: readonly (keyof T)[];
  limit?: number;
  order?: (keyof T | `-${keyof T & string}`)[];
}

@Injectable()
export class ParseService {
  constructor(
    private http: HttpClient,
    private parseCredentialService: ParseCredentialService,
  ) {
  }

  private get url(): string {
    return this.parseCredentialService.url;
  }

  private _getConfig<T>(url: string): Observable<T> {
    return this.http.get<{ params: T }>(`${url}/config`).pipe(map(t => t.params))
  }

  getConfig<T>(): Observable<T> {
    return this._getConfig(this.parseCredentialService.url);
  }

  getConfig$<T>(): Observable<T> {
    return this.parseCredentialService.url$.pipe(switchMap(url => this._getConfig<T>(url)));
  }

  login(username: string, password: string): Observable<User> {
    return this.http.get<User>(`${this.url}/login`, {
      params: {
        username,
        password,
      },
    }).pipe(tap(user => this.parseCredentialService.sessionToken = user.sessionToken));
  }

  getCurrentUser(): Observable<User> {
    return this.http.get<User>(`${this.url}/users/me`);
  }

  logout(): Observable<void> {
    return this.http.post<void>(`${this.url}/logout`, {}).pipe(tap(() => {
      this.parseCredentialService.sessionToken = '';
    }));
  }

  getUsers(): Observable<User[]> {
    return this.http.get<{ results: User[] }>(`${this.url}/users`).pipe(map(({results}) => results));
  }

  findAll<T>(className: string, where?: any, options: FindOptions<T> = {}): Observable<T[]> {
    const params: Record<string, string> = {};
    where && (params.where = JSON.stringify(where));
    options.keys && (params.keys = options.keys.join(','));
    options.limit && (params.limit = options.limit.toString());
    options.order && (params.order = options.order.join(','));
    return this.http.get<{ results: T[] }>(`${this.url}/classes/${className}`, {params}).pipe(map(r => r.results));
  }

  create<T extends ParseObject>(className: string, object: Omit<T, keyof ParseObject>): Observable<T> {
    return this.http.post<ParseCreateResponse>(`${this.url}/classes/${className}`, object).pipe(
      map(result => ({...object, ...result, updatedAt: result.createdAt} as T)),
    );
  }

  update<T extends ParseObject>(className: string, objectId: string, object: any): Observable<ParseUpdateResponse> {
    return this.http.put<ParseUpdateResponse>(`${this.url}/classes/${className}/${objectId}`, object);
  }

  delete(className: string, objectId: string): Observable<void> {
    return this.http.delete<void>(`${this.url}/classes/${className}/${objectId}`);
  }

  deleteAll<T extends ParseObject>(className: string, filter: Partial<T>) {
    return this.findAll(className, filter, {keys: ['objectId']}).pipe(switchMap(objects => {
      const requests = objects.map(obj => ({
        method: 'DELETE',
        path: `/parse/classes/${className}/${obj.objectId}`,
      }));
      return this.batch(requests);
    }))
  }

  batch(requests: { path: string; method: string, body?: any }[]): Observable<ParseResponse[]> {
    return this.http.post<ParseResponse[]>(`${this.url}/batch`, { requests });
  }
}
