import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {ToastService} from '@mean-stream/ngbx';
import {CopySpec, SchemaElement, SchemaSection} from '../../model/schema.interface';
import {PercentageCompletion} from '../../model/percentage-completion.interface';
import {CdkDragDrop, moveItemInArray} from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss'],
})
export class FormComponent implements OnInit {
  @Input({required: true}) typeSchema!: SchemaSection[];
  @Input({required: true}) formData!: { id?: string | number; data: any };
  /** for offline storage */
  @Input() formId: string = '';
  @Input() editable = false;
  @Output() saved = new EventEmitter<void>();
  @Output() deleted = new EventEmitter<SchemaSection>();

  dirty = false;

  constructor(
    private toastService: ToastService,
  ) {
  }

  ngOnInit() {
    for (const section of this.typeSchema) {
      for (const element of section.schema) {
        this.init(section, element);
      }
    }
  }

  init(section: SchemaSection, element: SchemaElement) {
    const id = this.formId && `${this.formId}/s-${section.id}/${element.key}`;
    const initialValue = id && globalThis.localStorage?.getItem(id);
    if (initialValue) {
      this.formData.data[element.key] = this.coerce(element, initialValue);
    } else if (element.disabled && element.defaultValue) {
      this.formData.data[element.key] = element.defaultValue;
    } else {
      const currentValue = this.formData.data[element.key];
      const defaultValue = element.defaultValue ?? (element.isDateNow ? new Date() : undefined);
      if (defaultValue !== undefined && (currentValue === undefined || currentValue === null)) {
        this.formData.data[element.key] = defaultValue;
      }
    }

    for (const subElement of element.inputList ?? []) {
      this.init(section, subElement);
    }
  }

  coerce(element: SchemaElement, value: string) {
    switch (element.type) {
      case 'date':
        return new Date(value);
      case 'checkbox':
        return value === 'true';
    }
    switch (element.dataType) {
      case 'number':
        return +value;
      case 'date':
        return new Date(value);
      default:
        return value;
    }
  }

  save() {
    if (!this.formData) {
      return;
    }

    if (this.formId) {
      // delete localStorage keys starting with this.formId
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key?.startsWith(this.formId)) {
          localStorage.removeItem(key);
        }
      }
    }

    this.saved.emit();

    this.dirty = false;
  }

  isMediumPage(schema: any, element: any) {
    let gridSize = 'col-12';
    if (schema.name == "Electric Vehicle") {
      gridSize = element.key.includes("ev_type_1_time") || element.key.includes("ev_type_2_time") || element.key.includes("ev_type_3_time") ? 'col-6' : gridSize;
    } else if (schema.name == "Non Electric Vehicle") {
      gridSize = element.key.includes("non_ev_type_1_time") || element.key.includes("non_ev_type_2_time") || element.key.includes("non_ev_type_3_time") ? 'col-6' : gridSize;
    } else if (schema.name == "Occupied Hours") {
      gridSize = element.key.includes("hour_time_") ? 'col-6' : gridSize;
    }
    return gridSize;
  }

  setDirty() {
    this.dirty = true;
  }

  canDeactivate(): boolean {
    return !this.dirty;
  }

  copyForm(copy: CopySpec) {
    if (!this.formData) {
      return;
    }

    const data = this.formData.data;
    let changed = 0;
    for (const [to, from] of Object.entries(copy.mappingInputs)) {
      if (data[to] === undefined || data[to] === null || data[to] === '') {
        data[to] = data[from];
        changed++;
      }
    }
    if (changed) {
      this.toastService.success(copy.buttonLabel, `Successfully copied ${changed} inputs`);
      this.setDirty();
    }
  }

  getProgress(schema: SchemaSection): PercentageCompletion {
    let requireElements = schema.schema.filter(e => e.required);
    const totalFields = requireElements.length;
    const completedFields = requireElements.filter(e => {
      const data = this.formData?.data[e.key];
      return data !== undefined && data !== null && data !== '';
    }).length;
    const percentage = (completedFields / totalFields) * 100;
    return {totalFields, completedFields, percentage};
  }

  dropSection(event: CdkDragDrop<SchemaSection[]>) {
    moveItemInArray(this.typeSchema, event.previousIndex, event.currentIndex);
  }

  dropField(section: SchemaSection, event: CdkDragDrop<SchemaElement[]>) {
    moveItemInArray(section.schema, event.previousIndex, event.currentIndex);
  }

  addFormElement(schema: SchemaSection) {
    schema.schema.push({
      key: `new_${schema.schema.length + 1}`,
      type: 'textBox',
      dataType: 'text',
      title: 'New Field',
      hint: '',
    });
  }
}
