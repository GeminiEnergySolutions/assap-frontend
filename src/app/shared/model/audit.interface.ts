import {PreAuditData} from './pre-audit-data.interface';
import {UserWithRoleObject} from "./user.interface";

export interface Audit {
  auditId: number;
  auditCreatedOn: string;
  auditName: string;
  deleteStatus: false;
  userId: number;
  user?: UserWithRoleObject;
  pre_audit_form: PreAuditData;
}
