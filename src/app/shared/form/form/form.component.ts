import {Component, EventEmitter, Input, Output} from '@angular/core';
import {ToastService} from '@mean-stream/ngbx';
import {EquipmentService} from '../../services/equipment.service';
import {CopySpec, SchemaSection} from '../../model/schema.interface';
import {PercentageCompletion} from '../../model/percentage-completion.interface';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss'],
})
export class FormComponent {
  @Input({required: true}) typeSchema!: SchemaSection[];
  @Input({required: true}) formData!: { id?: string | number; data: any };
  /** for offline storage */
  @Input() formId: string = '';
  @Output() saved = new EventEmitter<void>();

  dirty = false;

  constructor(
    private toastService: ToastService,
  ) {
  }

  save() {
    if (!this.formData) {
      return;
    }

    // delete localStorage keys starting with this.formId
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key?.startsWith(this.formId)) {
        localStorage.removeItem(key);
      }
    }

    this.saved.emit();

    this.dirty = false;
  }

  isMediumPage(schema: any, element: any) {
    let gridSize = 'col-12';
    if (schema.name == "Electric Vehicle") {
      gridSize = element.key.includes("ev_type_1_time") || element.key.includes("ev_type_2_time") || element.key.includes("ev_type_3_time") ? 'col-6' : gridSize;
    } else if (schema.name == "Non Electric Vehicle") {
      gridSize = element.key.includes("non_ev_type_1_time") || element.key.includes("non_ev_type_2_time") || element.key.includes("non_ev_type_3_time") ? 'col-6' : gridSize;
    } else if (schema.name == "Occupied Hours") {
      gridSize = element.key.includes("hour_time_") ? 'col-6' : gridSize;
    }
    return gridSize;
  }

  setDirty() {
    this.dirty = true;
  }

  canDeactivate(): boolean {
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

  getProgress(schema: SchemaSection): PercentageCompletion {
    let requireElements = schema.schema.filter(e => e.required);
    const totalFields = requireElements.length;
    const completedFields = requireElements.filter(e => {
      const data = this.formData?.data[e.key];
      return data !== undefined && data !== null && data !== '';
    }).length;
    const percentage = (completedFields / totalFields) * 100;
    return {totalFields, completedFields, percentage};
  }
}
