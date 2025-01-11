import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {map, Observable} from 'rxjs';
import {environment} from 'src/environments/environment.prod';
import {CreatePreAuditData, PreAuditData} from '../model/pre-audit-data.interface';
import {Audit, AuditDetails, CreateAuditDto, UpdateAuditDto} from '../model/audit.interface';
import {PercentageCompletion} from '../model/percentage-completion.interface';
import {Response} from '../model/response.interface';

export type PercentageQuery =
  | { progressType: 'complete', auditId: number }
  | { progressType: 'preAudit', auditId: number }
  | { progressType: 'ceh', auditId: number }
  | { progressType: 'grants', auditId: number }
  | { progressType: 'equipment', auditId: number, zoneId: number, equipmentId: number }
  | { progressType: 'equipmentForm', auditId: number, zoneId: number, subTypeId: number }
  | { progressType: 'zone', auditId: number }
  | { progressType: 'zone', auditId: number, zoneId: number }
  | { progressType: 'zoneDetails', auditId: number, zoneId: number }


@Injectable({
  providedIn: 'root',
})
export class AuditService {
  currentProgress?: PercentageCompletion;

  constructor(
    private http: HttpClient,
  ) {
  }

  getPercentage(params: PercentageQuery): Observable<PercentageCompletion> {
    return this.http.get<Response<PercentageCompletion>>(`${environment.url}api/formData/progress`, {
      params,
    }).pipe(map(({data}) => data));
  }

  getAllDataCollectorAudit(): Observable<Response<Audit[]>> {
    return this.http.get<Response<Audit[]>>(`${environment.url}api/audit/dataCollector`);
  }

  getSingleAudit(id: number): Observable<Response<Audit>> {
    return this.http.get<Response<Audit>>(`${environment.url}api/audit/${id}`);
  }
  getAllAudit(): Observable<Response<Audit[]>> {
    return this.http.get<Response<Audit[]>>(`${environment.url}api/audit`);
  }
  createAudit(data: CreateAuditDto): Observable<Response<Audit>> {
    return this.http.post<Response<Audit>>(`${environment.url}api/audit`, data);
  }
  updateAudit(id: number, data: UpdateAuditDto): Observable<Response<Audit>> {
    return this.http.put<Response<Audit>>(`${environment.url}api/audit/${id}`, data);
  }
  deleteAudit(id: number): Observable<Response> {
    return this.http.delete<Response>(`${environment.url}api/audit/${id}`);
  }

  getAuditDetails(id: number): Observable<Response<AuditDetails>> {
    return this.http.get<Response<AuditDetails>>(`${environment.url}api/audit/${id}/auditDetail`);
  }

  getGrantsData(auditId: number): Observable<Response<PreAuditData>> {
    return this.http.get<Response<PreAuditData>>(`${environment.url}api/formData/audit/${auditId}/grants`);
  }
  createGrantsData(auditId: number, formData: CreatePreAuditData): Observable<Response<PreAuditData>> {
    return this.http.post<Response<PreAuditData>>(`${environment.url}api/formData/audit/${auditId}/grants`, formData);
  }
  updateGrantsData(auditId: number, formData: PreAuditData): Observable<Response<PreAuditData>> {
    return this.http.put<Response<PreAuditData>>(`${environment.url}api/formData/audit/${auditId}/grants`, formData);
  }

  getCleanEnergyHubData(auditId: number): Observable<Response<PreAuditData>> {
    return this.http.get<Response<PreAuditData>>(`${environment.url}api/formData/audit/${auditId}/ceh`);
  }
  createCleanEnergyHubData(auditId: number, formData: CreatePreAuditData): Observable<Response<PreAuditData>> {
    return this.http.post<Response<PreAuditData>>(`${environment.url}api/formData/audit/${auditId}/ceh`, formData);
  }
  updateCleanEnergyHubData(auditId: number, formData: PreAuditData): Observable<Response<PreAuditData>> {
    return this.http.put<Response<PreAuditData>>(`${environment.url}api/formData/audit/${auditId}/ceh`, formData);
  }

  getPreAuditData(auditId: number): Observable<Response<PreAuditData>> {
    return this.http.get<Response<PreAuditData>>(`${environment.url}api/formData/audit/${auditId}/preAudit`);
  }
  createPreAuditData(auditId: number, formData: CreatePreAuditData): Observable<Response<PreAuditData>> {
    return this.http.post<Response<PreAuditData>>(`${environment.url}api/formData/audit/${auditId}/preAudit`, formData);
  }
  updatePreAuditData(auditId: number, formData: PreAuditData): Observable<Response<PreAuditData>> {
    return this.http.put<Response<PreAuditData>>(`${environment.url}api/formData/audit/${auditId}/preAudit`, formData);
  }
}
