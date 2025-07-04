import {Component, inject, QueryList, ViewChildren} from '@angular/core';
import {ModalModule} from '@mean-stream/ngbx';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {FormElementComponent} from '../../form/form-element/form-element.component';
import {SchemaValue} from '../../model/schema.interface';
import {PROMPT_EXTRA_DATA, PROMPT_MODAL_OPTIONS} from './prompt-modal.service';

@Component({
  selector: 'app-prompt-modal',
  imports: [
    ModalModule,
    FormElementComponent,
  ],
  templateUrl: './prompt-modal.component.html',
  styleUrl: './prompt-modal.component.scss'
})
export class PromptModalComponent {
  readonly activeModal = inject(NgbActiveModal);
  readonly options = inject(PROMPT_MODAL_OPTIONS);

  @ViewChildren(FormElementComponent) formElements?: QueryList<FormElementComponent>;

  id?: string;

  formData: { data: Partial<Record<string, SchemaValue>> } = {data: {...inject(PROMPT_EXTRA_DATA)}};
  hasValidationErrors = (formElement: FormElementComponent) => formElement.validationMessages.some(m => m.level === 'error');

  submit() {
    this.activeModal.close(this.formData.data);
  }
}
