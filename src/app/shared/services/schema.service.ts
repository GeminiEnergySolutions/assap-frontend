import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Observable, tap} from 'rxjs';
import {environment} from '../../../environments/environment.prod';
import {Response} from '../model/response.interface';
import {SchemaSection} from '../model/schema.interface';

export type SchemaKind = 'preAudit' | 'ceh' | 'grants' | 'zone' | `equipment/${number}`;

@Injectable({providedIn: 'root'})
export class SchemaService {
  constructor(
    private http: HttpClient,
  ) {
  }

  getSchema(kind: SchemaKind): Observable<Response<SchemaSection[]>> {
    return this.http.get<Response<SchemaSection[]>>(`${environment.url}api/schemas/${kind}`).pipe(
      // TODO remove this when backend does the sorting
      tap(res => res.data.sort((a, b) => (a.order ?? 0) - (b.order ?? 0))),
    );
  }

  createSchemaSection(kind: SchemaKind, data: SchemaSection): Observable<Response<SchemaSection>> {
    return this.http.post<Response<SchemaSection>>(`${environment.url}api/schemas/${kind}`, data);
  }

  getSchemaSection(kind: SchemaKind, section: number): Observable<Response<SchemaSection>> {
    return this.http.get<Response<SchemaSection>>(`${environment.url}api/schemas/${kind}/${section}`);
  }

  updateSchemaSection(kind: SchemaKind, section: number, data: SchemaSection): Observable<Response<SchemaSection>> {
    return this.http.put<Response<SchemaSection>>(`${environment.url}api/schemas/${kind}/${section}`, data);
  }

  deleteSchemaSection(kind: SchemaKind, section: number): Observable<Response> {
    return this.http.delete<Response>(`${environment.url}api/schemas/${kind}/${section}`);
  }
}
