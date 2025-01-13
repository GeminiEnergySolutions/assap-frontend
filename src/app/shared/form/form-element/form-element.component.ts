import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import {SchemaElement, SchemaRequirement, SchemaSection, SchemaValue} from '../../model/schema.interface';
import {ExpressionService} from '../../services/expression.service';

@Component({
  selector: 'app-form-element',
  templateUrl: './form-element.component.html',
  styleUrl: './form-element.component.scss',
  standalone: false,
})
export class FormElementComponent implements OnInit, OnChanges {
  @Input() element!: SchemaElement;
  @Input() schema!: SchemaSection;
  @Input() formId!: string;
  @Input() formData!: { data: Partial<Record<string, SchemaValue>> };

  @Output() dirty = new EventEmitter();

  id = '';

  validationMessages: SchemaRequirement[] = [];

  constructor(
    private expressionService: ExpressionService,
  ) {
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.formId || changes.schema || changes.element) {
      this.id = `${this.formId}/s-${this.schema.id}/${this.element.key}`;
    }
  }

  ngOnInit() {
    if (this.formData.data[this.element.key]) {
      return;
    }
    this.validate();
  }

  setDirty() {
    globalThis?.localStorage.setItem(this.id, String(this.formData.data[this.element.key]));
    this.validate();
    this.dirty.emit();
  }

  validate() {
    this.validationMessages = [];
    if (!this.element.validations) {
      return;
    }
    Promise.all(this.element.validations.map(async requirement => {
      if (await this.expressionService.eval(requirement.if, this.formData.data)) {
        return requirement;
      }
    })).then(results => {
      this.validationMessages = results.filter(r => !!r);
    });
  }

  // TODO Autofill Dates:
  //   this.formData.data[element.key] = !this.formData.data[element.key] && element.isDateNow ? new Date().toISOString() : this.formData.data[element.key];

  changeDropDown(element: SchemaElement) {
    this.setDirty();
    if (!element.inputList?.length) {
      return;
    }
    const keyValue = this.formData.data[element.key];
    for (const subElement of element.inputList) {
      if (Array.isArray(subElement.dependentKeyValue) ? keyValue && subElement.dependentKeyValue.includes(keyValue) : subElement.dependentKeyValue === keyValue) {
        if (subElement.defaultValue !== undefined) {
          this.formData.data[subElement.key] = subElement.defaultValue;
        } else {
          delete this.formData.data[subElement.key];
        }
      }
    }
  }

  protected readonly isArray = Array.isArray;
}
