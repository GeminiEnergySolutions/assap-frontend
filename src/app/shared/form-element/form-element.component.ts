import {Component, EventEmitter, Input, Output} from '@angular/core';

@Component({
  selector: 'app-form-element',
  templateUrl: './form-element.component.html',
  styleUrl: './form-element.component.scss'
})
export class FormElementComponent {
  @Input() element!: any;
  @Input() schema!: any;
  @Input() formData!: { data: any };

  @Output() dirty = new EventEmitter();

  setDirty() {
    this.dirty.emit();
  }

  formatDate(element: any) {
    this.formData.data[element.key] = !this.formData.data[element.key] && element.isDateNow ? new Date().toISOString() : this.formData.data[element.key];
    return '';
  }

  changeCheckBox(event: any, key: string) {
    this.formData.data[key] = event.target.checked;
    this.setDirty();
  }

  changeDropDown(inputList: any[], key: string) {
    if (inputList && inputList.length) {

      const keyValue = this.formData.data[key]
      let dependentInputList = inputList.filter((a: any) => a.dependentKeyValue != keyValue)

      dependentInputList.forEach((element: any) => {

        if (this.formData.data[element.key]) {
          this.formData.data[element.key] = "";

          if (element.inputList && element.inputList.length) {
            dependentInputList.forEach((element1: any) => {

              if (this.formData.data[element1.key])
                this.formData.data[element1.key] = "";

            });
          }
        }
      });
    }

    this.setDirty();
  }
}
