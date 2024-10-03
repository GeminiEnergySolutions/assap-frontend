import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {SchemaEditorRoutingModule} from './schema-editor-routing.module';
import {SelectSchemaComponent} from './select-schema/select-schema.component';
import { EditSchemaComponent } from './edit-schema/edit-schema.component';


@NgModule({
  declarations: [
    SelectSchemaComponent,
    EditSchemaComponent,
  ],
  imports: [
    CommonModule,
    SchemaEditorRoutingModule,
  ],
})
export class SchemaEditorModule {
}
