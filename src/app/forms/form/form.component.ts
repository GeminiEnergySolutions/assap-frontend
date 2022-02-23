import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {BehaviorSubject, of} from 'rxjs';
import {distinctUntilChanged, switchMap} from 'rxjs/operators';
import {Schema} from '../forms.interface';
import {FormsService} from '../forms.service';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss'],
})
export class FormComponent implements OnInit, OnDestroy {
  #schemaId = new BehaviorSubject<string | undefined>(undefined);

  @Input() schema?: Schema;

  @Input() data: Record<string, string> = {};
  @Output() saved = new EventEmitter<[Schema, object]>();

  dirty = false;

  constructor(
    private formsService: FormsService,
  ) {
  }

  @Input()
  set schemaId(id: string) {
    this.#schemaId.next(id);
  }

  ngOnInit(): void {
    this.#schemaId.pipe(
      distinctUntilChanged(),
      switchMap(id => id ? this.formsService.loadSchema(id) : of(undefined)),
    ).subscribe(schema => {
      this.schema = schema;
    });
  }

  ngOnDestroy() {
    this.#schemaId.complete();
  }

  save(): void {
    if (this.schema) {
      this.saved.emit([this.schema, this.data]);
    }
    this.dirty = false;
  }

  setDirty() {
    this.dirty = true;
  }

  canDeactivate(): boolean {
    return !this.dirty;
  }
}
