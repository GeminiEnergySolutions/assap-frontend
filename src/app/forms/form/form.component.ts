import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {BehaviorSubject, of} from 'rxjs';
import {distinctUntilChanged, switchMap} from 'rxjs/operators';
import {FeatureData} from '../../audits/model/feature.interface';
import {Schema, SchemaId} from '../schema';
import {SchemaService} from '../schema.service';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss'],
})
export class FormComponent {
  @Input() schema!: Schema;
  @Input() data: FeatureData = {};
  @Output() saved = new EventEmitter<FeatureData>();

  dirty = false;

  save(): void {
    this.saved.emit(this.data);
    this.dirty = false;
  }

  setDirty() {
    this.dirty = true;
  }

  canDeactivate(): boolean {
    return !this.dirty;
  }
}
