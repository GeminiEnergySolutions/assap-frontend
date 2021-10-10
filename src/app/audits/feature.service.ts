import {Injectable} from '@angular/core';
import {Data} from '@angular/router';
import {Observable} from 'rxjs';
import {switchMap} from 'rxjs/operators';
import {Element, Schema} from '../forms/forms.interface';
import {ParseObject} from '../parse/parse-object.interface';
import {ParseService} from '../parse/parse.service';
import {Feature, FeatureData} from './model/feature.interface';

const RECORD_SEPARATOR = '\u001F';

@Injectable()
export class FeatureService {

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
    return this.parseService.update('rFeature', objectId, feature);
  }

  delete(objectId: string): Observable<void> {
    return this.parseService.delete('rFeature', objectId);
  }

  deleteAll(filter: Partial<Feature> = {}) {
    return this.findAll(filter, ['objectId'] as const).pipe(switchMap(features => {
      const requests = features.map(f => ({
        method: 'DELETE',
        path: '/parse/classes/rFeature/' + f.objectId,
      }));
      return this.parseService.batch(requests);
    }));
  }

  feature2Data(feature: Feature): FeatureData {
    const data: Record<string, string> = {};
    const formIds = feature.formId.split(RECORD_SEPARATOR);
    const values = feature.values.split(RECORD_SEPARATOR);
    const length = Math.min(formIds.length, values.length);

    for (let i = 0; i < length; i++) {
      data[formIds[i]] = values[i];
    }

    return data;
  }

  data2Feature(schema: Schema, data: Data): Pick<Feature, 'id' | 'dataType' | 'fields' | 'formId' | 'values'> {
    const entries = Object.entries(data);
    const keys = entries.map(([key]) => key);
    const elements = keys.map(k => this.findElement(schema, k));
    return {
      id: entries.map((e, index) => index).join(RECORD_SEPARATOR),
      dataType: elements.map(e => e.dataType).join(RECORD_SEPARATOR),
      fields: elements.map(e => e.param).join(RECORD_SEPARATOR),
      formId: keys.join(RECORD_SEPARATOR),
      values: entries.map(e => e[1]).join(RECORD_SEPARATOR),
    };
  }

  private findElement(schema: Schema, id: string): Element | undefined {
    for (let section of schema.geminiForm) {
      for (let element of section.elements) {
        if (element.id === id) {
          return element;
        }
      }
    }
    return undefined;
  }
}
