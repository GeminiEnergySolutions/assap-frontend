import {Component, EventEmitter, Input, Output} from '@angular/core';
import {SchemaElement, SchemaSection} from '../model/schema.interface';

@Component({
  selector: 'app-form-element',
  templateUrl: './form-element.component.html',
  styleUrl: './form-element.component.scss'
})
export class FormElementComponent {
  @Input() element!: SchemaElement;
  @Input() schema!: SchemaSection;
  @Input() formData!: { data: any };

  @Output() dirty = new EventEmitter();

  setDirty() {
    this.dirty.emit();
  }

  // TODO Autofill Dates:
  //   this.formData.data[element.key] = !this.formData.data[element.key] && element.isDateNow ? new Date().toISOString() : this.formData.data[element.key];

  changeDropDown(element: any) {
    this.setDirty();
    if (!element.inputList?.length) {
      return;
    }
    const keyValue = this.formData.data[element.key];
    let dependentInputList = element.inputList.filter((a: any) => a.dependentKeyValue != keyValue);
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
}