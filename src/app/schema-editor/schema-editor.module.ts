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
  NgbAccordionItem, NgbOffcanvas, NgbOffcanvasModule, NgbPopover, NgbTooltip,
} from '@ng-bootstrap/ng-bootstrap';
import {SharedModule} from '../shared/shared.module';
import {EditSectionComponent} from './edit-section/edit-section.component';
import {FormsModule} from '@angular/forms';
import {EditFieldComponent} from './edit-field/edit-field.component';
import {CdkDrag, CdkDragHandle, CdkDropList} from '@angular/cdk/drag-drop';


@NgModule({
  declarations: [
    SelectSchemaComponent,
    EditSchemaComponent,
    EditSectionComponent,
    EditFieldComponent,
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
    NgbOffcanvasModule,
    SharedModule,
    FormsModule,
    NgbTooltip,
    NgbPopover,
    CdkDropList,
    CdkDragHandle,
    CdkDrag,
  ],
})
export class SchemaEditorModule {
}
