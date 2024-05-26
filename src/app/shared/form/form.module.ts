import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {FormsModule as NgFormsModule} from '@angular/forms';
import {NgbAccordionModule} from '@ng-bootstrap/ng-bootstrap';
import {FormInputTypePipe} from './form-input-type.pipe';
import {FormComponent} from './form/form.component';
import {FormElementComponent} from './form-element/form-element.component';

@NgModule({
  declarations: [
    FormComponent,
    FormElementComponent,
    FormInputTypePipe,
  ],
  exports: [
    FormComponent,
  ],
  imports: [
    CommonModule,
    NgFormsModule,
    NgbAccordionModule,
  ],
})
export class FormsModule {
}
