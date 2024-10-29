import {Component} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {EMPTY, switchMap} from 'rxjs';
import {EquipmentService} from '../../shared/services/equipment.service';
import {AuditService} from '../../shared/services/audit.service';
import {SchemaSection} from '../../shared/model/schema.interface';
import {SchemaContextService} from '../schema-context.service';

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
    private auditService: AuditService,
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
            return this.auditService.getPreAuditJsonSchema();
          case 'grants':
            this.schemaKind = 'Grants';
            return this.auditService.getGrantsJsonSchema();
          case 'ceh':
            this.schemaKind = 'Clean Energy Hub';
            return this.auditService.getCleanEnergyHubJsonSchema();
          case 'zone':
            this.schemaKind = 'Zone';
            return this.auditService.getZoneJsonSchema();
          case 'equipment':
            this.schemaKind = 'Equipment';
            this.equipmentService.getEquipmentType(id).subscribe(({data}) => this.schemaKind = data.name);
            return this.equipmentService.getEquipmentTypeSchema(id);
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
