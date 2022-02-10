import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {BehaviorSubject, of} from 'rxjs';
import {distinctUntilChanged, switchMap} from 'rxjs/operators';
import {Schema, SchemaId} from '../forms.interface';
import {SchemaService} from '../schema.service';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss'],
})
export class FormComponent implements OnInit, OnDestroy {
  #schemaId = new BehaviorSubject<SchemaId | undefined>(undefined);

  @Input() schema?: Schema;

  @Input() data: Record<string, string> = {};
  @Output() saved = new EventEmitter<[Schema, object]>();

  dirty = false;

  constructor(
    private schemaService: SchemaService,
  ) {
  }

  @Input()
  set schemaId(id: SchemaId) {
    this.#schemaId.next(id);
  }

  ngOnInit(): void {
    this.#schemaId.pipe(
      distinctUntilChanged(),
      switchMap(id => id ? this.schemaService.loadSchema(id) : of(undefined)),
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
