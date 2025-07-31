import {inject, Injectable, InjectionToken, Injector} from '@angular/core';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {SchemaElement, SchemaValue} from '../../model/schema.interface';
import {PromptModalComponent} from './prompt-modal.component';

export const PROMPT_MODAL_OPTIONS = new InjectionToken<PromptModalOptions>('PromptModalOptions');

export interface PromptModalOptions<T = Data> {
  title: string;
  /** A key of form or extra data to display (the value) next to the title */
  titleContextKey?: string;
  text?: string;
  /** Extra text displayed in red */
  dangerText?: string;
  schema: (SchemaElement & {key: keyof T})[];
  submitLabel: string;
  /**
   * Customize the class of the submit button.
   * @default btn-primary
   */
  submitClass?: string;
  cancelLabel?: string;
}

export type Data = Partial<Record<string, SchemaValue>>;

export const PROMPT_EXTRA_DATA = new InjectionToken<Data>('PromptExtraData');

@Injectable({providedIn: 'root'})
export class PromptModalService {
  private readonly ngbModal = inject(NgbModal);

  simplePrompt(title: string, name: string, submitLabel: string): PromptModalOptions<{ value: string }> {
    return {
      title,
      submitLabel,
      schema: [{
        key: 'value',
        dataType: 'text',
        type: 'textBox',
        title: name,
        hint: '',
        required: true,
        validations: [{
          if: ({value}) => !value,
          level: 'error',
          message: 'Please enter a value',
        }],
      }],
    };
  }

  confirmPrompt(options: Omit<PromptModalOptions, 'schema'>): PromptModalOptions<object> {
    return {
      cancelLabel: 'No',
      schema: [],
      ...options,
    };
  }

  confirmDanger(
    options: Omit<PromptModalOptions, 'schema'>,
    confirm: {type: 'checkbox', title?: string, message?: string} | {type: 'text', expected: string, title?: string, message?: string} | undefined,
  ): PromptModalOptions<{ confirm: boolean | string }> {
    return {
      submitClass: 'btn-danger',
      cancelLabel: 'No',
      ...options,
      schema: confirm?.type === 'text' ? [{
        key: 'confirm',
        dataType: 'text',
        type: 'textBox',
        title: confirm.title ?? `Enter '${confirm.expected}' to confirm`,
        hint: '',
        required: true,
        validations: [{
          if: ({confirm: userConfirm}) => confirm.expected !== userConfirm,
          level: 'error',
          message: confirm.message ?? `Please enter '${confirm.expected}' to confirm.`,
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
    };
  }

  prompt<T, E = object>(options: PromptModalOptions<T>, extra?: E): Promise<T & E> {
    return this.ngbModal.open(PromptModalComponent, {
      role: 'alertdialog',
      injector: Injector.create({
        providers: [
          {
            provide: PROMPT_MODAL_OPTIONS,
            useValue: options,
          },
          {
            provide: PROMPT_EXTRA_DATA,
            useValue: extra,
          },
        ],
      }),
    }).result;
  }
}
