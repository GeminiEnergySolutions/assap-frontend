import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {mapTo} from 'rxjs/operators';
import {ParseObject} from '../parse/parse-object.interface';
import {ParseService} from '../parse/parse.service';
import {IdService} from './id.service';
import {Audit} from './model/audit.interface';

@Injectable()
export class ParseAuditService {

  constructor(
    private idService: IdService,
    private parseService: ParseService,
  ) {
  }

  findAll(filter: Partial<Audit> = {}): Observable<Audit[]> {
    return this.parseService.findAll<Audit>(`rAudit`, filter);
  }

  create(dto: Omit<Audit, keyof ParseObject | 'auditId' | 'mod' | 'usn'>): Observable<Audit> {
    const {id, mod} = this.idService.randomIdAndMod();
    const audit: Omit<Audit, keyof ParseObject> = {
      auditId: id.toString(),
      mod: mod.toString(),
      usn: 0,
      ...dto,
    };
    return this.parseService.create<Audit>('rAudit', audit);
  }

  update(objectId: string, audit: Partial<Audit>): Observable<void> {
    return this.parseService.update('rAudit', objectId, audit).pipe(mapTo(undefined));
  }

  updateMany(objectId: string, updates: Partial<Audit>[]): Observable<void> {
    return this.parseService.batch(updates.map(update => ({
      method: 'PUT',
      path: `/classes/rAudit/${objectId}`,
      body: update,
    }))).pipe(mapTo(undefined));
  }

  delete({objectId}: Pick<Audit, 'objectId'>): Observable<void> {
    return this.parseService.delete('rAudit', objectId);
  }
}
