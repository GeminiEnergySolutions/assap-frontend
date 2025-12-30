import {HttpClient} from '@angular/common/http';
import {inject, Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {Response} from '../model/response.interface';
import {State} from '../model/state.interface';

@Injectable({providedIn: 'root'})
export class StateService {
  private http = inject(HttpClient);

  getStates(): Observable<Response<State[]>> {
    return this.http.get<Response<State[]>>(`/api/states`);
  }
}
