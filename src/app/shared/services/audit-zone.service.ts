import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {environment} from 'src/environments/environment.prod';
import {CreateZoneData, CreateZoneDto, UpdateZoneDto, Zone, ZoneData} from '../model/zone.interface';
import {Response} from '../model/response.interface';

@Injectable({
  providedIn: 'root',
})
export class AuditZoneService {
  constructor(
    private http: HttpClient,
  ) {
  }

  getSingleZone(auditId: number, zoneId: number): Observable<Response<Zone>> {
    return this.http.get<Response<Zone>>(`${environment.url}api/audit/${auditId}/zone/${zoneId}`);
  }

  getAllAuditZone(auditId: number): Observable<Response<Zone[]>> {
    return this.http.get<Response<Zone[]>>(`${environment.url}api/audit/${auditId}/zone`);
  }

  createAuditZone(dto: CreateZoneDto): Observable<Response<Zone>> {
    return this.http.post<Response<Zone>>(`${environment.url}api/audit/${dto.auditId}/zone`, dto);
  }

  updateAuditZone(auditId: number, zoneId: number, data: UpdateZoneDto): Observable<Response<Zone>> {
    return this.http.put<Response<Zone>>(`${environment.url}api/audit/${auditId}/zone/${zoneId}`, data);
  }

  duplicateAuditZone(auditId: number, zoneId: number, count: number): Observable<Response<Zone[]>> {
    return this.http.post<Response<Zone[]>>(`${environment.url}api/audit/${auditId}/zone/${zoneId}/duplicate`, {
      countDuplicate: count,
    });
  }

  deleteAuditZone(auditId: number, zoneId: number): Observable<Response> {
    return this.http.delete<Response>(`${(environment.url)}api/audit/${auditId}/zone/${zoneId}`);
  }

  getZoneData(zoneId: number): Observable<Response<ZoneData>> {
    return this.http.get<Response<ZoneData>>(`${environment.url}api/formData/zone/${zoneId}`);
  }

  createZoneData(zoneId: number, formData: CreateZoneData): Observable<Response<ZoneData>> {
    return this.http.post<Response<ZoneData>>(`${environment.url}api/formData/zone/${zoneId}`, formData);
  }

  updateZoneData(zoneId: number, formData: ZoneData): Observable<Response<ZoneData>> {
    return this.http.put<Response<ZoneData>>(`${environment.url}api/formData/zone/${zoneId}`, formData);
  }
}
