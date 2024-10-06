import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {SchemaEditorRoutingModule} from './schema-editor-routing.module';
import {SelectSchemaComponent} from './select-schema/select-schema.component';
import {EditSchemaComponent} from './edit-schema/edit-schema.component';
import {FormsModule as FormModule} from '../shared/form/form.module';
import {
  NgbAccordionBody,
  NgbAccordionButton,
  NgbAccordionCollapse,
  NgbAccordionDirective,
  NgbAccordionHeader,
  NgbAccordionItem,
} from '@ng-bootstrap/ng-bootstrap';
import {SharedModule} from '../shared/shared.module';
import {EditSectionComponent} from './edit-section/edit-section.component';
import {FormsModule} from '@angular/forms';


@NgModule({
  declarations: [
    SelectSchemaComponent,
    EditSchemaComponent,
    EditSectionComponent,
  ],
  imports: [
    CommonModule,
    SchemaEditorRoutingModule,
    FormModule,
    NgbAccordionBody,
    NgbAccordionButton,
    NgbAccordionCollapse,
    NgbAccordionDirective,
    NgbAccordionHeader,
    NgbAccordionItem,
    SharedModule,
    FormsModule,
  ],
})
export class SchemaEditorModule {
}
