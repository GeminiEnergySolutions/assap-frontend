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

const steps: Record<string, Step> = {
  '#begin-tutorial': {
    selector: '#begin-tutorial',
    title: 'Tutorial',
    description: `
      Welcome to Conserve!
      This tutorial walks you through the different aspects and views of an Audit.
      Click 'Next' to continue to the next step, or '×' to skip the tutorial.
      `,
    next: '#add-audit',
  },
  '#add-audit': {
    selector: '#add-audit',
    title: 'Create an Audit',
    listen: ['click'],
    description: `
      Let's start by creating a new Audit.
      Click the 'Add Audit' button in the top left corner.
      `,
    next: '#audit-name',
    skip: '#audit-list',
  },
  '#audit-name': {
    selector: '#audit-name',
    title: 'Enter Audit Name',
    listen: ['change'],
    description: `Enter the name of your Audit in the input field.`,
    next: '#audit-state',
  },
  '#audit-state': {
    selector: '#audit-state',
    title: 'Select Audit State',
    listen: ['change'],
    description: `Select the state of your Audit from the dropdown menu.`,
    next: '#feasibility-study',
  },
  '#feasibility-study': {
    selector: '#feasibility-study',
    title: 'Enable Feasibility Study',
    listen: ['change'],
    description: `If your audit requires a feasibility study, e.g. for solar or electric vehicle charging, enable this option.`,
    next: '#create-audit',
  },
  '#create-audit': {
    selector: '#create-audit',
    title: 'Create Audit',
    listen: ['click'],
    description: `Click this button to create your Audit.`,
    next: '#audit-list',
  },
  '#audit-list': {
    selector: '#audit-list',
    title: 'Find your Audit',
    description: `You can find your newly created Audit in the list of Audits, under the state you selected.`,
    next: '#audit-search',
  },
  '#audit-search': {
    selector: '#audit-search',
    title: 'Search for Audits',
    description: `If you lost your Audit, you can search for it using the search bar at the top of the list.`,
    listen: ['change'],
    next: '.navbar',
  },
  '.navbar': {
    selector: '.navbar',
    title: 'End of Tutorial',
    description: "You're all set and done with the tutorial!",
  },
};
