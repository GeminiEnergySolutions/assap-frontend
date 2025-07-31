import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, RouterLink} from '@angular/router';
import {ToastService} from '@mean-stream/ngbx';
import {NgbTooltip} from '@ng-bootstrap/ng-bootstrap';
import {concatMap, mergeMap, switchMap, tap, toArray} from 'rxjs';
import {PromptModalService} from '../../shared/components/prompt-modal/prompt-modal.service';
import {icons} from '../../shared/icons';

import {EquipmentCategory, EquipmentType} from '../../shared/model/equipment.interface';
import {BreadcrumbService} from '../../shared/services/breadcrumb.service';
import {EquipmentService} from '../../shared/services/equipment.service';
import {SchemaService} from '../../shared/services/schema.service';

@Component({
  selector: 'app-select-schema',
  templateUrl: './select-schema.component.html',
  styleUrl: './select-schema.component.scss',
  imports: [RouterLink, NgbTooltip],
})
export class SelectSchemaComponent implements OnInit {
  categories: EquipmentCategory[] = [];
  equipmentTypes: Partial<Record<number, EquipmentType[]>> = {};

  protected readonly icons = icons;

  constructor(
    private equipmentService: EquipmentService,
    private breadcrumbService: BreadcrumbService,
    private route: ActivatedRoute,
    private schemaService: SchemaService,
    private toastService: ToastService,
    private promptModalService: PromptModalService,
  ) {
  }

  ngOnInit() {
    this.breadcrumbService.setBreadcrumbs([
      {label: 'Schema Editor', routerLink: '.', relativeTo: this.route},
    ]);

    this.equipmentService.getEquipmentCategories().subscribe(categories => {
      this.categories = categories.data;
      for (const category of categories.data) {
        this.equipmentService.getEquipmentTypes(category.id).subscribe(types => {
          this.equipmentTypes[category.id] = types.data;
        });
      }
    });
  }

  addSubType(category: EquipmentCategory) {
    this.promptModalService.prompt(this.promptModalService.simplePrompt(
      'Add Subtype',
      'Subtype Name',
      'Create',
    )).then(({value}) => {
      this.equipmentService.createEquipmentType(category.id, {
        equipmentId: category.id,
        name: value,
      }).subscribe(({data}) => {
        this.equipmentTypes[category.id]?.push(data);
      });
    })
  }

  duplicateSubType(subType: EquipmentType) {
    this.promptModalService.prompt(this.promptModalService.simplePrompt(
      'Duplicate Subtype',
      'New Subtype Name',
      'Duplicate',
    ), {
      value: `${subType.name} (Copy)`,
    }).then(({value}) => {
      this.equipmentService.createEquipmentType(subType.equipmentId, {
        equipmentId: subType.equipmentId,
        name: value,
      }).pipe(
        tap(({data}) => this.equipmentTypes[subType.equipmentId]?.push(data)),
        switchMap(newSubType => this.schemaService.getSchema(`equipment/${subType.id}`).pipe(
          mergeMap(({data}) => data),
          concatMap(schema => this.schemaService.createSchemaSection(`equipment/${subType.equipmentId}`, {
            ...schema,
            id: 0,
            typeId: newSubType.data.id,
          })),
          toArray(),
        )),
      ).subscribe(result => {
        this.toastService.success(
          'Duplicated Subtype',
          `Successfully duplicated subtype ${subType.name} and ${result.length} schema sections`,
        );
      });
    });
  }

  deleteSubType(subType: EquipmentType) {
    this.promptModalService.prompt(this.promptModalService.confirmDanger({
      title: 'Delete Subtype',
      text: `Are you sure you want to delete the subtype "${subType.name}"?`,
      dangerText: 'This action cannot be undone.',
      submitLabel: 'Yes, Delete',
    }, {
      type: 'checkbox',
    })).then(() => {
      this.equipmentService.deleteEquipmentType(subType.equipmentId, subType.id).subscribe(() => {
        this.equipmentTypes[subType.equipmentId]!.splice(this.equipmentTypes[subType.equipmentId]!.indexOf(subType), 1);
        this.toastService.warn('Deleted Subtype', `Successfully deleted subtype ${subType.name}`);
      });
    });
  }
}
