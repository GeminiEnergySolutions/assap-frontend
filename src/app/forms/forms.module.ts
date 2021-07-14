import {CommonModule} from '@angular/common';
import {HttpClientModule} from '@angular/common/http';
import {NgModule} from '@angular/core';
import {FormsModule as NgFormsModule} from '@angular/forms';
import {FormInputTypePipe} from './form-input-type.pipe';
import {FormComponent} from './form/form.component';

@NgModule({
  declarations: [
    FormComponent,
    FormInputTypePipe,
  ],
  exports: [
    FormComponent,
  ],
  imports: [
    CommonModule,
    HttpClientModule,
    NgFormsModule,
  ],
})
export class FormsModule {
}
