import {Injectable} from '@angular/core';
import {Audit} from './model/audit.interface';

@Injectable()
export class OfflineAuditService {

  constructor() {
  }

  findAll(filter?: Partial<Audit>): Audit[] {
    const result: Audit[] = [];

    outer: for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (!key.startsWith('audits/')) {
        continue;
      }

      const value = localStorage.getItem(key);
      const audit = JSON.parse(value);

      if (filter) {
        for (const filterKey of Object.keys(filter)) {
          const filterValue = filter[filterKey];
          if (audit[filterKey] !== filterValue) {
            continue outer;
          }
        }
      }

      result.push(audit);
    }

    return result;
  }

  findOne(auditId: string): Audit | undefined {
    const value = localStorage.getItem(`audits/${auditId}`);
    if (!value) {
      return undefined;
    }

    return JSON.parse(value);
  }

  save(audit: Audit): void {
    localStorage.setItem(`audits/${audit.auditId}`, JSON.stringify(audit));
  }

  delete({auditId}: Pick<Audit, 'auditId'>): void {
    localStorage.removeItem(`audits/${auditId}`);
  }
}
