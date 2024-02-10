import {PreAuditData} from './pre-audit-data.interface';

export interface Audit {
  auditId: number;
  auditCreatedOn: string;
  auditName: string;
  deleteStatus: false;
  userId: number;
  user?: any; // TODO User
  pre_audit_form: PreAuditData;
}
