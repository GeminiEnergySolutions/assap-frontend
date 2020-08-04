import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {HttpClientModule} from "@angular/common/http";
import {MasterDetailComponent} from './master-detail/master-detail.component';
import {FormComponent} from './form/form.component';
import {FormsModule as NgFormsModule} from "@angular/forms";

@NgModule({
  declarations: [
    MasterDetailComponent,
    FormComponent,
  ],
  exports: [
    MasterDetailComponent,
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
