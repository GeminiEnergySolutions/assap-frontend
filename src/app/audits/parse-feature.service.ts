import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {mapTo, switchMap} from 'rxjs/operators';
import {ParseObject} from '../parse/parse-object.interface';
import {ParseService} from '../parse/parse.service';
import {Feature} from './model/feature.interface';

@Injectable()
export class ParseFeatureService {

  constructor(
    private parseService: ParseService,
  ) {
  }

  findAll<K extends keyof Feature = keyof Feature>(filter: Partial<Feature> = {}, keys?: readonly K[]): Observable<Pick<Feature, K>[]> {
    return this.parseService.findAll<Feature>('rFeature', filter, {keys});
  }

  create(feature: Omit<Feature, keyof ParseObject>): Observable<Feature> {
    return this.parseService.create<Feature>('rFeature', feature);
  }

  update(objectId: string, feature: Partial<Feature>): Observable<void> {
    return this.parseService.update('rFeature', objectId, feature).pipe(mapTo(undefined));
  }

  delete(objectId: string): Observable<void> {
    return this.parseService.delete('rFeature', objectId);
  }

  deleteAll(filter: Partial<Feature> = {}) {
    return this.parseService.deleteAll('rFeature', filter);
  }
}
