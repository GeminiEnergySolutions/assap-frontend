export type ReportType = 'energy_audit' | 'feasibility' | 'microgrid' | '10';

export interface Report {
  type: ReportType;
  auditId: number;

  // TODO
}

export interface CreateReportDto {
  auditId: number;
  type: ReportType;

  // if set, the backend will provide an upload URL
  file?: string;
}

export interface UpdateReportDto {
  upload_status: 'uploaded' | 'failed';
}

export interface FilterReportsDto {
  auditId?: number;
  type?: ReportType;

  // pagination
  pageNo?: number;
  size?: number;
}


