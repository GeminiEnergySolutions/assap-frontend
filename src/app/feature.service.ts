import {Injectable} from '@angular/core';
import {Data} from '@angular/router';
import {Observable} from 'rxjs';
import {DataType, Element, Schema} from './forms/forms.interface';
import {Feature, FeatureData} from './model/feature.interface';
import {ParseObject} from './parse/parse-object.interface';
import {ParseService} from './parse/parse.service';

@Injectable({
  providedIn: 'root',
})
export class FeatureService {

  constructor(
    private parseService: ParseService,
  ) {
  }

  findAll(filter: Partial<Feature> = {}): Observable<Feature[]> {
    return this.parseService.findAll<Feature>('rFeature', filter);
  }

  create(feature: Omit<Feature, keyof ParseObject>): Observable<Feature> {
    return this.parseService.create<Feature>('rFeature', feature);
  }

  update(objectId: string, feature: Partial<Feature>): Observable<void> {
    return this.parseService.update('rFeature', objectId, feature);
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
