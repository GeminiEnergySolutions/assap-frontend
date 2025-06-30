import {Component, OnInit, QueryList, ViewChildren} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {ModalComponent, ModalModule} from '@mean-stream/ngbx';
import {FormElementComponent} from '../../form/form-element/form-element.component';
import {SchemaValue} from '../../model/schema.interface';
import {PromptModalOptions, PromptModalService} from './prompt-modal.service';

@Component({
  selector: 'app-prompt-modal',
  imports: [
    ModalModule,
    FormElementComponent,
  ],
  templateUrl: './prompt-modal.component.html',
  styleUrl: './prompt-modal.component.scss'
})
export class PromptModalComponent implements OnInit {
  @ViewChildren(FormElementComponent) formElements?: QueryList<FormElementComponent>;

  id?: string;
  options?: PromptModalOptions;

  formData: { data: Partial<Record<string, SchemaValue>> } = {data: {}};
  hasValidationErrors = (formElement: FormElementComponent) => formElement.validationMessages.some(m => m.level === 'error');

  constructor(
    private router: Router,
    protected route: ActivatedRoute,
    private promptModalService: PromptModalService,
  ) {
  }

  ngOnInit() {
    const state = this.router.lastSuccessfulNavigation?.extras.state;
    this.id = state?.id;
    if (!this.id) {
      console.warn('No id!', state);
      this.options = {
        title: 'Invalid Prompt',
        text: 'We have encountered a problem. Please close this popup to continue using the application.',
        submitLabel: 'Ignore',
        schema: [],
        callback: () => undefined,
      };
      return;
    }

    this.options = this.promptModalService.getOptions(this.id);
  }

  submit(modal: ModalComponent) {
    this.options?.callback(this.formData.data);
    modal.close();
  }
}
