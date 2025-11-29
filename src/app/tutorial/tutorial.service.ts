import {HttpClient} from '@angular/common/http';
import {inject, Injectable} from '@angular/core';
import {map, Observable} from 'rxjs';
import {environment} from '../../environments/environment';
import {Response} from '../shared/model/response.interface';

@Injectable({providedIn: 'root'})
export class TutorialService {
  private readonly http = inject(HttpClient);

  getAllSelectors(): Observable<string[]> {
    return this.getAllSteps().pipe(map(steps => steps.map(s => s.selector)));
  }

  getAllSteps(): Observable<Step[]> {
    return this.http.get<Response<Step[]>>(`${environment.url}api/tutorial`).pipe(map(r => r.data));
  }

  getStep(selector: string): Observable<Step> {
    return this.http.get<Response<Step>>(environment.url + `api/tutorial/${encodeURIComponent(selector)}`).pipe(map(r => r.data));
  }

  saveStep(step: Step): Observable<Response> {
    return this.http.put<Response>(environment.url + `api/tutorial/${encodeURIComponent(step.selector)}`, step);
  }

  deleteStep(selector: string): Observable<Response> {
    return this.http.delete<Response>(environment.url + `api/tutorial/${encodeURIComponent(selector)}`);
  }
}

export const TRIGGERS = [
  'click',
  'blur',
  'keyup',
  'change',
];
export type Trigger = typeof TRIGGERS[number];

export interface Step {
  selector: string;
  title: string;
  description: string;
  listen?: Trigger[];
  route?: string;
  next?: string;
  skip?: string;
}
