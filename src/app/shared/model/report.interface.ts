import {HttpHeaders} from '@angular/common/http';
import {User} from './user.interface';

export type ReportType = 'energy_audit' | 'feasibility' | 'microgrid' | '10_per_design_prep';

export interface Report {
  id: number;
  createdOn: string; // Date
  updatedOn: string; // Date
  file?: string; // S3 download URL
  head?: string; // presigned S3 HEAD URL
  type: ReportType;
  upload_status: 'uploaded' | 'failed' | 'pending';
  auditId: number;
  createdBy: number;
  user?: User;

  _headers?: HttpHeaders;
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


