import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {State} from '../model/state.interface';
import {map, Observable} from 'rxjs';
import {environment} from '../../../environments/environment';

@Injectable({providedIn: 'root'})
export class StateService {
  constructor(
    private http: HttpClient,
  ) {
  }

  getStates(): Observable<State[]> {
    return this.http.get<{ data: State[] }>(`${environment.url}api/state`).pipe(map(({data}) => data));
  }
}
