import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {map, mapTo} from 'rxjs/operators';
import {AuditService} from './audit.service';
import {IdService} from './id.service';
import {AuditIdDto, Type, Zone} from './model/audit.interface';

@Injectable()
export class TypeService {

  constructor(
    private idService: IdService,
    private auditService: AuditService,
  ) {
  }

  get(auditId: string, zoneId: Zone['id'], typeId: Type['id']): Observable<Type> {
    return this.auditService.findOne(auditId, ['type']).pipe(
      map(audit => audit?.type[typeId]!),
    );
  }

  getAll(auditId: string, zoneId: Zone['id']): Observable<Type[]> {
    return this.auditService.findOne(auditId, ['zone', 'type']).pipe(
      map(audit => audit ? audit.zone[zoneId].typeId.map(t => audit.type[t]) : []),
    );
  }

  create(audit: AuditIdDto, zoneId: Zone['id'], dto: Omit<Type, 'id' | 'mod' | 'usn' | 'zoneId'>): Observable<Type> {
    const {id, mod} = this.idService.randomIdAndMod();
    const type: Type = {
      id,
      mod,
      usn: 0,
      zoneId,
      ...dto,
    };
    return this.auditService.update(audit, {
      [`type.${id}`]: type,
      [`zone.${zoneId}.typeId`]: {__op: 'AddUnique', 'objects': [id]},
    }, audit => {
      audit.type[id] = type;
      audit.zone[zoneId].typeId.push(id);
    }).pipe(mapTo(type));
  }

  update(audit: AuditIdDto, typeId: Type['id'], update: Partial<Type>): Observable<void> {
    const updateAudit: any = {};
    for (const [key, value] of Object.entries(update)) {
      updateAudit[`type.${typeId}.${key}`] = value;
    }
    return this.auditService.update(audit, updateAudit, audit => Object.assign(audit.type[typeId], update));
  }

  delete(audit: AuditIdDto, zoneId: Type['zoneId'], typeId: Type['id']): Observable<void> {
    return this.auditService.update(audit, {
      [`type.${typeId}`]: {__op: 'Delete'},
      [`zone.${zoneId}.typeId`]: {__op: 'Remove', objects: [typeId]},
    }, audit => {
      delete audit.type[typeId];
      const zone = audit.zone[zoneId];
      const index = zone.typeId.indexOf(typeId);
      if (index >= 0) {
        zone.typeId.splice(index, 1);
      }
    });
  }
}
