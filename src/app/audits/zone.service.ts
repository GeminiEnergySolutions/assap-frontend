import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {mapTo} from 'rxjs/operators';
import {AuditService} from './audit.service';
import {Audit, Zone} from './model/audit.interface';

@Injectable()
export class ZoneService {

  constructor(
    private auditService: AuditService,
  ) {
  }

  create(audit: Audit, dto: Partial<Zone>): Observable<Zone> {
    const {id, mod} = this.auditService.randomIdAndMod();
    const zone: Zone = {
      id,
      mod,
      usn: 0,
      name: '',
      typeId: [],
      ...dto,
    };
    return this.auditService.update(audit.objectId, {
      [`zone.${id}`]: zone,
    }).pipe(
      mapTo(zone),
    );
  }

  update(audit: Audit, zoneId: Zone['id'], update: Partial<Zone>): Observable<void> {
    const updateAudit = {};
    for (const [key, value] of Object.entries(update)) {
      updateAudit[`zone.${zoneId}.${key}`] = value;
    }
    return this.auditService.update(audit.objectId, updateAudit);
  }

  delete(audit: Audit, {id, typeId}: Pick<Zone, 'id' | 'typeId'>): Observable<void> {
    const update = {
      [`zone.${id}`]: {__op: 'Delete'},
    };
    for (const id of typeId) {
      update[`type.${id}`] = {__op: 'Delete'};
    }
    return this.auditService.update(audit.objectId, update);
  }
}
