import {AuditSummarizedData} from '../../dashboard/summary.interface';
import {PreAuditData} from './pre-audit-data.interface';
import {User} from './user.interface';

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
  audit_summarized_data?: AuditSummarizedData;
}

export type AuditDetails = Record<'KitchenEquipment' | 'Refrigeration' | 'Lighting' | 'WaterHeater' | 'HVAC', {
  id: number;
  equipment_list: EquipmentDetails[];
}>;

export interface EquipmentDetails {
  id: number;
  zoneId: number;
  name: string;

  data?: {
    // HVAC
    // How is thermostat changed for non-business? (No Change/Turned Off/Adjusted)
    thermostat_change?: string;
    // Business Hours Set Point - Heat (F)
    heat_set?: number;
    // Business Hours Set Point - A/C (F)
    cool_set?: number;

    // Lighting
    // Ceiling Type (Drop Ceiling/Dry Wall)
    ceiling_type?: string;
    // Ceiling greater than 12 feet? (Yes/No)
    ceiling_height?: string;
  };
}

export type CreateAuditDto = Pick<Audit, 'auditName' | 'grantStatus' | 'cehStatus' | 'stateId'>;
export type UpdateAuditDto = Partial<CreateAuditDto> & Pick<Audit, 'auditName'>; // for some reason the auditName is required to update an audit
