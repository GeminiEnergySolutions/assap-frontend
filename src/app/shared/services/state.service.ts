import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {State} from '../model/state.interface';
import {map, Observable} from 'rxjs';
import {environment} from '../../../environments/environment';
import {Response} from '../model/response.interface';

@Injectable({providedIn: 'root'})
export class StateService {
  constructor(
    private http: HttpClient,
  ) {
  }

  getStates(): Observable<State[]> {
    return this.http.get<Response<State[]>>(`${environment.url}api/states`).pipe(map(({data}) => data));
  }
}
