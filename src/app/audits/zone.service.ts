import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {mapTo} from 'rxjs/operators';
import {AuditService} from './audit.service';
import {IdService} from './id.service';
import {Audit, Zone} from './model/audit.interface';

@Injectable()
export class ZoneService {

  constructor(
    private idService: IdService,
    private auditService: AuditService,
  ) {
  }

  create(audit: Audit, dto: Partial<Zone>): Observable<Zone> {
    const {id, mod} = this.idService.randomIdAndMod();
    const zone: Zone = {
      id,
      mod,
      usn: 0,
      name: '',
      typeId: [],
      ...dto,
    };
    return this.auditService.update(audit, {[`zone.${id}`]: zone}, audit => {
      audit.zone[id] = zone;
      return audit;
    }).pipe(
      mapTo(zone),
    );
  }

  update(audit: Audit, zoneId: Zone['id'], update: Partial<Zone>): Observable<Audit> {
    const updateAudit = {};
    for (const [key, value] of Object.entries(update)) {
      updateAudit[`zone.${zoneId}.${key}`] = value;
    }
    return this.auditService.update(audit, updateAudit, audit => {
      Object.assign(audit.zone[zoneId], update);
      return audit;
    });
  }

  delete(audit: Audit, {id, typeId}: Pick<Zone, 'id' | 'typeId'>): Observable<Audit> {
    const update = {
      [`zone.${id}`]: {__op: 'Delete'},
    };
    for (const id of typeId) {
      update[`type.${id}`] = {__op: 'Delete'};
    }
    return this.auditService.update(audit, update, audit => {
      delete audit.zone[id];
      for (const tid of typeId) {
        delete audit.type[tid];
      }
      return audit;
    });
  }
}
