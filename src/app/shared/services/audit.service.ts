import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ToastService } from '@mean-stream/ngbx';
import { Observable, map, throwError } from 'rxjs';
import { environment } from 'src/environments/environment.prod';
import {CreatePreAuditData, PreAuditData, PreAuditDataResponse} from '../model/pre-audit-data.interface';
import {SchemaResponse, SchemaSection} from '../model/schema.interface';
import {Audit} from '../model/audit.interface';
import {CreateZoneData, ZoneData, ZoneDataResponse} from "../model/zone.interface";
import {PercentageCompletion} from '../model/percentage-completion.interface';

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

  getPercentage(queryParam: any): Observable<PercentageCompletion> {
    return this.http.get<PercentageCompletion>(`${this.rootUrl}api/percentageCompletion${queryParam}`);
  }

  dataCollectors(auditId: number):Observable<any> {
    return this.http.get(`${this.rootUrl}authApi/v1/data-collectors?auditId=${auditId}`);
  }
  assignAudits(data: any[]):Observable<any> {
    return this.http.post(`${this.rootUrl}api/assign/`,data);
  }

  getPhotos(auditId: Number): Observable<any> {
    return this.http.get(`${this.rootUrl}api/auditPhoto?auditId=${auditId}`);
  }
  uploadPhoto(auditId: Number, formData: any): Observable<any> {
    return this.http.post(`${this.rootUrl}api/auditPhoto?auditId=${auditId}`, formData);
  }
  // getPhotosFilter(auditId: Number,equipmentId: Number): Observable<any> {
  //   return this.http.get(`${this.rootUrl}api/equipment_photos/audit/${auditId}/equipmentId/${equipmentId}/`);
  // }

  // uploadEnergyAuditFileData(formData: any): Observable<any> {
  //   return this.http.post(`${this.rootUrl}api/energyauditfile/`, formData);
  // }
  // getCleanEnergyHubFileData(auditId: Number): Observable<any> {
  //   return this.http.get(`${this.rootUrl}api/cleanenergyhubfiles/${auditId}/`);
  // }
  // createCleanEnergyHubFileData(formData: any, auditId: Number): Observable<any> {
  //   return this.http.post(`${this.rootUrl}api/cleanenergyhubfiles/${auditId}/`, formData);
  // }
  // updateCleanEnergyHubFileData(formData: any, auditId: Number): Observable<any> {
  //   return this.http.put(`${this.rootUrl}api/cleanenergyhubfiles/${auditId}/`, formData);
  // }

  // getUtilityInfo(auditId: number) {
  //   return this.http.get(`${this.rootUrl}api/auditutilityinfo/${auditId}/`);
  // }
  // createUtilityInfo(auditId: number, objData: any) {
  //   return this.http.post(
  //     `${this.rootUrl}api/auditutilityinfo/${auditId}/`,
  //     objData
  //   );
  // }
  // updateUtilityInfo(auditId: number, objData: any) {
  //   return this.http.put(
  //     `${this.rootUrl}api/auditutilityinfo/${auditId}/`,
  //     objData
  //   );
  // }

  // auditEnergyReport(auditId: number): Observable<Blob | any> {
  //   return this.http.get(`${this.rootUrl}api/energyAuditReport/${auditId}/`, { observe: 'response', responseType: 'blob' }).pipe(
  //     map((response: any) => {
  //       const contentType = response.headers.get('Content-Type') || '';
  //       const isJsonResponse = contentType.includes('application/json');

  //       if (isJsonResponse) {
  //         const body = JSON.parse(response.body || '{}');
  //         this.toaster.error(body.message || '{}', 'Error');
  //         console.log('end')
  //         return throwError(response.body.message);
  //       } else {
  //         return response.body as Blob;
  //       }
  //     })
  //   );
  // }
  // feasibilityReport(auditId: number): Observable<Blob | any> {
  //   return this.http.get(`${this.rootUrl}api/feasibilityReport/${auditId}/`, { observe: 'response', responseType: 'text' });
  // }
  // cehReport(auditId: number): Observable<any> {
  //   return this.http.get(`${this.rootUrl}api/cehMicrogridSheet/${auditId}/`, { observe: 'response', responseType: 'text' });
  // }

  scrapping(auditId: number): Observable<any> {
    return this.http.get(
      `${this.rootUrl}api/scrapping/${auditId}/`
    );
  }

  auditEnergyReport(auditId: number): Observable<Blob | any> {
    return this.http.get(`${this.rootUrl}api/energyAuditReport/${auditId}/`);
  }
  feasibilityReport(auditId: number): Observable<Blob | any> {
    return this.http.get(`${this.rootUrl}api/feasibilityReport/${auditId}/`);
  }
  cehReport(auditId: number): Observable<any> {
    return this.http.get(`${this.rootUrl}api/cehMicrogridSheet/${auditId}/`);
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
