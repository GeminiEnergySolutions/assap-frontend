import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {mapTo} from 'rxjs/operators';
import {AuditService} from './audit.service';
import {IdService} from './id.service';
import {Audit, Type, Zone} from './model/audit.interface';

@Injectable()
export class TypeService {

  constructor(
    private idService: IdService,
    private auditService: AuditService,
  ) {
  }

  create(audit: Audit, zone: Zone, dto: Omit<Type, 'id' | 'mod' | 'usn' | 'zoneId'>): Observable<Type> {
    const {id, mod} = this.idService.randomIdAndMod();
    const type: Type = {
      id,
      mod,
      usn: 0,
      zoneId: zone.id,
      ...dto,
    };
    return this.auditService.update(audit.objectId, {
      [`type.${id}`]: type,
      [`zone.${zone.id}.typeId`]: {__op: 'AddUnique', 'objects': [id]},
    }).pipe(
      mapTo(type),
    );
  }

  update(audit: Audit, typeId: Type['id'], update: Partial<Type>): Observable<void> {
    const updateAudit = {};
    for (const [key, value] of Object.entries(update)) {
      updateAudit[`type.${typeId}.${key}`] = value;
    }
    return this.auditService.update(audit.objectId, updateAudit);
  }

  delete(audit: Audit, zoneId: Type['zoneId'], typeId: Type['id']): Observable<void> {
    return this.auditService.update(audit.objectId, {
      [`type.${typeId}`]: {__op: 'Delete'},
      [`zone.${zoneId}.typeId`]: {__op: 'Remove', objects: [typeId]},
    });
  }
}
