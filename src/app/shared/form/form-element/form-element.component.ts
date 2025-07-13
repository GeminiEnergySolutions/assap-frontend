import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {NgbOffcanvas, NgbTooltip} from '@ng-bootstrap/ng-bootstrap';
import {HelpIconComponent} from '../../components/help-icon/help-icon.component';
import {SchemaElement, SchemaRequirement, SchemaSubElement, SchemaValue} from '../../model/schema.interface';
import {IsCurrencyPipe} from '../../pipe/is-currency.pipe';
import {SafePipe} from '../../pipe/safe.pipe';
import {ExpressionService} from '../../services/expression.service';
import {FormChoicesPipe} from '../form-choices.pipe';

@Component({
  selector: 'app-form-element',
  templateUrl: './form-element.component.html',
  styleUrl: './form-element.component.scss',
  imports: [
    NgbTooltip,
    FormsModule,
    FormChoicesPipe,
    IsCurrencyPipe,
    SafePipe,
    HelpIconComponent,
  ],
})
export class FormElementComponent implements OnInit, OnChanges {
  @Input() element!: SchemaElement;
  @Input() formId!: string;
  @Input() formData!: { data: Partial<Record<string, SchemaValue>> };

  @Output() dirty = new EventEmitter();

  id = '';

  validationMessages: SchemaRequirement[] = [];

  childElements: SchemaSubElement[] = [];

  constructor(
    private expressionService: ExpressionService,
    protected ngbOffcanvas: NgbOffcanvas,
  ) {
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.formId || changes.schema || changes.element) {
      this.id = `${this.formId}/${this.element.key}`;
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
    const oldKeys = this.childElements.map(e => e.key);
    this.childElements = [];
    if (!this.element.inputList?.length) {
      return;
    }

    // Determine which child elements should be visible
    const keyValue = this.formData.data[this.element.key];
    for (const subElement of this.element.inputList) {
      if (SchemaSubElement.matchesDependentKeyValue(subElement, keyValue)) {
        this.childElements.push(subElement);
        this.formData.data[subElement.key] ??= subElement.defaultValue;
      }
    }

    // Erase data for all fields that became hidden (and did not share a key with a field that is now visible)
    const newKeys = new Set(this.childElements.map(e => e.key));
    for (const key of oldKeys) {
      if (!newKeys.has(key)) {
        delete this.formData.data[key];
      }
    }
  }
}
