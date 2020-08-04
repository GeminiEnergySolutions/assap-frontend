import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {Audit} from "../model/audit.interface";
import {Observable} from "rxjs";
import {environment} from "../../environments/environment";
import {map} from "rxjs/operators";
import {Feature} from "../model/feature.interface";
import {DataType, Element, Schema} from "../forms/forms.interface";

@Injectable({providedIn: 'root'})
export class ParseService {
  private readonly _headers = {
    'X-Parse-Application-Id': environment.parseAppId,
    'X-Parse-Master-Key': environment.parseMasterKey,
  };

  constructor(
    private http: HttpClient,
  ) {
  }

  getAudits(filter: Partial<Audit> = {}): Observable<Audit[]> {
    return this.http.get<{ results: Audit[] }>(`${environment.parseUrl}/classes/rAudit`, {
      headers: this._headers,
      params: {
        where: JSON.stringify(filter),
      },
    }).pipe(
      map(v => v.results),
    );
  }

  getFeatures(filter: Partial<Feature> = {}): Observable<Feature[]> {
    return this.http.get<{ results: Feature[] }>(`${environment.parseUrl}/classes/rFeature`, {
      headers: this._headers,
      params: {
        where: JSON.stringify(filter),
      },
    }).pipe(
      map(v => v.results),
    );
  }

  feature2Data(feature: Feature): object {
    const data = {};
    const formIds = feature.formId.split('\u001F');
    const values = feature.values.split('\u001F');
    const length = Math.min(formIds.length, values.length);

    for (let i = 0; i < length; i++) {
      data[formIds[i]] = values[i];
    }

    return data;
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
        defaultValues: "",
        hint: "",
        id: formIds[i],
        index: i,
        param: fields[i],
        validation: "mandatory",
      });
    }

    return {
      geminiForm: [
        {
          id: '0',
          index: 0,
          section: '',
          elements,
        }
      ]
    };
  }
}
