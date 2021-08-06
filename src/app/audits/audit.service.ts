import {Injectable} from '@angular/core';
import {Observable, of} from 'rxjs';
import {catchError, map, mapTo, tap} from 'rxjs/operators';
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
      map(parseAudits => this.mergeAll([...parseAudits, ...offlineAudits])),
    );
  }

  findOne(auditId: string): Observable<Audit | undefined> {
    const offlineAudit = this.offlineAuditService.findOne(auditId);
    return this.parseAuditService.findAll({auditId}).pipe(
      catchError(() => of([])),
      map(parseAudits => this.mergeAll(offlineAudit ? [...parseAudits, offlineAudit] : parseAudits)),
      map(audits => audits[0]),
    );
  }

  private mergeAll(audits: Audit[]): Audit[] {
    if (audits.length <= 1) {
      return audits;
    }

    const auditIds = new Map<string, Audit>();

    for (const audit of audits) {
      const auditId = audit.auditId;
      const existing = auditIds.get(auditId);
      if (!existing) {
        auditIds.set(auditId, audit);
        continue;
      }

      let merged: Audit;
      // in case of conflict, use newest
      if (existing.updatedAt < audit.updatedAt) {
        merged = this.merge(existing, audit);
      } else {
        merged = this.merge(audit, existing);
      }
      auditIds.set(auditId, merged);
    }

    return [...auditIds.values()];
  }

  private merge(a1: Audit, a2: Audit): Audit {
    return {
      ...a1,
      ...a2,
      type: {...a1.type, ...a2.type},
      zone: {...a1.zone, ...a2.zone},
    };
  }

  create(dto: Omit<Audit, keyof ParseObject | 'auditId' | 'mod' | 'usn'>): Observable<Audit> {
    return this.parseAuditService.create(dto);
  }

  update(audit: Audit, delta: Partial<Audit>, apply: (a: Audit) => Audit): Observable<Audit> {
    const offline = this.offlineAuditService.update(audit, delta, apply);
    if (offline) {
      return of(offline);
    }
    return this.parseAuditService.update(audit.objectId, delta).pipe(mapTo(audit), map(apply));
  }

  upload(audit: Audit): Observable<void> {
    const deltas = this.offlineAuditService.getDeltas(audit.auditId);
    return this.parseAuditService.updateMany(audit.objectId, deltas).pipe(
      tap(() => this.offlineAuditService.deleteDeltas(audit)),
    );
  }

  delete(audit: Pick<Audit, 'objectId' | 'auditId'>): Observable<void> {
    this.offlineAuditService.delete(audit);
    return this.parseAuditService.delete(audit);
  }
}
