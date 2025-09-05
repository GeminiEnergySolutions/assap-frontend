import {CdkDrag, CdkDragDrop, CdkDragHandle, CdkDropList, moveItemInArray} from '@angular/cdk/drag-drop';
import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {ActivatedRoute, RouterLink} from '@angular/router';
import {ToastService} from '@mean-stream/ngbx';
import {NgbPopover, NgbTooltip} from '@ng-bootstrap/ng-bootstrap';
import {combineLatestWith} from 'rxjs';
import {EditorComponent} from '../../shared/components/editor/editor.component';

import {FormComponent} from '../../shared/form/form/form.component';
import {icons} from '../../shared/icons';
import {SchemaElement, SchemaSection, SchemaSubElement} from '../../shared/model/schema.interface';
import {Breadcrumb, BreadcrumbService} from '../../shared/services/breadcrumb.service';
import {CopyPasteService} from '../../shared/services/copy-paste.service';
import {SchemaContextService} from '../schema-context.service';

@Component({
  selector: 'app-edit-field',
  templateUrl: './edit-field.component.html',
  styleUrl: './edit-field.component.scss',
  imports: [
    FormComponent,
    NgbTooltip,
    NgbPopover,
    FormsModule,
    CdkDropList,
    CdkDrag,
    RouterLink,
    CdkDragHandle,
    EditorComponent,
  ],
})
export class EditFieldComponent implements OnInit, OnDestroy {
  section?: SchemaSection;
  field: SchemaElement = {
    key: 'new',
    hint: 'rq',
    type: 'textBox',
    dataType: 'text',
    title: 'New Field',
  };

  readonly metaSchema: SchemaSection[] = [
    {
      id: 1,
      name: 'General',
      schema: [
        {
          key: 'key',
          dataType: 'text',
          type: 'textBox',
          title: 'Key',
          hint: 'The key that uniquely identifies this field',
          required: true,
        },
        {
          key: 'title',
          dataType: 'text',
          type: 'textBox',
          title: 'Title',
          hint: 'Text above the input field',
          required: true,
        },
        {
          key: 'required',
          dataType: 'bool',
          type: 'checkbox',
          title: 'Required',
          hint: 'This field must have a value',
        },
        {
          key: 'hint',
          dataType: 'text',
          type: 'textBox',
          title: 'Hint',
          hint: 'Text below the input field',
        },
      ],
    },
    {
      id: 2,
      name: 'Data',
      schema: [
        {
          key: 'dataType',
          dataType: 'text',
          type: 'select',
          hint: 'The type of data this field represents',
          title: 'Data Type',
          values: ['text', 'number', 'integer', 'date', 'bool'],
          required: true,
          inputList: [
            // --------------- Text ---------------
            {
              dependentKeyValue: 'text',
              key: 'defaultValue',
              dataType: 'text',
              type: 'textBox',
              title: 'Default Text Value',
              hint: 'The default text value for this field',
            },
            {
              dependentKeyValue: 'text',
              key: 'type',
              dataType: 'text',
              type: 'select',
              title: 'Input Type',
              hint: 'The type of input field',
              values: ['textBox', 'select', 'textArea', 'radio'],
              required: true,
              defaultValue: 'textBox',
              inputList: [
                {
                  dependentKeyValue: ['select', 'radio'],
                  key: 'values',
                  dataType: 'text',
                  type: 'textBox',
                  title: 'Values',
                  hint: 'The comma-separated options for a select or radio field.',
                },
              ],
            },
            // --------------- Number ---------------
            {
              dependentKeyValue: 'number',
              key: 'defaultValue',
              dataType: 'number',
              type: 'textBox',
              title: 'Default Number Value',
              hint: 'The default number value for this field',
            },
            {
              dependentKeyValue: 'integer',
              key: 'defaultValue',
              dataType: 'integer',
              type: 'textBox',
              title: 'Default Integer Value',
              hint: 'The default integer value for this field',
            },
            {
              dependentKeyValue: ['number', 'integer'],
              key: 'type',
              dataType: 'text',
              type: 'select',
              title: 'Input Type',
              hint: 'The type of input field',
              values: ['textBox', 'select', 'radio'],
              required: true,
              defaultValue: 'textBox',
              inputList: [
                {
                  dependentKeyValue: ['select', 'radio'],
                  key: 'values',
                  dataType: 'text',
                  type: 'textBox',
                  title: 'Values',
                  hint: 'The comma-separated options for a select or radio field.',
                },
              ],
            },
            {
              dependentKeyValue: ['number', 'integer'],
              key: 'unit',
              dataType: 'text',
              type: 'textBox',
              title: 'Physical Unit or Currency',
              hint: 'The physical unit or currency of the input field',
              required: false,
            },
            // --------------- Date ---------------
            {
              dependentKeyValue: 'date',
              key: 'isDateNow',
              dataType: 'bool',
              type: 'checkbox',
              title: 'Default to Now',
              hint: 'For date fields, default to the current date',
            },
            {
              dependentKeyValue: 'date',
              key: 'defaultValue',
              dataType: 'date',
              type: 'textBox',
              title: 'Default Date Value',
              hint: 'The default date value for this field',
            },
            {
              dependentKeyValue: 'date',
              key: 'type',
              dataType: 'text',
              type: 'select',
              title: 'Input Type',
              hint: 'The type of input field',
              values: ['date'],
              disabled: true,
              defaultValue: 'date',
            },
            // --------------- Boolean ---------------
            {
              dependentKeyValue: 'bool',
              key: 'defaultValue',
              dataType: 'bool',
              type: 'checkbox',
              title: 'Selected by Default',
              hint: 'Whether this checkbox is selected by default',
            },
            {
              dependentKeyValue: 'bool',
              key: 'type',
              dataType: 'text',
              type: 'select',
              title: 'Input Type',
              hint: 'The type of input field',
              values: ['checkbox'],
              disabled: true,
              defaultValue: 'checkbox',
            },
          ]
        },
      ],
    },
    {
      id: 3,
      name: 'Visual',
      schema: [
        {
          key: 'disabled',
          dataType: 'bool',
          type: 'checkbox',
          title: 'Disabled',
          hint: 'This field is locked and cannot be edited',
        },
        {
          key: 'isHeading',
          dataType: 'bool',
          type: 'checkbox',
          title: 'Has Heading',
          hint: 'This field is a heading',
          inputList: [
            {
              key: 'heading',
              dataType: 'text',
              type: 'textBox',
              title: 'Heading',
              hint: 'Heading text above the field',
              dependentKeyValue: true,
            },
          ]
        },
        {
          key: 'gridSize',
          dataType: 'integer',
          type: 'select',
          title: 'Grid Size',
          defaultValue: 12,
          hint: 'The size of the field in the grid. 12 is full width',
          values: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
        },
      ]
    }
  ];

