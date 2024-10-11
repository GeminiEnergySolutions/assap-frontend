import {Component, OnInit} from '@angular/core';
import {SchemaElement, SchemaSection, SchemaSubElement} from '../../shared/model/schema.interface';
import {ActivatedRoute} from '@angular/router';
import {SchemaContextService} from '../schema-context.service';
import {CdkDragDrop, moveItemInArray} from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-edit-field',
  templateUrl: './edit-field.component.html',
  styleUrl: './edit-field.component.scss'
})
export class EditFieldComponent implements OnInit {
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
          disabled: true,
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
          values: ['text', 'number', 'date', 'bool'],
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
                  type: 'textArea',
                  title: 'Values',
                  hint: 'The options for a select field. Put each option on a new line.',
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
              dependentKeyValue: 'number',
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
                  dataType: 'number',
                  type: 'textArea',
                  title: 'Values',
                  hint: 'The available options. Put each option on a new line.',
                },
              ],
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
      ]
    }
  ];

  constructor(
    private route: ActivatedRoute,
    private schemaContext: SchemaContextService,
  ) {
  }

  ngOnInit() {
    this.route.params.subscribe(({key}) => {
      this.field = this.findField(key, this.schemaContext.schema.flatMap(s => s.schema)) || this.field;
    });
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

  addValidation() {
    (this.field.validations ??= []).push({
      level: 'warning',
      if: 'true',
      message: 'New Validation',
    });
  }

  removeValidation(index: number) {
    this.field.validations?.splice(index, 1);
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
  }

  removeSubfield(index: number) {
    this.field.inputList?.splice(index, 1);
  }

  dropSubfield(event: CdkDragDrop<SchemaSubElement[]>) {
    this.field.inputList && moveItemInArray(this.field.inputList, event.previousIndex, event.currentIndex);
  }
}
