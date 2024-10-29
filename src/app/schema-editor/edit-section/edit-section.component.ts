import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {SchemaSection} from '../../shared/model/schema.interface';
import {SchemaContextService} from '../schema-context.service';
import {SchemaService} from '../../shared/services/schema.service';

@Component({
  selector: 'app-edit-section',
  templateUrl: './edit-section.component.html',
  styleUrl: './edit-section.component.scss',
})
export class EditSectionComponent implements OnInit {
  section: SchemaSection = {id: 0, name: '', schema: []};
  dirty = false;

  constructor(
    private route: ActivatedRoute,
    private schemaContext: SchemaContextService,
    private schemaService: SchemaService,
  ) {
  }

  ngOnInit() {
    this.route.params.subscribe(({section}) => {
      this.section = this.schemaContext.schema.find(s => s.id == section) ?? this.section;
    });
  }

  save() {
    this.schemaService.updateSchemaSection(this.schemaContext.kind, this.section.id, this.section).subscribe(() => {
      this.dirty = false;
    });
  }
}
