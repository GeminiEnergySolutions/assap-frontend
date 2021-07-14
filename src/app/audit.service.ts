import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {map, mapTo} from 'rxjs/operators';
import {Audit, Zone} from './model/audit.interface';
import {ParseObject} from './parse/parse-object.interface';
import {ParseService} from './parse/parse.service';

@Injectable({
  providedIn: 'root',
})
export class AuditService {

  constructor(
    private parseService: ParseService,
  ) {
  }

  findAll(filter: Partial<Audit> = {}): Observable<Audit[]> {
    return this.parseService.findAll<Audit>(`rAudit`, filter).pipe(
      map(v => this.merge(v)),
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

  create(audit: Omit<Audit, keyof ParseObject>): Observable<Audit> {
    return this.parseService.create<Audit>('rAudit', audit);
  }

  update(objectId: string, audit: Partial<Audit>): Observable<void> {
    return this.parseService.update('rAudit', objectId, audit);
  }

  createZone(audit: Audit, dto: Partial<Zone>): Observable<Zone> {
    const zoneId = new Date().valueOf();
    const zone: Zone = {
      id: zoneId,
      mod: zoneId,
      usn: 0,
      name: '',
      typeId: [],
      ...dto,
    };
    return this.update(audit.objectId, {
      [`zone.${zoneId}`]: zone,
    }).pipe(
      mapTo(zone),
    );
  }
}
