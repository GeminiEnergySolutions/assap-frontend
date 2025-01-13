import {Audit} from './audit.interface';
import {Zone} from './zone.interface';
import {Equipment, EquipmentCategory, EquipmentType} from './equipment.interface';

export interface Photo {
  id: number;
  photo: string;
  timestamp: string;
  auditId: number;
  audit?: Audit;
  zoneId?: number;
  zone?: Zone;
  equipmentId?: number;
  equipment?: EquipmentCategory;
  typeId?: number;
  type?: EquipmentType;
  subTypeId?: number;
  subType?: Equipment;
}

export interface PhotoQuery {
  auditId: number;
  pageNo: number;
  size: number;
  zoneId?: number;
  equipmentId?: number;
  typeId?: number;
}

export interface PhotoInfo {
  auditId: number;
  zoneId: number;
  equipmentId?: number;
  typeId?: number;
  subTypeId?: number;
}
