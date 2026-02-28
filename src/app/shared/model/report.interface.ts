import {User} from './user.interface';

export type ReportType = 'energy_audit' | 'feasibility' | 'microgrid' | '10';

export interface Report {
  id: number;
  createdOn: string; // Date
  updatedOn: string; // Date
  file?: string; // S3 download URL
  type: ReportType;
  upload_status: 'uploaded' | 'failed' | 'pending';
  auditId: number;
  createdBy: number;
  user?: User;
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


