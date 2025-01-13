import {SchemaValue} from './schema.interface';

export interface PreAuditData {
  id: number;
  auditId: number;
  data: Record<string, SchemaValue>;
}

export type CreatePreAuditData = Omit<PreAuditData, 'id'>;
