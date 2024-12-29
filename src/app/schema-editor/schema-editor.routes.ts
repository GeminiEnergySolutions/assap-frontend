import {Routes} from '@angular/router';
import {SelectSchemaComponent} from './select-schema/select-schema.component';
import {EditSchemaComponent} from './edit-schema/edit-schema.component';
import {EditSectionComponent} from './edit-section/edit-section.component';
import {EditFieldComponent} from './edit-field/edit-field.component';

export const routes: Routes = [
  {
    path: ':kind/:id',
    component: EditSchemaComponent,
    children: [
      {path: 'section/:section', component: EditSectionComponent},
      {path: 'field/:key', component: EditFieldComponent},
    ]
  },
  {path: '', component: SelectSchemaComponent},
];