  constructor(
    private route: ActivatedRoute,
    private schemaContext: SchemaContextService,
    private breadcrumbService: BreadcrumbService,
    private copyPasteService: CopyPasteService,
    private toastService: ToastService,
  ) {
  }

  ngOnInit() {
    const sectionBreadcrumb: Breadcrumb = {label: '', class: icons.schemaSection, relativeTo: this.route};
    this.breadcrumbService.pushBreadcrumb(sectionBreadcrumb);
    const fieldBreadcrumb: Breadcrumb = {label: '', class: icons.schemaField, routerLink: '.', relativeTo: this.route};
    this.breadcrumbService.pushBreadcrumb(fieldBreadcrumb);

    this.route.params.pipe(
      combineLatestWith(this.schemaContext.loaded$),
    ).subscribe(([{key}]) => {
      for (const section of this.schemaContext.schema) {
        const found = this.findField(key, section.schema);
        if (found) {
          this.section = section;
          this.field = found;
          sectionBreadcrumb.label = section.name;
          sectionBreadcrumb.routerLink = `../../section/${section.id}`;
          fieldBreadcrumb.label = found.title;
          break;
        }
      }
    });
  }

  ngOnDestroy() {
    this.breadcrumbService.popBreadcrumb();
    this.breadcrumbService.popBreadcrumb();
  }

  private findField(key: string, fields: SchemaElement[]): SchemaElement | undefined {
    for (const field of fields) {
      if (field.key === key) {
        return field;
      }
      if (field.inputList) {
        const found = this.findField(key, field.inputList);
        if (found) {
          return found;
        }
      }
    }
  }

  save() {
    if (this.section) {
      this.schemaContext.save(this.section).subscribe();
    }
  }

  setDirty(dirty = true) {
    this.section!._dirty = dirty;
  }

  setDocs(key: 'summary' | 'docs', value: string) {
    if (value === '<p></p>') {
      value = '';
    }
    if (this.field[key] !== value) {
      this.field[key] = value;
      this.setDirty();
    }
  }

  addValidation() {
    (this.field.validations ??= []).push({
      level: 'warning',
      if: 'true',
      message: 'New Validation',
    });
    this.setDirty();
  }

  removeValidation(index: number) {
    this.field.validations?.splice(index, 1);
    this.setDirty();
  }

  addSubfield() {
    (this.field.inputList ??= []).push({
      dependentKeyValue: '',
      key: `${this.field.key}_${this.field.inputList.length}`,
      dataType: 'text',
      type: 'textBox',
      title: 'New Field',
      hint: '',
    });
    this.setDirty();
  }

  removeSubfield(index: number) {
    this.field.inputList?.splice(index, 1);
    this.setDirty();
  }

  dropSubfield(event: CdkDragDrop<SchemaSubElement[]>) {
    if (this.field.inputList) {
      moveItemInArray(this.field.inputList, event.previousIndex, event.currentIndex);
    }
    this.setDirty();
  }

  copySubfield(subfield: SchemaSubElement) {
    this.copyPasteService.copy(subfield).subscribe(() => {
      this.toastService.success('Copied to Clipboard', 'Field copied to clipboard');
    });
  }

  pasteSubfield() {
    this.copyPasteService.paste<SchemaSubElement>([
      'key',
      'dataType',
      'type',
      'title',
    ]).subscribe({
      next: subfield => {
        (this.field.inputList ??= []).push(subfield);
        this.setDirty();
        this.toastService.success('Pasted', `Successfully pasted field ${subfield.key}`);
      },
      error: error => this.toastService.error('Failed to Paste', 'Clipboard is empty or does not contain a valid field', error),
    });
  }
}
