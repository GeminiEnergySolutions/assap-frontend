import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Schema} from "../forms.interface";
import {FormsService} from "../forms.service";

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss']
})
export class FormComponent implements OnInit {
  @Input() type: string;
  @Input() schema?: Schema;

  @Input() data: object = {};
  @Output() dataChanged = new EventEmitter<object>();

  constructor(
    private formsService: FormsService,
  ) {
  }

  ngOnInit(): void {
    if (this.type && !this.schema) {
      this.formsService.loadSchema(this.type).subscribe(schema => {
        this.schema = schema;
      });
    }
  }

  save(): void {
    this.dataChanged.emit(this.data);
  }
}
