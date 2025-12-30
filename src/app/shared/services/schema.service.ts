import {HttpClient} from '@angular/common/http';
import {inject, Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {Response} from '../model/response.interface';
import {SchemaSection} from '../model/schema.interface';

export type SchemaKind = 'preAudit' | 'ceh' | 'grants' | 'zone' | `equipment/${number}`;

@Injectable({providedIn: 'root'})
export class SchemaService {
  private http = inject(HttpClient);

  getSchema(kind: SchemaKind): Observable<Response<SchemaSection[]>> {
    return this.http.get<Response<SchemaSection[]>>(`/api/schemas/${kind}`);
  }

  createSchemaSection(kind: SchemaKind, data: SchemaSection): Observable<Response<SchemaSection>> {
    return this.http.post<Response<SchemaSection>>(`/api/schemas/${kind}`, data);
  }

  getSchemaSection(kind: SchemaKind, section: number): Observable<Response<SchemaSection>> {
    return this.http.get<Response<SchemaSection>>(`/api/schemas/${kind}/${section}`);
  }

  updateSchemaSection(kind: SchemaKind, section: number, data: SchemaSection): Observable<Response<SchemaSection>> {
    return this.http.put<Response<SchemaSection>>(`/api/schemas/${kind}/${section}`, data);
  }

  deleteSchemaSection(kind: SchemaKind, section: number): Observable<Response> {
    return this.http.delete<Response>(`/api/schemas/${kind}/${section}`);
  }
}
