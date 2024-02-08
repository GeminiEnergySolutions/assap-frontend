export interface PreAuditDataResponse {
  message: string;
  data: PreAuditData;
}

export interface PreAuditData {
  id: number;
  auditId: number;
  data: Record<string, string | number | boolean>;
  required?: null;
}

export type CreatePreAuditData = Omit<PreAuditData, 'id'>;
