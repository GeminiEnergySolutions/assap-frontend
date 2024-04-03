import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.prod';
import {SchemaSection} from '../model/schema.interface';
import {Equipment, EquipmentCategory, EquipmentSubType, EquipmentType} from '../model/equipment.interface';

@Injectable({
  providedIn: 'root'
})
export class EquipmentService {

  rootUrl = environment.url;

  equipmentSubTypeData: any;
  equipment: EquipmentCategory = {
    id: 0,
    equipmentName: '',
    deleteStatus: true,
  };
  equipments: EquipmentCategory[] = [];

  constructor(
    private http: HttpClient,
  ) {
  }

  getEquipmentCategory(id: number): Observable<{ data: EquipmentCategory }> {
    return this.http.get<{ data: EquipmentCategory }>(`${this.rootUrl}api/equipment?equipmentId=${id}`);
  }
  getEquipmentCategories(): Observable<{ data: EquipmentCategory[] }> {
    return this.http.get<{ data: EquipmentCategory[] }>(`${this.rootUrl}api/equipment`);
  }

  /* TODO no idea what this is for
      getSingleEquipmentType(id: Number): Observable<any> {
        return this.http.get(`${this.rootUrl}api/equipmentType?equipmentTypeId=${id}`);
      }
   */
  getEquipmentType(categoryId: number): Observable<{ data: EquipmentType[] }> {
    return this.http.get<{ data: EquipmentType[] }>(`${this.rootUrl}api/equipmentTypesByEquipmentId?equipmentId=${categoryId}`);
  }

  getEquipmentSubTypes(typeId: number): Observable<{ data: EquipmentSubType[] }> {
    return this.http.get<{ data: EquipmentSubType[] }>(`${this.rootUrl}api/equipmentTypeChild/${typeId}/`);
  }

  getEquipment(id: number): Observable<Equipment> {
    return this.http.get<Equipment>(`${this.rootUrl}api/equipmentSubType/${id}`);
  }
  getEquipments(auditId: number, zoneId: number, id: number): Observable<Equipment[]> {
    return this.http.get<Equipment[]>(`${this.rootUrl}api/equipmentSubType?zoneId=${zoneId}&equipmentId=${id}`);
  }
  createEquipment(data: any): Observable<any> {
    return this.http.post(`${this.rootUrl}api/equipmentSubType`, data);
  }
  updateEquipment(data: any): Observable<any> {
    return this.http.put(`${this.rootUrl}api/equipmentSubType`, data);
  }
  deleteEquipment(id: number): Observable<any> {
    return this.http.delete(`${this.rootUrl}api/equipmentSubType/${id}`);
  }

  getEquipmentTypeSchema(typeId: number): Observable<SchemaSection[]> {
    return this.http.get<SchemaSection[]>(`${this.rootUrl}api/schema/type/${typeId}/`);
  }
  getEquipmentFormData(id: number): Observable<any> {
    return this.http.get(`${this.rootUrl}api/equipmentForm?subTypeId=${id}`);
  }
  createEquipmentFormData(equipmentFormData: any): Observable<any> {
    return this.http.post(`${this.rootUrl}api/equipmentForm`, equipmentFormData);
  }
  updateEquipmentFormData(equipmentFormData: any): Observable<any> {
    return this.http.put(`${this.rootUrl}api/equipmentForm`, equipmentFormData);
  }
}
