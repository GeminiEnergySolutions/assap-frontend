import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {map, mapTo} from 'rxjs/operators';
import {Audit, Type, Zone} from './model/audit.interface';
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

  private randomIdAndMod() {
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

  createZone(audit: Audit, dto: Partial<Zone>): Observable<Zone> {
    const {id, mod} = this.randomIdAndMod();
    const zone: Zone = {
      id,
      mod,
      usn: 0,
      name: '',
      typeId: [],
      ...dto,
    };
    return this.update(audit.objectId, {
      [`zone.${id}`]: zone,
    }).pipe(
      mapTo(zone),
    );
  }

  updateZone(audit: Audit, zoneId: Zone['id'], update: Partial<Zone>): Observable<void> {
    const updateAudit = {};
    for (const [key, value] of Object.entries(update)) {
      updateAudit[`zone.${zoneId}.${key}`] = value;
    }
    return this.update(audit.objectId, updateAudit);
  }

  deleteZone(audit: Audit, { id, typeId }: Pick<Zone, 'id' | 'typeId'>): Observable<void> {
    const update = {
      [`zone.${id}`]: {__op: 'Delete'},
    };
    for (const id of typeId) {
      update[`type.${id}`] = {__op: 'Delete'};
    }
    return this.update(audit.objectId, update);
  }

  createType(audit: Audit, zone: Zone, dto: Omit<Type, 'id' | 'mod' | 'usn' | 'zoneId'>): Observable<Type> {
    const {id, mod} = this.randomIdAndMod();
    const type: Type = {
      id,
      mod,
      usn: 0,
      zoneId: zone.id,
      ...dto,
    };
    return this.update(audit.objectId, {
      [`type.${id}`]: type,
      [`zone.${zone.id}.typeId`]: {__op: 'AddUnique', 'objects': [id]},
    }).pipe(
      mapTo(type),
    );
  }

  updateType(audit: Audit, typeId: Type['id'], update: Partial<Type>): Observable<void> {
    const updateAudit = {};
    for (const [key, value] of Object.entries(update)) {
      updateAudit[`type.${typeId}.${key}`] = value;
    }
    return this.update(audit.objectId, updateAudit);
  }

  deleteType(audit: Audit, zoneId: Type['zoneId'], typeId: Type['id']): Observable<void> {
    return this.update(audit.objectId, {
      [`type.${typeId}`]: {__op: 'Delete'},
      [`zone.${zoneId}.typeId`]: {__op: 'Remove', objects: [typeId]},
    });
  }
}
