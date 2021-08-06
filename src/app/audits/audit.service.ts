import {Injectable} from '@angular/core';
import {Observable, of} from 'rxjs';
import {catchError, map} from 'rxjs/operators';
import {ParseObject} from '../parse/parse-object.interface';
import {Audit} from './model/audit.interface';
import {OfflineAuditService} from './offline-audit.service';
import {ParseAuditService} from './parse-audit.service';

@Injectable()
export class AuditService {

  constructor(
    private offlineAuditService: OfflineAuditService,
    private parseAuditService: ParseAuditService,
  ) {
  }

  findAll(filter: Partial<Audit> = {}): Observable<Audit[]> {
    const offlineAudits = this.offlineAuditService.findAll(filter);
    return this.parseAuditService.findAll(filter).pipe(
      catchError(() => of([])),
      map(parseAudits => this.merge([...parseAudits, ...offlineAudits])),
    );
  }

  findOne(auditId: string): Observable<Audit | undefined> {
    const offlineAudit = this.offlineAuditService.findOne(auditId);
    return this.parseAuditService.findAll({auditId}).pipe(
      catchError(() => of([])),
      map(parseAudits => this.merge(offlineAudit ? [...parseAudits, offlineAudit] : parseAudits)),
      map(audits => audits[0]),
    );
  }

  private merge(audits: Audit[]): Audit[] {
    const auditIds = new Map<string, Audit>();

    for (const audit of audits) {
      const existing = auditIds.get(audit.auditId);
      if (!existing) {
        auditIds.set(audit.auditId, audit);
        continue;
      }

      // in case of conflict, use newest
      if (existing.updatedAt < audit.updatedAt) {
        existing.name = audit.name;
        existing.type = {...existing.type, ...audit.type};
        existing.zone = {...existing.zone, ...audit.zone};
      } else {
        existing.type = {...audit.type, ...existing.type};
        existing.zone = {...audit.zone, ...existing.zone};
      }
    }

    return [...auditIds.values()];
  }

  create(dto: Omit<Audit, keyof ParseObject | 'auditId' | 'mod' | 'usn'>): Observable<Audit> {
    return this.parseAuditService.create(dto);
  }

  update(objectId: string, audit: Partial<Audit>): Observable<void> {
    return this.parseAuditService.update(objectId, audit);
  }

  delete(audit: Pick<Audit, 'objectId' | 'auditId'>): Observable<void> {
    this.offlineAuditService.delete(audit);
    return this.parseAuditService.delete(audit);
  }
}
