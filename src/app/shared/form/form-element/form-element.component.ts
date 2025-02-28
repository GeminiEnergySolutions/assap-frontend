import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import {
  SchemaElement,
  SchemaRequirement,
  SchemaSection,
  SchemaSubElement,
  SchemaValue,
} from '../../model/schema.interface';
import {ExpressionService} from '../../services/expression.service';
import {NgbTooltip} from '@ng-bootstrap/ng-bootstrap';
import {FormsModule} from '@angular/forms';
import {FormChoicesPipe} from '../form-choices.pipe';

@Component({
  selector: 'app-form-element',
  templateUrl: './form-element.component.html',
  styleUrl: './form-element.component.scss',
  imports: [
    NgbTooltip,
    FormsModule,
    FormChoicesPipe,
  ],
})
export class FormElementComponent implements OnInit, OnChanges {
  @Input() element!: SchemaElement;
  @Input() schema!: SchemaSection;
  @Input() formId!: string;
  @Input() formData!: { data: Partial<Record<string, SchemaValue>> };

  @Output() dirty = new EventEmitter();

  id = '';

  validationMessages: SchemaRequirement[] = [];

  childElements: SchemaSubElement[] = [];

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
    this.validate();
    this.determineChildElements();
  }

  setDirty() {
    globalThis?.localStorage.setItem(this.id, String(this.formData.data[this.element.key]));
    this.validate();
    this.determineChildElements();
    this.dirty.emit();
  }

  private validate() {
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

  private determineChildElements() {
    this.childElements = [];
    if (!this.element.inputList?.length) {
      return;
    }
    const keyValue = this.formData.data[this.element.key];
    for (const subElement of this.element.inputList) {
      if (this.matchesDependentKeyValue(subElement, keyValue)) {
        this.childElements.push(subElement);
        if (subElement.defaultValue !== undefined) {
          this.formData.data[subElement.key] = subElement.defaultValue;
        } else {
          delete this.formData.data[subElement.key];
        }
      }
    }
  }

  private matchesDependentKeyValue(subElement: SchemaSubElement, keyValue: SchemaValue | undefined) {
    return Array.isArray(subElement.dependentKeyValue) ? keyValue && subElement.dependentKeyValue.includes(keyValue) : subElement.dependentKeyValue === keyValue;
  }
}
