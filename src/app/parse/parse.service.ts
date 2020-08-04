import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {Audit} from "../model/audit.interface";
import {Observable} from "rxjs";
import {environment} from "../../environments/environment";
import {map} from "rxjs/operators";
import {Feature} from "../model/feature.interface";

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

  getFeatures(filter: {auditId: string, zoneId?: string}): Observable<Feature[]> {
    return this.http.get<{ results: Feature[] }>(`${environment.parseUrl}/classes/rFeature`, {
      headers: this._headers,
      params: {
        where: JSON.stringify(filter),
      },
    }).pipe(
      map(v => v.results),
    );
  }
}
