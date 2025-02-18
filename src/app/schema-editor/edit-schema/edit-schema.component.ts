import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, RouterLink} from '@angular/router';
import {EMPTY, switchMap} from 'rxjs';

import {MasterDetailComponent} from '../../shared/components/master-detail/master-detail.component';
import {FormComponent} from '../../shared/form/form/form.component';
import {SaveableChangesComponent} from '../../shared/guard/unsaved-changes.guard';
import {icons} from '../../shared/icons';
import {SchemaSection} from '../../shared/model/schema.interface';
import {Breadcrumb, BreadcrumbService} from '../../shared/services/breadcrumb.service';
import {EquipmentService} from '../../shared/services/equipment.service';
import {SchemaKind, SchemaService} from '../../shared/services/schema.service';
import {SchemaContextService} from '../schema-context.service';

@Component({
  selector: 'app-edit-schema',
  templateUrl: './edit-schema.component.html',
  styleUrl: './edit-schema.component.scss',
  providers: [SchemaContextService],
  imports: [
    MasterDetailComponent,
    RouterLink,
    FormComponent,
  ],
})
export class EditSchemaComponent implements OnInit, SaveableChangesComponent {
  kind: SchemaKind = 'preAudit';
  title = '';
  schemaSections: SchemaSection[] = [];

  constructor(
    private route: ActivatedRoute,
    private schemaService: SchemaService,
    private equipmentService: EquipmentService,
    private schemaContext: SchemaContextService,
    private breadcrumbService: BreadcrumbService,
  ) {
  }

  isSaved(): boolean {
    return this.schemaSections.every(section => !section._dirty);
  }

  ngOnInit() {
    const breadcrumb: Breadcrumb = {label: '', class: icons.schema, routerLink: '.', relativeTo: this.route};
    this.breadcrumbService.setBreadcrumbs([
      {label: 'Schema Editor', routerLink: '../..', relativeTo: this.route},
      breadcrumb,
    ]);

    this.route.params.pipe(
      switchMap(({kind, id}) => {
        switch (kind) {
          case 'preaudit':
            this.kind = 'preAudit';
            this.title = breadcrumb.label = 'Preaudit';
            break;
          case 'grants':
            this.kind = 'grants';
            this.title = breadcrumb.label = 'Grants';
            break;
          case 'ceh':
            this.kind = 'ceh';
            this.title = breadcrumb.label = 'Clean Energy Hub';
            break;
          case 'zone':
            this.kind = 'zone';
            this.title = breadcrumb.label = 'Zone';
            break;
          case 'equipment':
            this.kind = `equipment/${id}`;
            this.title = breadcrumb.label = 'Equipment';
            // Category ID does not seem to matter, we just pass 0
            this.equipmentService.getEquipmentType(0, id).subscribe(({data}) => {
              this.title = breadcrumb.label = data.name;
            });
            break;
          default:
            this.title = breadcrumb.label = '(invalid)';
            return EMPTY;
        }
        return this.schemaService.getSchema(this.kind);
      }),
    ).subscribe(({data}) => {
      this.schemaSections = data;
      this.schemaContext.kind = this.kind;
      this.schemaContext.schema = data;
      this.schemaContext.loaded.next(true);
    });
  }

  addSection() {
    this.schemaService.createSchemaSection(this.kind, {
      id: 0,
      typeId: this.route.snapshot.params.id,
      name: 'New Section',
      schema: [],
    }).subscribe(({data}) => {
      this.schemaSections.push(data);
    });
  }

  deleteSection(section: SchemaSection) {
    if (!confirm('Are you sure you want to delete this section? This cannot be undone.')) {
      return;
    }

    this.schemaService.deleteSchemaSection(this.kind, section.id).subscribe(() => {
      this.schemaSections.splice(this.schemaSections.indexOf(section), 1);
    });
  }
}
