import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {EMPTY, switchMap} from 'rxjs';
import {EquipmentService} from '../../shared/services/equipment.service';
import {SchemaSection} from '../../shared/model/schema.interface';
import {SchemaContextService} from '../schema-context.service';
import {SchemaKind, SchemaService} from '../../shared/services/schema.service';

@Component({
  selector: 'app-edit-schema',
  templateUrl: './edit-schema.component.html',
  styleUrl: './edit-schema.component.scss',
  providers: [SchemaContextService],
})
export class EditSchemaComponent implements OnInit {
  kind: SchemaKind = 'preAudit';
  title = '';
  schemaSections: SchemaSection[] = [];

  constructor(
    private route: ActivatedRoute,
    private schemaService: SchemaService,
    private equipmentService: EquipmentService,
    private schemaContext: SchemaContextService,
  ) {
  }

  ngOnInit() {
    this.route.params.pipe(
      switchMap(({kind, id}) => {
        switch (kind) {
          case 'preaudit':
            this.kind = 'preAudit';
            this.title = 'Preaudit';
            break;
          case 'grants':
            this.kind = 'grants';
            this.title = 'Grants';
            break;
          case 'ceh':
            this.kind = 'ceh';
            this.title = 'Clean Energy Hub';
            break;
          case 'zone':
            this.kind = 'zone';
            this.title = 'Zone';
            break;
          case 'equipment':
            this.kind = `equipment/${id}`;
            this.title = 'Equipment';
            this.equipmentService.getEquipmentType(id).subscribe(({data}) => this.title = data.name);
            break;
          default:
            this.title = '(invalid)';
            return EMPTY;
        }
        return this.schemaService.getSchema(this.kind);
      }),
    ).subscribe(({data}) => {
      this.schemaSections = data;
      this.schemaContext.schema = data;
    });
  }

  addSection() {
    this.schemaService.createSchemaSection(this.kind, {
      id: 0,
      name: 'New Section',
      schema: [],
    }).subscribe(({data}) => {
      this.schemaSections.push(data);
    });
  }
}
