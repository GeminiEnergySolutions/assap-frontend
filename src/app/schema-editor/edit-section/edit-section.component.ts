import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {SchemaSection} from '../../shared/model/schema.interface';
import {SchemaContextService} from '../schema-context.service';

@Component({
  selector: 'app-edit-section',
  templateUrl: './edit-section.component.html',
  styleUrl: './edit-section.component.scss',
})
export class EditSectionComponent implements OnInit {
  section: SchemaSection = {id: 0, name: '', schema: []};

  constructor(
    private route: ActivatedRoute,
    private schemaContext: SchemaContextService,
  ) {
  }

  ngOnInit() {
    this.route.params.subscribe(({section}) => {
      this.section = this.schemaContext.schema.find(s => s.id == section) ?? this.section;
    });
  }
}
