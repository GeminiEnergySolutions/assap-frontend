/**
 * A single piece of equipment, e.g. a freezer or an LED light.
 */
export interface Equipment {
  id: number;
  name: string;
  auditId: number;
  zoneId: number;
  equipmentId: number;
  typeId: number;
  type: EquipmentType;
}

export type CreateEquipmentDto = Omit<Equipment, 'id' | 'type'>;

/**
 * A special type of equipment, e.g. "LED Lights" or "Walk-In Freezers".
 */
export interface EquipmentType {
  id: number;
  name: string;
  deleteStatus: boolean;
  equipmentId: number;
  equipment: EquipmentCategory;
}
export type CreateEquipmentTypeDto = Pick<EquipmentType, 'name' | 'equipmentId'>;
export type UpdateEquipmentTypeDto = Pick<EquipmentType, 'id' | 'name' | 'equipmentId'>;

/**
 * A category of equipment, e.g. "Refrigeration" or "Lighting".
 */
export interface EquipmentCategory {
  id: number;
  equipmentName: string;
  deleteStatus: boolean;
}

export interface EquipmentFormData {
  id: number;
  auditId: number;
  zoneId: number;
  equipmentId: number;
  typeId: number;
  subTypeId: number;
  data: Record<string, string | number | boolean>;
}
export type CreateEquipmentFormData = Omit<EquipmentFormData, 'id'>;
