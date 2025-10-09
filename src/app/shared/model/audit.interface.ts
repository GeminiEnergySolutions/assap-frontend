import {PreAuditData} from './pre-audit-data.interface';
import {User} from "./user.interface";

export interface Audit {
  auditId: number;
  createdOn: string;
  updatedOn: string;
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

export type CreateAuditDto = Pick<Audit, 'auditName' | 'grantStatus' | 'cehStatus' | 'stateId'>;
export type UpdateAuditDto = Partial<CreateAuditDto> & Pick<Audit, 'auditName'>; // for some reason the auditName is required to update an audit
