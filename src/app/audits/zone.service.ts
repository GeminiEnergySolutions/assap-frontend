import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {map, mapTo} from 'rxjs/operators';
import {AuditService} from './audit.service';
import {IdService} from './id.service';
import {AuditIdDto, Zone} from './model/audit.interface';

@Injectable()
export class ZoneService {

  constructor(
    private idService: IdService,
    private auditService: AuditService,
  ) {
  }

  get(audit: AuditIdDto, zoneId: Zone['id']): Observable<Zone> {
    return this.auditService.findOne(audit.auditId).pipe(
      map(audit => audit?.zone[zoneId]!),
    );
  }

  getAll(audit: AuditIdDto): Observable<Zone[]> {
    return this.auditService.findOne(audit.auditId).pipe(
      map(audit => audit ? Object.values(audit.zone) : []),
    );
  }

  create(audit: AuditIdDto, dto: Partial<Zone>): Observable<Zone> {
    const {id, mod} = this.idService.randomIdAndMod();
    const zone: Zone = {
      id,
      mod,
      usn: 0,
      name: '',
      typeId: [],
      ...dto,
    };
    return this.auditService.update(audit, {[`zone.${id}`]: zone}, audit => audit.zone[id] = zone).pipe(
      mapTo(zone),
    );
  }

  update(audit: AuditIdDto, zoneId: Zone['id'], update: Partial<Zone>): Observable<void> {
    const updateAudit: any = {};
    for (const [key, value] of Object.entries(update)) {
      updateAudit[`zone.${zoneId}.${key}`] = value;
    }
    return this.auditService.update(audit, updateAudit, audit => Object.assign(audit.zone[zoneId], update));
  }

  delete(audit: AuditIdDto, {id, typeId}: Pick<Zone, 'id' | 'typeId'>): Observable<void> {
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
    });
  }
}
