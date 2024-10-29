import {Component} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {EMPTY, switchMap} from 'rxjs';
import {EquipmentService} from '../../shared/services/equipment.service';
import {AuditService} from '../../shared/services/audit.service';
import {SchemaSection} from '../../shared/model/schema.interface';
import {SchemaContextService} from '../schema-context.service';
import {SchemaService} from '../../shared/services/schema.service';

@Component({
  selector: 'app-edit-schema',
  templateUrl: './edit-schema.component.html',
  styleUrl: './edit-schema.component.scss',
  providers: [SchemaContextService],
})
export class EditSchemaComponent {
  schemaKind = '';
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
            this.schemaKind = 'Preaudit';
            return this.schemaService.getSchema('preAudit');
          case 'grants':
            this.schemaKind = 'Grants';
            return this.schemaService.getSchema('grants');
          case 'ceh':
            this.schemaKind = 'Clean Energy Hub';
            return this.schemaService.getSchema('ceh');
          case 'zone':
            this.schemaKind = 'Zone';
            return this.schemaService.getSchema('zone');
          case 'equipment':
            this.schemaKind = 'Equipment';
            this.equipmentService.getEquipmentType(id).subscribe(({data}) => this.schemaKind = data.name);
            return this.schemaService.getSchema(`equipment/${id}`);
          default:
            this.schemaKind = '(invalid)';
            return EMPTY;
        }
      }),
    ).subscribe(({data}) => {
      this.schemaSections = data;
      this.schemaContext.schema = data;
    });
  }

  addSection() {
    this.schemaSections.push({
      id: -1,
      name: 'New Section',
      schema: [],
    });
  }
}
