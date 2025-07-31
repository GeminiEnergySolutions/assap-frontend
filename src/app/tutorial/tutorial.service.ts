import {Injectable} from '@angular/core';
import {NotFoundError, Observable, of, throwError} from 'rxjs';

@Injectable({providedIn: 'root'})
export class TutorialService {

  getStep(selector: string): Observable<Step> {
    const step = steps[selector];
    console.log(selector, step);
    return step ? of(step) : throwError(() => new NotFoundError(selector));
  }
}

export interface Step {
  title: string;
  description: string;
  listen?: ('click' | 'blur' | 'keyup' | 'change')[];
  route?: any[];
  next?: string;
  skip?: string;
}

const steps: Record<string, Step> = {
  '#begin-tutorial': {
    title: 'Tutorial',
    description: `
      Welcome to Conserve!
      This tutorial walks you through the different aspects and views of an Audit.
      Click 'Next' to continue to the next step, or '×' to skip the tutorial.
      `,
    next: '#add-audit',
  },
  '#add-audit': {
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
    title: 'Enter Audit Name',
    listen: ['change'],
    description: `Enter the name of your Audit in the input field.`,
    next: '#audit-state',
  },
  '#audit-state': {
    title: 'Select Audit State',
    listen: ['change'],
    description: `Select the state of your Audit from the dropdown menu.`,
    next: '#feasibility-study',
  },
  '#feasibility-study': {
    title: 'Enable Feasibility Study',
    listen: ['change'],
    description: `If your audit requires a feasibility study, e.g. for solar or electric vehicle charging, enable this option.`,
  },
  '#create-audit': {
    title: 'Create Audit',
    listen: ['click'],
    description: `Click this button to create your Audit.`,
    next: '#audit-list',
  },
  '#audit-list': {
    title: 'Find your Audit',
    description: `You can find your newly created Audit in the list of Audits, under the state you selected.`,
    next: '#audit-search',
  },
  '#audit-search': {
    title: 'Search for Audits',
    description: `If you lost your Audit, you can search for it using the search bar at the top of the list.`,
    listen: ['change'],
    next: '.navbar',
  },
  '.navbar': {
    title: 'End of Tutorial',
    description: "You're all set and done with the tutorial!",
  },
};
