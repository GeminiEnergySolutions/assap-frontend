import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {mapTo} from 'rxjs/operators';
import {ParseService} from '../parse/parse.service';
import {CreateFeatureDto, Feature} from './model/feature.interface';

@Injectable()
export class ParseFeatureService {

  constructor(
    private parseService: ParseService,
  ) {
  }

  findAll<K extends keyof Feature = keyof Feature>(filter: Partial<Feature> = {}, keys?: readonly K[]): Observable<Pick<Feature, K>[]> {
    return this.parseService.findAll<Feature>('rFeature', filter, {keys});
  }

  create(feature: CreateFeatureDto): Observable<Feature> {
    return this.parseService.create<Feature>('rFeature', feature);
  }

  update(objectId: string, feature: Partial<Feature>): Observable<void> {
    return this.parseService.update('rFeature', objectId, feature).pipe(mapTo(undefined));
  }

  updateAll(filter: Partial<Feature>, update: Partial<Feature>) {
    return this.parseService.updateAll('rFeature', filter, update);
  }

  delete(objectId: string): Observable<void> {
    return this.parseService.delete('rFeature', objectId);
  }

  deleteAll(filter: Partial<Feature> = {}) {
    return this.parseService.deleteAll('rFeature', filter);
  }
}
