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

  clearOptions(id: string) {
    this.options.delete(id);
  }

  getOptions(id: string): PromptModalOptions | undefined {
    return this.options.get(id);
  }

  prompt(id: string) {
    this.router.navigate([
      {outlets: {modal: 'prompt'}},
    ], {
      relativeTo: this.route,
      state: {id},
    });
  }
}
