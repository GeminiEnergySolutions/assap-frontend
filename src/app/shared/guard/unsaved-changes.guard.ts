import {inject} from '@angular/core';
import {firstValueFrom, Observable} from 'rxjs';
import {CanDeactivateFn} from '@angular/router';
import {PromptModalService} from '../components/prompt-modal/prompt-modal.service';

export interface SaveableChangesComponent {
  isSaved(): boolean | Observable<boolean> | Promise<boolean>;
}

export const UnsavedChangesGuard: CanDeactivateFn<SaveableChangesComponent> = async component => {
  const promptModalService = inject(PromptModalService);

  const returnVal = component.isSaved();
  let isSaved: boolean;
  if (typeof returnVal === 'boolean') {
    isSaved = returnVal;
  } else if (returnVal instanceof Observable) {
    isSaved = await firstValueFrom(returnVal);
  } else {
    isSaved = await returnVal;
  }
  if (isSaved) {
    return true;
  }
  return promptModalService.prompt(promptModalService.confirmPrompt({
    title: 'Unsaved Changes',
    text: 'You have unsaved changes. Are you sure you want to leave?',
    submitLabel: 'Yes, Leave',
    submitClass: 'btn-warning',
  })).then(() => true, () => false);
};
