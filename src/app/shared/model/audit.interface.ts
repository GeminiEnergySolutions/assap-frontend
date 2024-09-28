import {PreAuditData} from './pre-audit-data.interface';
import {User} from "./user.interface";

export interface Audit {
  auditId: number;
  auditCreatedOn: string;
  auditName: string;
  cehStatus: boolean;
  grantStatus: boolean;
  deleteStatus: false;
  userId: number;
  user?: User;
  stateId?: number;
  pre_audit_form: PreAuditData;
}

export type AuditDetails = Record<'KitchenEquipment' | 'Refrigeration' | 'Lighting' | 'WaterHeater' | 'HVAC', {
  id: number;
  equipment_list: {
    id: number;
    zoneId: number;
    name: string;
  }[];
}>;
