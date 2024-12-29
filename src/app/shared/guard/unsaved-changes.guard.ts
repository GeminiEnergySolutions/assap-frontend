import {firstValueFrom, Observable} from 'rxjs';
import {CanDeactivateFn} from '@angular/router';

export interface SaveableChangesComponent {
  isSaved(): boolean | Observable<boolean> | Promise<boolean>;
}

export const UnsavedChangesGuard: CanDeactivateFn<SaveableChangesComponent> = async component => {
  const returnVal = component.isSaved();
  let isSaved: boolean;
  if (typeof returnVal === 'boolean') {
    isSaved = returnVal;
  } else if (returnVal instanceof Observable) {
    isSaved = await firstValueFrom(returnVal);
  } else {
    isSaved = await returnVal;
  }
  return isSaved || confirm('Are you sure you want to leave this page? Changes that you made may not be saved.');
};
