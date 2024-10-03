import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {SelectSchemaComponent} from './select-schema/select-schema.component';
import {EditSchemaComponent} from './edit-schema/edit-schema.component';

const routes: Routes = [
  {path: ':kind/:id', component: EditSchemaComponent},
  {path: '', component: SelectSchemaComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SchemaEditorRoutingModule {
}
