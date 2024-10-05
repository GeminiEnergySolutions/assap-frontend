import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {FormsModule as NgFormsModule} from '@angular/forms';
import {NgbAccordionModule, NgbTooltip} from '@ng-bootstrap/ng-bootstrap';
import {FormInputTypePipe} from './form-input-type.pipe';
import {FormComponent} from './form/form.component';
import {FormElementComponent} from './form-element/form-element.component';
import {SharedModule} from '../shared.module';
import {FormChoicesPipe} from './form-choices.pipe';
import {CdkDrag, CdkDragHandle, CdkDropList} from '@angular/cdk/drag-drop';
import {RouterLink} from '@angular/router';

@NgModule({
  declarations: [
    FormComponent,
    FormElementComponent,
    FormInputTypePipe,
    FormChoicesPipe,
  ],
  exports: [
    FormComponent,
  ],
  imports: [
    CommonModule,
    NgFormsModule,
    NgbAccordionModule,
    SharedModule,
    NgbTooltip,
    CdkDropList,
    CdkDragHandle,
    CdkDrag,
    RouterLink,
  ],
})
export class FormsModule {
}
