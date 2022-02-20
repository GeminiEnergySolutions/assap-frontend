import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Observable, throwError} from 'rxjs';
import {map, switchMap} from 'rxjs/operators';
import {ParseCreateResponse, ParseResponse, ParseUpdateResponse} from '../audits/model/parse.interface';
import {ParseCredentialService} from './parse-credential.service';
import {ParseCredentials} from './parse-credentials';
import {ParseObject} from './parse-object.interface';
import {ParseInterceptor} from './parse.interceptor';
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
    private parseInterceptor: ParseInterceptor,
  ) {
  }

  private get url(): string {
    return this.parseCredentialService.url;
  }

  private getOptions(credentials?: ParseCredentials) {
    if (!credentials) {
      return {};
    }
    const headers = this.parseInterceptor.buildHeaders(new HttpHeaders(), credentials);
    return {headers};
  }

  getConfig<T>(credentials = this.parseCredentialService.credentials): Observable<T> {
    if (!credentials) {
      return throwError('Invalid credentials');
    }
    return this.http.get<{ params: T }>(`${credentials.url}/config`, this.getOptions(credentials)).pipe(map(t => t.params));
  }

  getConfig$<T>(): Observable<T> {
    return this.parseCredentialService.credentials$.pipe(switchMap(credentials => this.getConfig<T>(credentials)));
  }

  login(username: string, password: string, credentials = this.parseCredentialService.credentials): Observable<User> {
    return this.http.get<User>(`${credentials?.url}/login`, {
      ...this.getOptions(credentials),
      params: {
        username,
        password,
      },
    });
  }

  getCurrentUser(credentials = this.parseCredentialService.credentials): Observable<User> {
    return this.http.get<User>(`${credentials?.url}/users/me`, this.getOptions(credentials));
  }

  logout(credentials = this.parseCredentialService.credentials): Observable<void> {
    return this.http.post<void>(`${credentials?.url}/logout`, {}, this.getOptions(credentials));
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

  updateAll<T extends ParseObject>(className: string, filter: Partial<T>, object: any) {
    return this.findAll(className, filter, {keys: ['objectId']}).pipe(switchMap(objects => {
      const requests = objects.map(obj => ({
        method: 'PUT',
        path: `/parse/classes/${className}/${obj.objectId}`,
        body: object,
      }));
      return this.batch(requests);
    }));
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
    }));
  }

  batch(requests: { path: string; method: string, body?: any }[]): Observable<ParseResponse[]> {
    return this.http.post<ParseResponse[]>(`${this.url}/batch`, {requests});
  }
}
