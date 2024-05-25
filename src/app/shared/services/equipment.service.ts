import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.prod';
import {SchemaSection} from '../model/schema.interface';
import {CreateEquipmentDto, Equipment, EquipmentCategory, EquipmentType} from '../model/equipment.interface';
import {ConnectedZone} from '../model/zone.interface';

@Injectable({
  providedIn: 'root'
})
export class EquipmentService {

  constructor(
    private http: HttpClient,
  ) {
  }

  getEquipmentCategory(id: number): Observable<{ data: EquipmentCategory }> {
    return this.http.get<{ data: EquipmentCategory }>(`${environment.url}api/equipment?equipmentId=${id}`);
  }
  getEquipmentCategories(): Observable<{ data: EquipmentCategory[] }> {
    return this.http.get<{ data: EquipmentCategory[] }>(`${environment.url}api/equipment`);
  }

  /* TODO no idea what this is for
      getSingleEquipmentType(id: Number): Observable<any> {
        return this.http.get(`${environment.url}api/equipmentType?equipmentTypeId=${id}`);
      }
   */
  getEquipmentType(categoryId: number): Observable<{ data: EquipmentType[] }> {
    return this.http.get<{ data: EquipmentType[] }>(`${environment.url}api/equipmentTypesByEquipmentId?equipmentId=${categoryId}`);
  }

  getEquipment(id: number): Observable<Equipment> {
    return this.http.get<Equipment>(`${environment.url}api/equipmentSubType/${id}`);
  }
  getEquipments(zoneId: number, id: number): Observable<Equipment[]> {
    return this.http.get<Equipment[]>(`${environment.url}api/equipmentSubType?zoneId=${zoneId}&equipmentId=${id}`);
  }
  createEquipment(data: CreateEquipmentDto): Observable<Equipment> {
    return this.http.post<Equipment>(`${environment.url}api/equipmentSubType`, data);
  }
  updateEquipment(data: Equipment): Observable<Equipment> {
    return this.http.put<Equipment>(`${environment.url}api/equipmentSubType`, data);
  }
  deleteEquipment(id: number): Observable<{ message: string; }> {
    return this.http.delete<{ message: string; }>(`${environment.url}api/equipmentSubType/${id}`);
  }
  duplicateEquipment(zoneId: number, id: number): Observable<Equipment> {
    return this.http.post<Equipment>(`${environment.url}api/equipmentDuplicate`, {
      zoneId,
      subTypeId: id,
    });
  }

  getEquipmentTypeSchema(typeId: number): Observable<SchemaSection[]> {
    return this.http.get<SchemaSection[]>(`${environment.url}api/schema/type/${typeId}/`);
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
    return this.http.get<{ data: ConnectedZone[] }>(`${environment.url}api/hvaConnectZone?auditId=${auditId}&zoneId=${zoneId}`);
  }

  setConnectedZones(equipmentId: number, zoneIds: number[]) {
    return this.http.post(`${environment.url}api/hvaConnectZone`, {
      subTypeId: equipmentId,
      zoneIds,
    });
  }
}
