import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Schema} from "./forms.interface";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class FormsService {

  constructor(
    private http: HttpClient,
  ) {
  }

  loadSchema(name: string): Observable<Schema> {
    return this.http.get<Schema>(`/assets/${name}.json`);
  }
}
