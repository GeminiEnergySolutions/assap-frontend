import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Data} from '@angular/router';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {DataType, Element, Schema} from '../forms/forms.interface';
import {Audit} from '../model/audit.interface';
import {FeatureData, Feature} from '../model/feature.interface';
import {ParseCredentialService} from './parse-credential.service';

@Injectable()
export class ParseService {
  constructor(
    private http: HttpClient,
    private parseCredentialService: ParseCredentialService,
  ) {
  }

  private get url(): string {
    return this.parseCredentialService.url;
  }

  getAudits(filter: Partial<Audit> = {}): Observable<Audit[]> {
    return this.http.get<{ results: Audit[] }>(`${this.url}/classes/rAudit`, {
      params: {
        where: JSON.stringify(filter),
      },
    }).pipe(
      map(v => this.merge(v.results)),
    );
  }

  private merge(audits: Audit[]): Audit[] {
    const auditIds = new Map<string, Audit>();

    for (const audit of audits) {
      const existing = auditIds.get(audit.auditId);
      if (!existing) {
        auditIds.set(audit.auditId, audit);
        continue;
      }

      // in case of conflict, use newest
      if (existing.updatedAt < audit.updatedAt) {
        existing.name = audit.name;
        existing.type = {...existing.type, ...audit.type};
        existing.zone = {...existing.zone, ...audit.zone};
      } else {
        existing.type = {...audit.type, ...existing.type};
        existing.zone = {...audit.zone, ...existing.zone};
      }
    }

    return [...auditIds.values()];
  }

  createAudit(audit: Omit<Audit, 'objectId' | 'createdAt' | 'updatedAt'>): Observable<Audit> {
    return this.http.post<Pick<Audit, 'objectId' | 'createdAt'>>(this.url + '/classes/rAudit', audit).pipe(
      map(result => ({...audit, ...result, updatedAt: result.createdAt})),
    );
  }

  getFeatures(filter: Partial<Feature> = {}): Observable<Feature[]> {
    return this.http.get<{ results: Feature[] }>(`${this.url}/classes/rFeature`, {
      params: {
        where: JSON.stringify(filter),
      },
    }).pipe(
      map(v => v.results),
    );
  }

  createFeature(feature: Omit<Feature, 'objectId' | 'createdAt' | 'updatedAt'>): Observable<Feature> {
    return this.http.post<Pick<Feature, 'objectId' | 'createdAt'>>(this.url + '/classes/rFeature', feature).pipe(
      map(result => ({...feature, ...result, updatedAt: result.createdAt})),
    );
  }

  updateFeature(objectId: string, feature: Partial<Feature>): Observable<void> {
    return this.http.put<void>(`${this.url}/classes/rFeature/${objectId}`, feature);
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

  feature2Schema(feature: Feature): Schema {
    const formIds = feature.formId.split('\u001F');
    const fields = feature.fields.split('\u001F');
    const dataTypes = feature.dataType.split('\u001F');
    const length = Math.min(formIds.length, fields.length, dataTypes.length);

    const elements: Element[] = [];
    for (let i = 0; i < length; i++) {
      elements.push({
        dataType: dataTypes[i] as DataType,
        defaultValues: '',
        hint: '',
        id: formIds[i],
        index: i,
        param: fields[i],
        validation: 'mandatory',
      });
    }

    return {
      geminiForm: [
        {
          id: '0',
          index: 0,
          section: '',
          elements,
        },
      ],
    };
  }
}
