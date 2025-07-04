import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {ToastService} from '@mean-stream/ngbx';
import {NgbTooltip} from '@ng-bootstrap/ng-bootstrap';
import {EMPTY, switchMap, tap} from 'rxjs';

import {MasterDetailComponent} from '../../shared/components/master-detail/master-detail.component';
import {PromptModalService} from '../../shared/components/prompt-modal/prompt-modal.service';
import {FormComponent} from '../../shared/form/form/form.component';
import {SaveableChangesComponent} from '../../shared/guard/unsaved-changes.guard';
import {icons} from '../../shared/icons';
import {EquipmentType} from '../../shared/model/equipment.interface';
import {SchemaSection} from '../../shared/model/schema.interface';
import {Breadcrumb, BreadcrumbService} from '../../shared/services/breadcrumb.service';
import {CopyPasteService} from '../../shared/services/copy-paste.service';
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
    FormComponent,
    NgbTooltip,
  ],
})
export class EditSchemaComponent implements OnInit, SaveableChangesComponent {
  kind: SchemaKind = 'preAudit';
  title = '';
  schemaSections: SchemaSection[] = [];
  equipmentType?: EquipmentType;

  constructor(
    protected route: ActivatedRoute,
    private schemaService: SchemaService,
    private equipmentService: EquipmentService,
    private schemaContext: SchemaContextService,
    private breadcrumbService: BreadcrumbService,
    private toastService: ToastService,
    private copyPasteService: CopyPasteService,
    private promptModalService: PromptModalService,
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
            this.title = breadcrumb.label = 'Pre-Audit';
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
              this.equipmentType = data;
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
    this.promptModalService.prompt(this.promptModalService.simplePrompt(
      'Add Section',
      'New Section Name',
      'Create',
    )).then(({value}) => {
      this.schemaService.createSchemaSection(this.kind, {
        id: 0,
        typeId: this.route.snapshot.params.id,
        name: value,
        schema: [],
      }).subscribe(({data}) => {
        this.schemaSections.push(data);
      });
    })
  }

  pasteSection() {
    this.copyPasteService.paste<SchemaSection>([
      'name',
      'schema',
    ]).pipe(
      tap(section => {
        section.id = 0;
        section.typeId = +this.route.snapshot.params.id;
        if (this.schemaSections.some(s => s.name === section.name)) {
          section.name += ' (copy)';
        }
      }),
      switchMap(section => this.schemaService.createSchemaSection(this.kind, section)),
    ).subscribe({
      next: ({data}) => {
        this.schemaSections.push(data);
        this.toastService.success('Pasted Section', `Successfully pasted section ${data.name}`);
      },
      error: error => {
        this.toastService.error('Failed to Paste Section', 'Clipboard is empty or does not contain a valid section', error);
      },
    });
  }

  deleteSection(section: SchemaSection) {
    this.promptModalService.prompt(this.promptModalService.confirmDanger({
      title: 'Delete Section',
      text: `Are you sure you want to delete the section "${section.name}"?`,
      dangerText: 'This action cannot be undone.',
      submitLabel: 'Yes, Delete',
    }, {
      type: 'checkbox',
    })).then(() => {
      this.schemaService.deleteSchemaSection(this.kind, section.id).subscribe(() => {
        this.schemaSections.splice(this.schemaSections.indexOf(section), 1);
      });
    });
  }

  renameSubType() {
    this.promptModalService.prompt(this.promptModalService.simplePrompt(
      'Rename Subtype',
      'Subtype Name',
      'Rename',
    ), {
      value: this.title,
    }).then(({value}) => {
      this.equipmentService.updateEquipmentType(0, {
        id: this.equipmentType!.id,
        equipmentId: this.equipmentType!.equipmentId,
        name: value,
      }).subscribe(() => {
        this.title = value;
      });
    });
  }
}
