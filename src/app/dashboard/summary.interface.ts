import {Audit} from '../shared/model/audit.interface';

export interface SummaryData {
  'GHG_emissions_savings': number;
  'kBTU_per_year_savings': number;
  'cost_per_year_savings': number;
}

export interface SummaryResult extends SummaryData {
  'stateId': number;
  'state_name': string;
  'included_audits': SummaryAudit[];
  'excluded_audits': SummaryAudit[];
}

export type SummaryAudit = Pick<Audit, 'auditId' | 'auditName'> & SummaryData;

export interface AuditSummarizedData {
  Id: number; // sic
  createdOn: string;
  updatedOn: string;
  auditId: number;
  stateId: number;
  data: SummaryData;
}
