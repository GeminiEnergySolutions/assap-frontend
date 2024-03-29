import {PreAuditData} from './pre-audit-data.interface';
import {User} from "./user.interface";

export interface Audit {
  auditId: number;
  auditCreatedOn: string;
  auditName: string;
  deleteStatus: false;
  userId: number;
  user?: User;
  pre_audit_form: PreAuditData;
}
