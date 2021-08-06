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
      if (!key.startsWith('audits/') || key.indexOf('/', 'audits/'.length) >= 0) {
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
    this.delete(audit);
    audit.pendingChanges = 0;
    localStorage.setItem(`audits/${audit.auditId}`, JSON.stringify(audit));
  }

  update(audit: Audit, delta?: Partial<Audit>, apply?: (a: Audit) => Audit): Audit | undefined {
    const key = `audits/${audit.auditId}`;
    const value = localStorage.getItem(key);
    if (!value) {
      // not saved offline
      return undefined;
    }

    const applied = apply(audit);
    applied.pendingChanges = (applied.pendingChanges || 0) + (delta ? 1 : 0);
    localStorage.setItem(key, JSON.stringify(applied));

    if (delta) {
      const deltaKey = `audits/${applied.auditId}/delta/${+new Date()}`;
      localStorage.setItem(deltaKey, JSON.stringify(delta));
    }

    return applied;
  }

  delete(audit: Pick<Audit, 'auditId' | 'pendingChanges'>): void {
    const prefix = 'audits/' + audit.auditId;
    for (let i = localStorage.length - 1; i >= 0; i--) {
      const key = localStorage.key(i);
      if (key.startsWith(prefix)) {
        localStorage.removeItem(key);
      }
    }
    delete audit.pendingChanges;
  }
}
