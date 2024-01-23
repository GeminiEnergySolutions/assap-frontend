import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FormsModule as AppFormsModule } from '../shared/form/form.module';
import { SettingComponent } from './setting.component'; // You need to create this component
import {FormsModule as NgFormsModule} from '@angular/forms';
import {NgbAccordionModule} from '@ng-bootstrap/ng-bootstrap';
import { UniquePipe } from './unique.pipe';

@NgModule({
  declarations: [
    SettingComponent,
    UniquePipe,
], // Declare your components here
  imports: [
    CommonModule,
    
    // SharedModule,
    FormsModule,
    ReactiveFormsModule,
    AppFormsModule,
    NgFormsModule,
    NgbAccordionModule,
    RouterModule.forChild([
      {
        path: '', // You can define child routes here if needed
        component: SettingComponent,
      },
    ]),
  ],
  providers: [
],
})
export class SettingModule {}
