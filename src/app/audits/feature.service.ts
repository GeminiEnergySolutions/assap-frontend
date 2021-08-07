import {Injectable} from '@angular/core';
import {Data} from '@angular/router';
import {Observable, of} from 'rxjs';
import {ParseObject} from '../parse/parse-object.interface';
import {Feature, FeatureData} from './model/feature.interface';
import {OfflineFeatureService} from './offline-feature.service';
import {ParseFeatureService} from './parse-feature.service';

@Injectable()
export class FeatureService {

  constructor(
    private parseFeatureService: ParseFeatureService,
    private offlineFeatureService: OfflineFeatureService,
  ) {
  }

  findAll<K extends keyof Feature = keyof Feature>(filter: Partial<Feature> = {}, keys?: readonly K[]): Observable<Pick<Feature, K>[]> {
    const offline = this.offlineFeatureService.findAll(filter);
    if (offline.length >= 0) {
      return of(offline);
    }
    return this.parseFeatureService.findAll<K>(filter, keys);
  }

  create(feature: Omit<Feature, keyof ParseObject>): Observable<Feature> {
    return this.parseFeatureService.create(feature);
  }

  update(objectId: string, feature: Partial<Feature>): Observable<void> {
    return this.parseFeatureService.update(objectId, feature);
  }

  delete(objectId: string): Observable<void> {
    return this.parseFeatureService.delete(objectId);
  }

  deleteAll(filter: Partial<Feature> = {}) {
    return this.parseFeatureService.deleteAll(filter);
  }

  feature2Data(feature: Feature): FeatureData {
    const data: Record<string, string> = {};
    const formIds = feature.formId.split('\u001F');
    const values = feature.values.split('\u001F');
    const length = Math.min(formIds.length, values.length);

    for (let i = 0; i < length; i++) {
      data[formIds[i]] = values[i];
    }

    return data;
  }

  data2Feature(data: Data): Partial<Feature> {
    const entries = Object.entries(data);
    const formId = entries.map(e => e[0]).join('\u001F');
    const values = entries.map(e => e[1]).join('\u001F');
    return {
      formId,
      values,
    };
  }
}
