import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import {SchemaElement, SchemaRequirement, SchemaSection} from '../../model/schema.interface';
import {isArray} from 'class-validator';

@Component({
  selector: 'app-form-element',
  templateUrl: './form-element.component.html',
  styleUrl: './form-element.component.scss'
})
export class FormElementComponent implements OnInit, OnChanges {
  @Input() element!: SchemaElement;
  @Input() schema!: SchemaSection;
  @Input() formId!: string;
  @Input() formData!: { data: any };

  @Output() dirty = new EventEmitter();

  id = '';

  validationMessages: SchemaRequirement[] = [];

  ngOnChanges(changes: SimpleChanges) {
    this.id = `${this.formId}/s-${this.schema.id}/${this.element.key}`;
  }

  ngOnInit() {
    if (this.formData.data[this.element.key]) {
      return;
    }
    this.validate();
  }

  setDirty() {
    globalThis?.localStorage.setItem(this.id, this.formData.data[this.element.key]);
    this.validate();
    this.dirty.emit();
  }

  validate() {
    this.validationMessages = [];
    if (!this.element.validations) {
      return;
    }
    for (const requirement of this.element.validations) {
      const value = this.formData.data[this.element.key];
      switch (requirement.type) {
        case 'min':
          if (value < requirement.value) {
            this.validationMessages.push(requirement);
          }
          break;
        case 'max':
          if (value > requirement.value) {
            this.validationMessages.push(requirement);
          }
          break;
        case 'pattern':
          if (!new RegExp(String(requirement.value)).test(value)) {
            this.validationMessages.push(requirement);
          }
          break;
      }
    }
  }

  // TODO Autofill Dates:
  //   this.formData.data[element.key] = !this.formData.data[element.key] && element.isDateNow ? new Date().toISOString() : this.formData.data[element.key];

  changeDropDown(element: SchemaElement) {
    this.setDirty();
    if (!element.inputList?.length) {
      return;
    }
    const keyValue = this.formData.data[element.key];
    let dependentInputList = element.inputList.filter(subElement => Array.isArray(subElement.dependentKeyValue) ? subElement.dependentKeyValue.includes(keyValue) : subElement.dependentKeyValue === keyValue);
    for (const element1 of dependentInputList) {
      if (!this.formData.data[element1.key]) {
        continue;
      }
      this.formData.data[element1.key] = '';
      if (element1.inputList && element1.inputList.length) {
        for (const element2 of dependentInputList) { // FIXME this is probably wrong. Why would we loop over the same list again?
          if (this.formData.data[element2.key]) {
            this.formData.data[element2.key] = '';
          }
        }
      }
    }
  }

  protected readonly isArray = Array.isArray;
}
