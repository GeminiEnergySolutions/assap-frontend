import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {environment} from 'src/environments/environment.prod';
import {CreateEquipmentDto, Equipment, EquipmentCategory, EquipmentType} from '../model/equipment.interface';
import {ConnectedZone} from '../model/zone.interface';
import {Response} from '../model/response.interface';

@Injectable({providedIn: 'root'})
export class EquipmentService {

  constructor(
    private http: HttpClient,
  ) {
  }

  getEquipmentCategory(id: number): Observable<{ data: EquipmentCategory }> {
    return this.http.get<{ data: EquipmentCategory }>(`${environment.url}api/audit/equipment/${id}`);
  }

  getEquipmentCategories(): Observable<{ data: EquipmentCategory[] }> {
    return this.http.get<{ data: EquipmentCategory[] }>(`${environment.url}api/audit/equipment`);
  }

  getEquipmentType(categoryId: number, id: number): Observable<{ data: EquipmentType }> {
    return this.http.get<{ data: EquipmentType }>(`${environment.url}api/equipment/${categoryId}/type/${id}`);
  }

  getEquipmentTypes(categoryId: number): Observable<{ data: EquipmentType[] }> {
    return this.http.get<{ data: EquipmentType[] }>(`${environment.url}api/equipment/${categoryId}/type`);
  }

  getEquipment(zoneId: number, categoryId: number, id: number): Observable<Response<Equipment>> {
    return this.http.get<Response<Equipment>>(`${environment.url}api/zone/${zoneId}/equipment/${categoryId}/subType/${id}`);
  }

  getEquipments(zoneId: number, categoryId: number): Observable<Response<Equipment[]>> {
    return this.http.get<Response<Equipment[]>>(`${environment.url}api/zone/${zoneId}/equipment/${categoryId}/subType`);
  }

  createEquipment(data: CreateEquipmentDto): Observable<Response<Equipment>> {
    return this.http.post<Response<Equipment>>(`${environment.url}api/zone/${data.zoneId}/equipment/${data.equipmentId}/subType`, data);
  }

  updateEquipment(data: Equipment): Observable<Response<Equipment>> {
    return this.http.put<Response<Equipment>>(`${environment.url}api/zone/${data.zoneId}/equipment/${data.equipmentId}/subType/${data.id}`, data);
  }

  deleteEquipment(zoneId: number, categoryId: number, id: number): Observable<Response> {
    return this.http.delete<Response>(`${environment.url}api/zone/${zoneId}/equipment/${categoryId}/subType/${id}`);
  }

  duplicateEquipment(zoneId: number, id: number): Observable<Response<Equipment>> {
    return this.http.post<Response<Equipment>>(`${environment.url}api/equipment/form/duplicate`, {
      zoneId,
      subTypeId: id,
    });
  }

  getEquipmentFormData(id: number): Observable<any> {
    return this.http.get(`${environment.url}api/equipmentForm?subTypeId=${id}`);
  }

  createEquipmentFormData(equipmentFormData: any): Observable<any> {
    return this.http.post(`${environment.url}api/equipmentForm`, equipmentFormData);
  }

  updateEquipmentFormData(equipmentFormData: any): Observable<any> {
    return this.http.put(`${environment.url}api/equipmentForm`, equipmentFormData);
  }

  // HVACs

  getConnectedZones(auditId: number, zoneId: number): Observable<{ data: ConnectedZone[] }> {
    return this.http.get<{
      data: ConnectedZone[]
    }>(`${environment.url}api/hvacConnectZone?auditId=${auditId}&zoneId=${zoneId}`);
  }

  setConnectedZones(equipmentId: number, zoneIds: number[]) {
    return this.http.post(`${environment.url}api/hvacConnectZone`, {
      subTypeId: equipmentId,
      zoneIds,
    });
  }
}
