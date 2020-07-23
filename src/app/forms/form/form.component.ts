import {Component, Input, OnInit} from '@angular/core';
import {Schema} from "../forms.interface";
import {FormsService} from "../forms.service";

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss']
})
export class FormComponent implements OnInit {
  @Input() type: string;
  schema?: Schema;

  constructor(
    private formsService: FormsService,
  ) {
  }

  ngOnInit(): void {
    this.formsService.loadSchema(this.type).subscribe(schema => {
      this.schema = schema;
    });
  }
}
