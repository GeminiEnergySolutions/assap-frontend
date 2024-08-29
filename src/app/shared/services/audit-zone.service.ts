import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.prod';
import {Zone} from "../model/zone.interface";

@Injectable({
  providedIn: 'root'
})
export class AuditZoneService {

  rootUrl = environment.url;

  constructor(private http: HttpClient,
  ) { }

  getSingleZone(zoneId: number): Observable<{ data: Zone }> {
    return this.http.get<{ data: Zone }>(`${this.rootUrl}api/auditZone?zoneId=${zoneId}`);
  }
  getAllAuditZone(auditId: number): Observable<{ data: Zone[] }> {
    return this.http.get<{ data: Zone[] }>(`${this.rootUrl}api/auditZone?auditId=${auditId}`);
  }
  createAuditZone(data: any, auditId: number): Observable<any> {
    return this.http.post(`${this.rootUrl}api/auditZone?auditId=${auditId}`, data);
  }
  updateAuditZone(data: any, zoneId: number): Observable<any> {
    return this.http.put(`${this.rootUrl}api/auditZone?zoneId=${zoneId}`, data);
  }
  duplicateAuditZone(id: number, count: number): Observable<{ data: Zone[] }> {
    return this.http.post<{ data: Zone[] }>(`${this.rootUrl}api/zoneDuplicate`, {
      zoneId: id,
      countDuplicate: count,
    });
  }
  deleteAuditZone(id: number): Observable<any> {
    return this.http.delete(`${this.rootUrl}api/auditZone?zoneId=${id}`);
  }
}
