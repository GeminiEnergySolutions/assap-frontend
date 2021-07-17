import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {ParseObject} from '../parse/parse-object.interface';
import {ParseService} from '../parse/parse.service';
import {Audit} from './model/audit.interface';

@Injectable()
export class AuditService {

  constructor(
    private parseService: ParseService,
  ) {
  }

  randomIdAndMod() {
    const mod = new Date().valueOf();
    const id = (mod / 1000) | 0;
    return {id, mod};
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

  create(dto: Omit<Audit, keyof ParseObject | 'auditId' | 'mod' | 'usn'>): Observable<Audit> {
    const {id, mod} = this.randomIdAndMod();
    const audit: Omit<Audit, keyof ParseObject> = {
      auditId: id.toString(),
      mod: mod.toString(),
      usn: 0,
      ...dto,
    };
    return this.parseService.create<Audit>('rAudit', audit);
  }

  update(objectId: string, audit: Partial<Audit>): Observable<void> {
    return this.parseService.update('rAudit', objectId, audit);
  }

  delete({objectId}: Pick<Audit, 'objectId'>): Observable<void> {
    return this.parseService.delete('rAudit', objectId);
  }
}
