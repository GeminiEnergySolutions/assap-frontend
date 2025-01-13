import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {SelectSchemaComponent} from './select-schema/select-schema.component';
import {EditSchemaComponent} from './edit-schema/edit-schema.component';
import {EditSectionComponent} from './edit-section/edit-section.component';
import {EditFieldComponent} from './edit-field/edit-field.component';
import {UnsavedChangesGuard} from '../shared/guard/unsaved-changes.guard';

const routes: Routes = [
  {
    path: ':kind/:id',
    component: EditSchemaComponent,
    canDeactivate: [UnsavedChangesGuard],
    children: [
      {path: 'section/:section', component: EditSectionComponent},
      {path: 'field/:key', component: EditFieldComponent},
    ]
  },
  {path: '', component: SelectSchemaComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SchemaEditorRoutingModule {
}
