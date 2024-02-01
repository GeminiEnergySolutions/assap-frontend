import {Observable} from 'rxjs';
import {CanDeactivateFn} from '@angular/router';

export interface SaveableChangesComponent {
  isSaved(): boolean | Observable<boolean> | Promise<boolean>;
}

export const UnsavedChangesGuard: CanDeactivateFn<SaveableChangesComponent> = component => {
  return component.isSaved() || confirm('Are you sure you want to leave this page? Changes that you made may not be saved.');
};
