import {Injectable} from '@angular/core';
import {ParseObject} from '../parse/parse-object.interface';
import {IdService} from './id.service';
import {Audit, CreateAuditDto, UpdateAuditDto} from './model/audit.interface';

@Injectable()
export class OfflineAuditService {

  constructor(
    private idService: IdService,
  ) {
  }

  findAll(filter?: Partial<Audit>): Audit[] {
    const result: Audit[] = [];

    outer: for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (!key || !key.startsWith('audits/') || key.indexOf('/', 'audits/'.length) >= 0) {
        continue;
      }

      const value = localStorage.getItem(key);
      if (!value) {
        continue;
      }

      const audit = JSON.parse(value);

      if (filter) {
        for (const [filterKey, filterValue] of Object.entries(filter)) {
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

  getDeltas(auditId: string): Partial<Audit>[] {
    const deltas: Record<string, Partial<Audit>> = {};

    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (!key) {
        continue;
      }

      const match = new RegExp(`^audits/${auditId}/delta/(\d+)$`).exec(key);
      if (!match) {
        continue;
      }

      const [, timestamp] = match;
      const value = localStorage.getItem(key);
      if (!value) {
        continue;
      }

      deltas[timestamp] = JSON.parse(value);
    }

    return Object.entries(deltas)
      .sort((a, b) => +a[0] - +b[0])
      .map(([, delta]) => delta)
      ;
  }

  save(audit: Audit): void {
    this.deleteDeltas(audit);
    localStorage.setItem(`audits/${audit.auditId}`, JSON.stringify(audit));
  }

  create(dto: CreateAuditDto): Audit {
    const {id, mod} = this.idService.randomIdAndMod();
    const timestamp = new Date().toISOString();
    const audit: Audit = {
      ...dto,
      objectId: this.idService.randomObjectId(),
      createdAt: timestamp,
      updatedAt: timestamp,
      auditId: id.toString(),
      mod: mod.toString(),
      usn: 0,
      pendingChanges: 1,
    };
    localStorage.setItem(`audits/${id}`, JSON.stringify(audit));
    return audit;
  }

  update(auditId: string, delta: UpdateAuditDto, apply: (a: Audit) => void): boolean {
    const key = `audits/${auditId}`;
    const value = localStorage.getItem(key);
    if (!value) {
      // not saved offline
      return false;
    }

    const audit = JSON.parse(value);
    apply(audit);
    audit.pendingChanges = (audit.pendingChanges || 0) + (delta ? 1 : 0);
    localStorage.setItem(key, JSON.stringify(audit));

    if (delta && !audit.objectId.startsWith('local.')) {
      const deltaKey = `audits/${audit.auditId}/delta/${+new Date()}`;
      localStorage.setItem(deltaKey, JSON.stringify(delta));
    }

    return true;
  }

  deleteDeltas(audit: Pick<Audit, 'auditId' | 'pendingChanges'>): void {
    this.deleteWithPrefix(`audits/${audit.auditId}/delta`);
    audit.pendingChanges = 0;
  }

  delete(audit: Pick<Audit, 'auditId' | 'pendingChanges'>): void {
    this.deleteWithPrefix(`audits/${audit.auditId}`);
    delete audit.pendingChanges;
  }

  private deleteWithPrefix(prefix: string): void {
    for (let i = localStorage.length - 1; i >= 0; i--) {
      const key = localStorage.key(i);
      if (key && key.startsWith(prefix)) {
        localStorage.removeItem(key);
      }
    }
  }
}
