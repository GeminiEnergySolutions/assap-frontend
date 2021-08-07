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
      if (!pattern.test(key)) {
        continue;
      }

      const value = localStorage.getItem(key);
      const feature = JSON.parse(value);

      for (const filterKey of Object.keys(filter)) {
        if (feature[filterKey] !== filter[filterKey]) {
          continue outer;
        }
      }

      result.push(feature);
    }

    return result;
  }


}
