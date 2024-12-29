import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {SchemaEditorRoutingModule} from './schema-editor-routing.module';
import {SelectSchemaComponent} from './select-schema/select-schema.component';
import {EditSchemaComponent} from './edit-schema/edit-schema.component';

import {
  NgbAccordionBody,
  NgbAccordionButton,
  NgbAccordionCollapse,
  NgbAccordionDirective,
  NgbAccordionHeader,
  NgbAccordionItem,
  NgbOffcanvasModule,
  NgbPopover,
  NgbTooltip,
  NgbTypeahead,
} from '@ng-bootstrap/ng-bootstrap';
import {EditSectionComponent} from './edit-section/edit-section.component';
import {FormsModule} from '@angular/forms';
import {EditFieldComponent} from './edit-field/edit-field.component';
import {CdkDrag, CdkDragHandle, CdkDropList} from '@angular/cdk/drag-drop';
import {ExpressionErrorPipe} from '../shared/pipe/expression-error.pipe';
import {MasterDetailComponent} from '../shared/components/master-detail/master-detail.component';


@NgModule({
  imports: [
    CommonModule,
    SchemaEditorRoutingModule,
    NgbAccordionBody,
    NgbAccordionButton,
    NgbAccordionCollapse,
    NgbAccordionDirective,
    NgbAccordionHeader,
    NgbAccordionItem,
    NgbOffcanvasModule,
    FormsModule,
    NgbTooltip,
    NgbPopover,
    CdkDropList,
    CdkDragHandle,
    CdkDrag,
    NgbTypeahead,
    ExpressionErrorPipe,
    MasterDetailComponent,
    SelectSchemaComponent,
    EditSchemaComponent,
    EditSectionComponent,
    EditFieldComponent,
  ],
})
export class SchemaEditorModule {
}
