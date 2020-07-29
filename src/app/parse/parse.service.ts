import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {Audit} from "../model/audit.interface";
import {Observable} from "rxjs";
import {environment} from "../../environments/environment";

@Injectable({providedIn: 'root'})
export class ParseService {
  constructor(
    private http: HttpClient,
  ) {
  }

  getAudits(): Observable<Audit[]> {
    return this.http.get<Audit[]>(`${environment.parseUrl}/classes/rAudit`, {
      headers: {
        'X-Parse-Application-Id': environment.parseAppId,
        'X-Parse-Master-Key': environment.parseMasterKey,
      },
    });
  }
}
