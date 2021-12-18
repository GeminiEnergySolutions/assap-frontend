import { Injectable } from '@angular/core';
import {Feature} from './model/feature.interface';

@Injectable()
export class OfflineFeatureService {

  constructor() { }

  findAll(filter: Partial<Feature>): Feature[] {
    if (filter.auditId && !filter.typeId) {
      const key = `audits/${filter.auditId}/features/preaudit`;
      const value = localStorage.getItem(key);
      return value ? [JSON.parse(value)] : [];
    }

    const pattern = new RegExp(`^audits/${filter.auditId || '\\w+'}/features/${filter.typeId || 'preaudit'}$`);
    const result: Feature[] = [];
    outer: for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (!key || !pattern.test(key)) {
        continue;
      }

      const value = localStorage.getItem(key);
      if (!value) {
        continue;
      }

      const feature = JSON.parse(value);
      for (const [filterKey, filterValue] of Object.entries(filter)) {
        if (feature[filterKey] !== filterValue) {
          continue outer;
        }
      }

      result.push(feature);
    }

    return result;
  }

  save(feature: Feature) {
    const key = this.getKey(feature);
    localStorage.setItem(key, JSON.stringify(feature));
  }

  update(feature: Feature, delta: Partial<Feature>): Feature | undefined {
    const key = this.getKey(feature);
    if (!localStorage.getItem(key)) {
      return undefined;
    }

    const updated = {...feature, ...delta};
    localStorage.setItem(key, JSON.stringify(updated));
    return updated;
  }

  private getKey(feature: Feature) {
    return `audits/${feature.auditId}/features/${feature.typeId || 'preaudit'}`;
  }
}
