import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {SchemaEditorRoutingModule} from './schema-editor-routing.module';
import {SelectSchemaComponent} from './select-schema/select-schema.component';
import { EditSchemaComponent } from './edit-schema/edit-schema.component';
import {FormsModule} from '../shared/form/form.module';
import {
  NgbAccordionBody,
  NgbAccordionButton,
  NgbAccordionCollapse,
  NgbAccordionDirective, NgbAccordionHeader, NgbAccordionItem,
} from '@ng-bootstrap/ng-bootstrap';
import {SharedModule} from '../shared/shared.module';


@NgModule({
  declarations: [
    SelectSchemaComponent,
    EditSchemaComponent,
  ],
  imports: [
    CommonModule,
    SchemaEditorRoutingModule,
    FormsModule,
    NgbAccordionBody,
    NgbAccordionButton,
    NgbAccordionCollapse,
    NgbAccordionDirective,
    NgbAccordionHeader,
    NgbAccordionItem,
    SharedModule,
  ],
})
export class SchemaEditorModule {
}
