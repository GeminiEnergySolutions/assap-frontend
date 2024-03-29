export interface PreAuditDataResponse {
  message: string;
  data: PreAuditData;
}

export interface PreAuditData {
  id: number;
  auditId: number;
  data: Record<string, string | number | boolean>;
}

export type CreatePreAuditData = Omit<PreAuditData, 'id'>;
