import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {environment} from 'src/environments/environment.prod';
import {CreatePreAuditData, PreAuditData, PreAuditDataResponse} from '../model/pre-audit-data.interface';
import {SchemaResponse, SchemaSection} from '../model/schema.interface';
import {Audit, AuditDetails} from '../model/audit.interface';
import {CreateZoneData, ZoneData, ZoneDataResponse} from '../model/zone.interface';
import {PercentageCompletion} from '../model/percentage-completion.interface';
import {Photo} from '../model/photo.interface';
import {DataCollector} from '../model/data-collector.interface';

export type PercentageQuery =
  | { percentageType: 'complete', auditId: number }
  | { percentageType: 'preaudit', auditId: number }
  | { percentageType: 'ceh', auditId: number }
  | { percentageType: 'grants', auditId: number }
  | { percentageType: 'equipment', zoneId: number, equipmentId: number }
  | { percentageType: 'form', zoneId: number, subTypeId: number }
  | { percentageType: 'zone', auditId: number }
  | { percentageType: 'zone', zoneId: number }
  | { percentageType: 'zoneDetails', auditId: number, zoneId: number }

@Injectable({
  providedIn: 'root',
})
export class AuditService {
  rootUrl = environment.url;

  equipmentHeadingValue: string = '';
  currentProgress?: PercentageCompletion;

  constructor(
    private http: HttpClient,
  ) {
  }

  getPercentage(params: PercentageQuery): Observable<PercentageCompletion> {
    return this.http.get<PercentageCompletion>(`${this.rootUrl}api/percentageCompletion`, {
      params,
    });
  }

  dataCollectors(auditId: number): Observable<DataCollector[]> {
    return this.http.get<DataCollector[]>(`${this.rootUrl}authApi/v1/data-collectors?auditId=${auditId}`);
  }
  assignAudits(data: { auditId: number; dataCollectorId: number }[]):Observable<any> {
    return this.http.post(`${this.rootUrl}api/assign/`,data);
  }

  getPhotos(auditId: number, pageNo: number, size: number, options?: {
    zoneId?: number;
    equipmentId?: number,
    typeId?: number
  }): Observable<{
    data: {
      photos: Photo[];
      count_total_photos: number;
    }
  }> {
    return this.http.get<any>(`${this.rootUrl}api/auditPhoto`, {
      params: {
        auditId,
        pageNo,
        size,
        ...Object.fromEntries(Object.entries(options ?? {}).filter(([_, v]) => v !== undefined)),
      },
    });
  }
  deletePhoto(id: number): Observable<any> {
    return this.http.delete(`${this.rootUrl}api/auditPhoto`, {params: {id}});
  }
  uploadPhoto(auditId: Number, formData: any): Observable<any> {
    return this.http.post(`${this.rootUrl}api/auditPhoto?auditId=${auditId}`, formData);
  }

  getSingleAudit(auditId: number): Observable<{ data: Audit }> {
    return this.http.get<{ data: Audit }>(`${this.rootUrl}api/audit?auditId=${auditId}`);
  }
  getAllAudit(): Observable<{ data: Audit[] }> {
    return this.http.get<{ data: Audit[] }>(`${this.rootUrl}api/audit`);
  }
  createAudit(data: any): Observable<{ data: Audit }> {
    return this.http.post<{ data: Audit }>(`${this.rootUrl}api/audit`, data);
  }
  updateAudit(data: any): Observable<any> {
    return this.http.put(`${this.rootUrl}api/audit?auditId=${data.auditId}`, data);
  }
  deleteAudit(id: number): Observable<any> {
    return this.http.delete(`${this.rootUrl}api/audit?auditId=${id}`);
  }

  getAuditDetails(id: number): Observable<{ data: AuditDetails }> {
    return this.http.get<{ data: AuditDetails }>(`${this.rootUrl}api/auditDetail/${id}`);
  }

  getAllDataCollectorAudit(): Observable<Audit[]> {
    return this.http.get<Audit[]>(`${this.rootUrl}api/dataCollectorAudits`);
  }

  getGrantsData(auditId: number): Observable<any> {
    return this.http.get(`${this.rootUrl}api/grantdata/${auditId}/`);
  }
  createGrantsData(auditId: number, formData: any): Observable<any> {
    return this.http.post(`${this.rootUrl}api/grantdata/${auditId}/`, formData);
  }
  updateGrantsData(auditId: number, formData: any): Observable<any> {
    return this.http.put(`${this.rootUrl}api/grantdata/${auditId}/`, formData);
  }
  getGrantsJsonSchema(): Observable<SchemaSection[]> {
    return this.http.get<SchemaSection[]>(`${this.rootUrl}api/grantschema/`);
  }

  getCleanEnergyHubData(auditId: number): Observable<any> {
    return this.http.get(`${this.rootUrl}api/cleanenergyhubdata/${auditId}/`);
  }
  createCleanEnergyHubData(auditId: number, formData: any): Observable<any> {
    return this.http.post(`${this.rootUrl}api/cleanenergyhubdata/${auditId}/`, formData);
  }
  updateCleanEnergyHubData(auditId: number, formData: any): Observable<any> {
    return this.http.put(`${this.rootUrl}api/cleanenergyhubdata/${auditId}/`, formData);
  }
  getCleanEnergyHubJsonSchema(): Observable<SchemaSection[]> {
    return this.http.get<SchemaSection[]>(`${this.rootUrl}api/cleanenergyhubschema/`);
  }

  getPreAuditJsonSchema(): Observable<SchemaResponse> {
    return this.http.get<SchemaResponse>(`${this.rootUrl}api/preAuditSchema/`);
  }
  getPreAuditData(auditId: number): Observable<PreAuditDataResponse> {
    return this.http.get<PreAuditDataResponse>(`${this.rootUrl}api/preAuditFormData/${auditId}/`);
  }
  createPreAuditData(auditId: number, formData: CreatePreAuditData): Observable<PreAuditDataResponse> {
    return this.http.post<PreAuditDataResponse>(`${this.rootUrl}api/preAuditFormData/${auditId}/`, formData);
  }
  updatePreAuditData(auditId: number, formData: PreAuditData): Observable<PreAuditDataResponse> {
    return this.http.put<PreAuditDataResponse>(`${this.rootUrl}api/preAuditFormData/${auditId}/`, formData);
  }

  getZoneJsonSchema(): Observable<SchemaResponse> {
    return this.http.get<SchemaResponse>(`${this.rootUrl}api/zoneSchema/`);
  }
  getZoneData(zoneId: number): Observable<ZoneDataResponse> {
    return this.http.get<ZoneDataResponse>(`${this.rootUrl}api/zoneFormData/${zoneId}/`);
  }
  createZoneData(zoneId: number, formData: CreateZoneData): Observable<ZoneDataResponse> {
    return this.http.post<ZoneDataResponse>(`${this.rootUrl}api/zoneFormData/${zoneId}/`, formData);
  }
  updateZoneData(zoneId: number, formData: ZoneData): Observable<ZoneDataResponse> {
    return this.http.put<ZoneDataResponse>(`${this.rootUrl}api/zoneFormData/${zoneId}/`, formData);
  }
}
