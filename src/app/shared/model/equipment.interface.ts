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
  type?: EquipmentType; // undefined if typeChildId is set
  typeChildId?: number | null;
  typeChild?: EquipmentSubType;
}

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

/**
 * A sub-type of equipment, e.g. "Compact Fluorescent" (for the "Fluorescent" lighting type).
 */
export interface EquipmentSubType {
  id: number;
  name: string;
  deleteStatus: boolean;
  typeId: number;
  equipmentType: EquipmentType;
}

/**
 * A category of equipment, e.g. "Refrigeration" or "Lighting".
 */
export interface EquipmentCategory {
  id: number;
  equipmentName: string;
  deleteStatus: boolean;
}
