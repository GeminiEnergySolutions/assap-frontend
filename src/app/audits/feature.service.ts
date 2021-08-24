import {Injectable} from '@angular/core';
import {Data} from '@angular/router';
import {Observable, of} from 'rxjs';
import {map, mapTo} from 'rxjs/operators';
import {ParseObject} from '../parse/parse-object.interface';
import {ParseService} from '../parse/parse.service';
import {Feature, FeatureData} from './model/feature.interface';
import {OfflineAuditService} from './offline-audit.service';
import {OfflineFeatureService} from './offline-feature.service';
import {ParseFeatureService} from './parse-feature.service';

@Injectable()
export class FeatureService {

  constructor(
    private parseService: ParseService,
    private parseFeatureService: ParseFeatureService,
    private offlineFeatureService: OfflineFeatureService,
    private offlineAuditService: OfflineAuditService,
  ) {
  }

  findAll<K extends keyof Feature = keyof Feature>(filter: Partial<Feature> = {}, keys?: readonly K[]): Observable<Pick<Feature, K>[]> {
    const offline = this.offlineFeatureService.findAll(filter);
    if (offline.length >= 0) {
      return of(offline);
    }
    return this.parseFeatureService.findAll<K>(filter, keys);
  }

  saveAll(filter: Partial<Feature>) {
    this.parseFeatureService.findAll(filter).subscribe(features => {
      for (const feature of features) {
        this.offlineFeatureService.save(feature);
      }
    });
  }

  create(feature: Omit<Feature, keyof ParseObject>): Observable<Feature> {
    if (this.offlineAuditService.findOne(feature.auditId)) {
      const objectId = (parseInt('local', 36) + Math.random()).toString(36);
      const timestamp = new Date().toJSON();
      const result: Feature = {
        objectId,
        createdAt: timestamp,
        updatedAt: timestamp,
        ...feature,
      }
      this.offlineFeatureService.save(result);
      return of(result);
    }
    return this.parseFeatureService.create(feature);
  }

  update(feature: Feature, delta: Partial<Feature>): Observable<Feature> {
    const offline = this.offlineFeatureService.update(feature, delta);
    if (offline) {
      return of(offline);
    }
    return this.parseFeatureService.update(feature.objectId, delta).pipe(mapTo({...feature, ...delta}));
  }

  upload(filter: Partial<Feature>): Observable<void> {
    const features = this.offlineFeatureService.findAll(filter);
    return this.parseService.batch(features.map(f => {
      const {objectId, createdAt, updatedAt, ...body} = f;
      if (objectId.startsWith('local.')) {
        return {
          path: '/classes/rFeature',
          method: 'POST',
          body,
        };
      } else {
        return {
          path: `/classes/rFeature/${objectId}`,
          method: 'PUT',
          body,
        };
      }
    })).pipe(map(results => {
      for (let i = 0; i < results.length; i++) {
        const result = results[i];
        const feature = features[i];
        if ('error' in result) {
          continue;
        }

        const success = result.success;
        if ('objectId' in success) {
          feature.objectId = success.objectId;
        }
        if ('createdAt' in success) {
          feature.createdAt = success.createdAt;
        }
        if ('updatedAt' in success) {
          feature.updatedAt = success.updatedAt;
        }

        this.offlineFeatureService.save(feature);
      }
      return undefined;
    }));
  }

  delete(feature: Feature): Observable<void> {
    return this.parseFeatureService.delete(feature.objectId);
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
