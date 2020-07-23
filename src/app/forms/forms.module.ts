import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MasterDetailComponent} from './master-detail/master-detail.component';
import { FormComponent } from './form/form.component';


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
  ],
})
export class FormsModule {
}
