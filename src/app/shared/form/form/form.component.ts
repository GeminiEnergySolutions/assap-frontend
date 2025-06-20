import {CdkDrag, CdkDragDrop, CdkDragHandle, CdkDropList, moveItemInArray} from '@angular/cdk/drag-drop';
import {AsyncPipe} from '@angular/common';
import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {RouterLink} from '@angular/router';
import {ToastService} from '@mean-stream/ngbx';
import {
  NgbAccordionBody,
  NgbAccordionButton,
  NgbAccordionCollapse,
  NgbAccordionDirective,
  NgbAccordionHeader,
  NgbAccordionItem,
  NgbTooltip,
} from '@ng-bootstrap/ng-bootstrap';

import {ProgressBarComponent} from '../../components/progress-bar/progress-bar.component';
import {SaveableChangesComponent} from '../../guard/unsaved-changes.guard';
import {PercentageCompletion} from '../../model/percentage-completion.interface';
import {CopySpec, SchemaElement, SchemaSection, SchemaSubElement, SchemaValue} from '../../model/schema.interface';
import {EvalPipe} from '../../pipe/eval.pipe';
import {SearchPipe} from '../../pipe/search.pipe';
import {CopyPasteService} from '../../services/copy-paste.service';
import {FormElementComponent} from '../form-element/form-element.component';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss'],
  imports: [
    NgbAccordionDirective,
    NgbAccordionItem,
    NgbAccordionHeader,
    NgbAccordionButton,
    NgbTooltip,
    RouterLink,
    ProgressBarComponent,
    NgbAccordionCollapse,
    NgbAccordionBody,
    CdkDropList,
    CdkDrag,
    FormElementComponent,
    CdkDragHandle,
    AsyncPipe,
    EvalPipe,
    FormsModule,
    SearchPipe,
  ],
})
export class FormComponent implements OnInit, SaveableChangesComponent {
  @Input({required: true}) typeSchema!: SchemaSection[];
  @Input({required: true}) formData!: { id?: string | number; data: Partial<Record<string, SchemaValue>> };
  /** for offline storage */
  @Input() formId = '';
  @Input() editable = false;
  @Output() saved = new EventEmitter<void>();
  @Output() deleted = new EventEmitter<SchemaSection>();

  @Input() dirty = false;
  @Output() dirtyChange = new EventEmitter<boolean>();

  search = '';

  progressPerSection: Partial<Record<number, PercentageCompletion>> = {};

  constructor(
    private toastService: ToastService,
    private copyPasteService: CopyPasteService,
  ) {
  }

  ngOnInit() {
    for (const section of this.typeSchema) {
      for (const element of section.schema) {
        this.init(section, element);
      }
      this.updateProgress(section);
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
      const keyValue = this.formData.data[element.key];
      if (SchemaSubElement.matchesDependentKeyValue(subElement, keyValue)) {
        this.init(section, subElement);
      }
    }
  }

  coerce(element: SchemaElement, value: string): SchemaValue {
    switch (element.type) {
      case 'date':
        return new Date(value);
      case 'checkbox':
        return value === 'true';
    }
    switch (element.dataType) {
      case 'number':
      case 'integer':
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

    this.setDirty(false);
  }

  setDirty(dirty = true) {
    this.dirty = dirty;
    this.dirtyChange.emit(this.dirty);
  }

  isSaved(): boolean {
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

  updateProgress(schema: SchemaSection) {
    this.progressPerSection[schema.id] = this.getProgress(schema);
  }

  getProgress(schema: SchemaSection): PercentageCompletion {
    let totalFields = 0;
    let completedFields = 0;
    for (const requiredElement of this.requiredFormElements(schema.schema)) {
      totalFields++;
      const data = this.formData?.data[requiredElement.key];
      if (data !== undefined && data !== null && data !== '') {
        completedFields++;
      }
    }
    const percentage = (completedFields / totalFields) * 100;
    return {totalFields, completedFields, percentage};
  }

  private *requiredFormElements(elements: Iterable<SchemaElement>): Generator<SchemaElement> {
    for (const element of elements) {
      if (element.required) {
        yield element;
      }
      for (const subElement of element.inputList ?? []) {
        if (SchemaSubElement.matchesDependentKeyValue(subElement, this.formData.data[element.key])) {
          yield* this.requiredFormElements([subElement]);
        }
      }
    }
  }

  dropField(section: SchemaSection, event: CdkDragDrop<SchemaElement[]>) {
    moveItemInArray(section.schema, event.previousIndex, event.currentIndex);
    section._dirty = true;
  }

  addFormElement(section: SchemaSection) {
    section.schema.push({
      key: `new_${section.schema.length + 1}`,
      type: 'textBox',
      dataType: 'text',
      title: 'New Field',
      hint: '',
    });
    section._dirty = true;
  }

  removeFormElement(section: SchemaSection, $index: number) {
    section.schema.splice($index, 1);
    section._dirty = true;
  }

  copySection(schema: SchemaSection) {
    this.copyPasteService.copy(schema, [
      'id',
      '_dirty',
    ]).subscribe(() => {
      this.toastService.success('Copied', `Section ${schema.name} copied to clipboard`);
    });
  }

  copyField(element: SchemaElement) {
    this.copyPasteService.copy(element).subscribe(() => {
      this.toastService.success('Copied', `Field ${element.key} copied to clipboard`);
    });
  }

  pasteField(section: SchemaSection) {
    this.copyPasteService.paste<SchemaElement>([
      'key',
      'dataType',
      'type',
      'title',
    ]).subscribe({
      next: element => {
        section.schema.push(element);
        section._dirty = true;
        this.toastService.success('Pasted Field', `Successfully pasted field ${element.key}`);
      },
      error: error => {
        this.toastService.error('Failed to Paste Field', 'Clipboard is empty or does not contain a valid field', error);
      },
    });
  }
}
