import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {SchemaEditorRoutingModule} from './schema-editor-routing.module';
import {SelectSchemaComponent} from './select-schema/select-schema.component';


@NgModule({
  declarations: [
    SelectSchemaComponent,
  ],
  imports: [
    CommonModule,
    SchemaEditorRoutingModule,
  ],
})
export class SchemaEditorModule {
}
