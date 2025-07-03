import {inject, Injectable, InjectionToken, Injector} from '@angular/core';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {SchemaElement, SchemaValue} from '../../model/schema.interface';
import {PromptModalComponent} from './prompt-modal.component';

export const PROMPT_MODAL_OPTIONS = new InjectionToken<PromptModalOptions>('PromptModalOptions');

export interface PromptModalOptions {
  title: string;
  /** A key of form or extra data to display (the value) next to the title */
  titleContextKey?: string;
  text?: string;
  /** Extra text displayed in red */
  dangerText?: string;
  schema: SchemaElement[];
  submitLabel: string;
  /**
   * Customize the class of the submit button.
   * @default btn-primary
   */
  submitClass?: string;
  cancelLabel?: string;
  /** Will be invoked on submit with the form and extra data */
  callback: PromptCallback;
}

export type Data = Partial<Record<string, SchemaValue>>;
export type PromptCallback = (data: Data) => void;

export const PROMPT_EXTRA_DATA = new InjectionToken<Data>('PromptExtraData');

@Injectable({providedIn: 'root'})
export class PromptModalService {
  private readonly options = new Map<string, PromptModalOptions>();
  private readonly ngbModal = inject(NgbModal);

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

  prompt(id: string, extra: Record<string, unknown> = {}): Promise<Data | string> {
    return this.ngbModal.open(PromptModalComponent, {
      role: 'alertdialog',
      injector: Injector.create({
        providers: [
          {
            provide: PROMPT_MODAL_OPTIONS,
            useValue: this.getOptions(id),
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
