import {Injectable} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {SchemaElement, SchemaValue} from '../../model/schema.interface';

export interface PromptModalOptions {
  title: string;
  text?: string;
  dangerText?: string;
  schema: SchemaElement[];
  submitLabel: string;
  submitClass?: string;
  cancelLabel?: string;
  callback: PromptCallback;
}

export type PromptCallback = (data: Partial<Record<string, SchemaValue>>) => void;

@Injectable({providedIn: 'root'})
export class PromptModalService {
  private readonly options = new Map<string, PromptModalOptions>();

  constructor(
    private router: Router,
    private route: ActivatedRoute,
  ) {
  }

  setOptions(id: string, options: PromptModalOptions) {
    this.options.set(id, options);
  }

  setOptionsPrompt(id: string, title: string, name: string, submitLabel: string, callback: (value: string, extra?: Record<string, unknown>) => void) {
    this.setOptions(id, {
      title,
      submitLabel,
      schema: [{
        key: 'value',
        dataType: 'text',
        type: 'textBox',
        title: name,
        hint: '',
        required: true,
      }],
      callback: ({value, ...extra}) => callback(value as string, extra),
    });
  }

  setOptionsConfirm(id: string, title: string, text: string, callback: PromptCallback) {
    this.setOptions(id, {
      title,
      submitLabel: 'Yes',
      cancelLabel: 'No',
      schema: [],
      callback,
    });
  }

  setOptionsConfirmDanger(
    id: string,
    options: Omit<PromptModalOptions, 'schema'>,
    confirm: {type: 'checkbox', title?: string, message?: string} | {type: 'text', expected: string, title?: string, message?: string} | undefined,
  ) {
    this.setOptions(id, {
      submitClass: 'btn-danger',
      cancelLabel: 'No',
      ...options,
      schema: confirm?.type === 'text' ? [{
        key: 'confirm',
        dataType: 'text',
        type: 'textBox',
        title: confirm.title ?? `Enter '${confirm}' to confirm`,
        hint: '',
        required: true,
        validations: [{
          if: ({confirm: userConfirm}) => confirm.expected !== userConfirm,
          level: 'error',
          message: confirm.message ?? `Please enter '${confirm}' to confirm.`,
        }],
      }] : confirm?.type === 'checkbox' ? [{
        key: 'confirm',
        dataType: 'bool',
        type: 'checkbox',
        title: confirm.title ?? 'I understand and confirm.',
        hint: '',
        required: true,
        validations: [{
          if: ({confirm}) => !confirm,
          level: 'error',
          message: confirm.message ?? 'Please check this box to confirm',
        }],
      }] : [],
    });
  }

  clearOptions(id: string) {
    this.options.delete(id);
  }

  getOptions(id: string): PromptModalOptions | undefined {
    return this.options.get(id);
  }

  prompt(id: string, extra?: Record<string, unknown>) {
    this.router.navigate([
      {outlets: {modal: 'prompt'}},
    ], {
      relativeTo: this.route,
      state: {id, extra},
    });
  }
}
