import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {map, Observable} from 'rxjs';
import {environment} from 'src/environments/environment.prod';
import {CreatePreAuditData, PreAuditData} from '../model/pre-audit-data.interface';
import {Audit, AuditDetails, CreateAuditDto, UpdateAuditDto} from '../model/audit.interface';
import {CreateZoneData, ZoneData} from '../model/zone.interface';
import {PercentageCompletion} from '../model/percentage-completion.interface';
import {Photo} from '../model/photo.interface';
import {Response} from '../model/response.interface';
import {User} from '../model/user.interface';

export type PercentageQuery =
  | { percentageType: 'complete', auditId: number }
  | { percentageType: 'preAudit', auditId: number }
  | { percentageType: 'ceh', auditId: number }
  | { percentageType: 'grants', auditId: number }
  | { percentageType: 'equipment', auditId: number, zoneId: number, equipmentId: number }
  | { percentageType: 'equipmentForm', auditId: number, zoneId: number, subTypeId: number }
  | { percentageType: 'zone', auditId: number }
  | { percentageType: 'zone', auditId: number, zoneId: number }
  | { percentageType: 'zoneDetails', auditId: number, zoneId: number }

export interface PhotoQuery {
  auditId: number;
  pageNo: number;
  size: number;
  zoneId?: number;
  equipmentId?: number;
  typeId?: number;
}

@Injectable({
  providedIn: 'root',
})
export class AuditService {
  rootUrl = environment.url;

  currentProgress?: PercentageCompletion;

  constructor(
    private http: HttpClient,
  ) {
  }

  getPercentage(params: PercentageQuery): Observable<PercentageCompletion> {
    return this.http.get<Response<PercentageCompletion>>(`${this.rootUrl}api/formData/progress`, {
      params,
    }).pipe(map(({data}) => data));
  }

  dataCollectors(auditId: number): Observable<Response<User[]>> {
    return this.http.get<Response<User[]>>(`${this.rootUrl}authApi/v1/audit/${auditId}/dataCollectors/unassigned`);
  }

  assignAudits(data: { auditId: number; dataCollectorId: number }[]): Observable<Response> {
    return this.http.post<Response>(`${this.rootUrl}api/auditAssignment`, data);
  }

  getPhotos(query: PhotoQuery): Observable<Response<{
    photos: Photo[];
    count_total_photos: number;
  }>> {
    const params: Record<string, string | number> = Object.fromEntries(Object.entries(query).filter(([, value]) => value !== undefined));
    return this.http.get<any>(`${this.rootUrl}api/photos`, {params});
  }
  deletePhoto(id: number): Observable<Response> {
    return this.http.delete<Response>(`${this.rootUrl}api/photos`, {params: {id}});
  }
  uploadPhoto(formData: FormData): Observable<Response> {
    return this.http.post<Response>(`${this.rootUrl}api/photos`, formData);
  }

  getSingleAudit(id: number): Observable<Response<Audit>> {
    return this.http.get<Response<Audit>>(`${this.rootUrl}api/audit/${id}`);
  }
  getAllAudit(): Observable<Response<Audit[]>> {
    return this.http.get<Response<Audit[]>>(`${this.rootUrl}api/audit`);
  }
  createAudit(data: CreateAuditDto): Observable<Response<Audit>> {
    return this.http.post<Response<Audit>>(`${this.rootUrl}api/audit`, data);
  }
  updateAudit(id: number, data: UpdateAuditDto): Observable<Response<Audit>> {
    return this.http.put<Response<Audit>>(`${this.rootUrl}api/audit/${id}`, data);
  }
  deleteAudit(id: number): Observable<Response> {
    return this.http.delete<Response>(`${this.rootUrl}api/audit/${id}`);
  }

  getAuditDetails(id: number): Observable<Response<AuditDetails>> {
    return this.http.get<Response<AuditDetails>>(`${this.rootUrl}api/auditDetail/${id}`);
  }

  getAllDataCollectorAudit(): Observable<Response<Audit[]>> {
    return this.http.get<Response<Audit[]>>(`${this.rootUrl}api/audit/dataCollector`);
  }

  getGrantsData(auditId: number): Observable<Response<PreAuditData>> {
    return this.http.get<Response<PreAuditData>>(`${this.rootUrl}api/formData/audit/${auditId}/grants`);
  }
  createGrantsData(auditId: number, formData: CreatePreAuditData): Observable<Response<PreAuditData>> {
    return this.http.post<Response<PreAuditData>>(`${this.rootUrl}api/formData/audit/${auditId}/grants`, formData);
  }
  updateGrantsData(auditId: number, formData: PreAuditData): Observable<Response<PreAuditData>> {
    return this.http.put<Response<PreAuditData>>(`${this.rootUrl}api/formData/audit/${auditId}/grants`, formData);
  }

  getCleanEnergyHubData(auditId: number): Observable<Response<PreAuditData>> {
    return this.http.get<Response<PreAuditData>>(`${this.rootUrl}api/formData/audit/${auditId}/ceh`);
  }
  createCleanEnergyHubData(auditId: number, formData: CreatePreAuditData): Observable<Response<PreAuditData>> {
    return this.http.post<Response<PreAuditData>>(`${this.rootUrl}api/formData/audit/${auditId}/ceh`, formData);
  }
  updateCleanEnergyHubData(auditId: number, formData: PreAuditData): Observable<Response<PreAuditData>> {
    return this.http.put<Response<PreAuditData>>(`${this.rootUrl}api/formData/audit/${auditId}/ceh`, formData);
  }

  getPreAuditData(auditId: number): Observable<Response<PreAuditData>> {
    return this.http.get<Response<PreAuditData>>(`${this.rootUrl}api/formData/audit/${auditId}/preAudit`);
  }
  createPreAuditData(auditId: number, formData: CreatePreAuditData): Observable<Response<PreAuditData>> {
    return this.http.post<Response<PreAuditData>>(`${this.rootUrl}api/formData/audit/${auditId}/preAudit`, formData);
  }
  updatePreAuditData(auditId: number, formData: PreAuditData): Observable<Response<PreAuditData>> {
    return this.http.put<Response<PreAuditData>>(`${this.rootUrl}api/formData/audit/${auditId}/preAudit`, formData);
  }

  getZoneData(zoneId: number): Observable<Response<ZoneData>> {
    return this.http.get<Response<ZoneData>>(`${this.rootUrl}api/formData/zone/${zoneId}`);
  }
  createZoneData(zoneId: number, formData: CreateZoneData): Observable<Response<ZoneData>> {
    return this.http.post<Response<ZoneData>>(`${this.rootUrl}api/formData/zone/${zoneId}`, formData);
  }
  updateZoneData(zoneId: number, formData: ZoneData): Observable<Response<ZoneData>> {
    return this.http.put<Response<ZoneData>>(`${this.rootUrl}api/formData/zone/${zoneId}`, formData);
  }
}
