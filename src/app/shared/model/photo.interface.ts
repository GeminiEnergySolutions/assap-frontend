import {Audit} from './audit.interface';
import {Zone} from './zone.interface';
import {Equipment, EquipmentCategory, EquipmentType} from './equipment.interface';

export interface Photo {
  id: number;
  photo: string;
  auditName: Audit;
  zoneId?: number;
  zoneName?: Zone;
  equipmentId?: number;
  equipmentName?: EquipmentCategory;
  typeId?: number;
  typeName?: EquipmentType;
  subTypeId?: number;
  subTypeName?: Equipment;
}
