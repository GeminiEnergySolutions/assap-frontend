import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {SchemaResponse, SchemaSection} from '../model/schema.interface';
import {environment} from '../../../environments/environment.prod';
import {HttpClient} from '@angular/common/http';

export type SchemaKind = 'preAudit' | 'ceh' | 'grants' | 'zone' | `equipment/${number}`;

@Injectable({providedIn: 'root'})
export class SchemaService {
  constructor(
    private http: HttpClient,
  ) {
  }

  getSchema(kind: SchemaKind): Observable<SchemaResponse> {
    return this.http.get<SchemaResponse>(`${environment.url}api/schemas/${kind}`);
  }

  createSchemaSection(kind: SchemaKind, data: SchemaSection): Observable<{ data: SchemaSection }> {
    return this.http.post<{ data: SchemaSection }>(`${environment.url}api/schemas/${kind}/`, data);
  }
  getSchemaSection(kind: SchemaKind, section: number): Observable<{ data: SchemaSection }> {
    return this.http.get<{ data: SchemaSection }>(`${environment.url}api/schemas/${kind}/${section}/`);
  }
  updateSchemaSection(kind: SchemaKind, section: number, data: SchemaSection): Observable<{}> {
    return this.http.put<{}>(`${environment.url}api/schemas/${kind}/${section}/`, data);
  }
  deleteSchemaSection(kind: SchemaKind, section: number): Observable<{}> {
    return this.http.delete<{}>(`${environment.url}api/schemas/${kind}/${section}/`);
  }
}
