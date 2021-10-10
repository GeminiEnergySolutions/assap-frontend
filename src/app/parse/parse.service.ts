import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {map, switchMap} from 'rxjs/operators';
import {ParseCredentialService} from './parse-credential.service';
import {ParseObject} from './parse-object.interface';

export interface FindOptions<T> {
  keys?: readonly (keyof T)[];
  limit?: number;
  sort?: (keyof T | `-${keyof T & string}`)[];
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

  findAll<T>(className: string, where?: any, options: FindOptions<T> = {}): Observable<T[]> {
    return this.http.get<{ results: T[] }>(`${this.url}/classes/${className}`, {
      params: {
        where: where ? JSON.stringify(where) : undefined,
        keys: options.keys?.join(','),
        limit: options.limit,
        sort: options.sort?.join(','),
      },
    }).pipe(map(r => r.results));
  }

  create<T extends ParseObject>(className: string, object: Omit<T, keyof ParseObject>): Observable<T> {
    return this.http.post<Pick<T, 'objectId' | 'createdAt'>>(`${this.url}/classes/${className}`, object).pipe(
      map(result => ({...object, ...result, updatedAt: result.createdAt} as T)),
    );
  }

  update<T extends ParseObject>(className: string, objectId: string, object: any): Observable<void> {
    return this.http.put<void>(`${this.url}/classes/${className}/${objectId}`, object);
  }

  delete(className: string, objectId: string): Observable<void> {
    return this.http.delete<void>(`${this.url}/classes/${className}/${objectId}`);
  }

  batch(requests: { path: string; method: string, body?: any }[]): Observable<any> {
    return this.http.post(`${this.url}/batch`, { requests });
  }
}
