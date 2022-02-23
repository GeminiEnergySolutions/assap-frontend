import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {mapTo} from 'rxjs/operators';
import {ParseObject} from '../parse/parse-object.interface';
import {ParseService} from '../parse/parse.service';
import {IdService} from './id.service';
import {Audit, CreateAuditDto, UpdateAuditDto} from './model/audit.interface';

@Injectable()
export class ParseAuditService {

  constructor(
    private idService: IdService,
    private parseService: ParseService,
  ) {
  }

  findAll<K extends keyof Audit>(filter: Partial<Audit> = {}, keys?: K[]): Observable<Pick<Audit, K>[]> {
    return this.parseService.findAll<Audit>(`rAudit`, filter, {keys});
  }

  create(dto: CreateAuditDto): Observable<Audit> {
    const {id, mod} = this.idService.randomIdAndMod();
    const audit: Omit<Audit, keyof ParseObject> = {
      auditId: id.toString(),
      mod: mod.toString(),
      usn: 0,
      ...dto,
    };
    return this.createFromLocal(audit);
  }

  createFromLocal(audit: Omit<Audit, keyof ParseObject>) {
    return this.parseService.create<Audit>('rAudit', audit);
  }

  update(objectId: string, audit: UpdateAuditDto): Observable<void> {
    return this.parseService.update('rAudit', objectId, audit).pipe(mapTo(undefined));
  }

  updateMany(objectId: string, updates: UpdateAuditDto[]): Observable<void> {
    return this.parseService.batch(updates.map(update => ({
      method: 'PUT',
      path: `/classes/rAudit/${objectId}`,
      body: update,
    }))).pipe(mapTo(undefined));
  }

  delete(objectId: string): Observable<void> {
    return this.parseService.delete('rAudit', objectId);
  }
}
