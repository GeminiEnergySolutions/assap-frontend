import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, RouterLink} from '@angular/router';
import {ToastService} from '@mean-stream/ngbx';
import {NgbTooltip} from '@ng-bootstrap/ng-bootstrap';
import {concatMap, mergeMap, switchMap, tap, toArray} from 'rxjs';

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

  constructor(
    private equipmentService: EquipmentService,
    private breadcrumbService: BreadcrumbService,
    private route: ActivatedRoute,
    private schemaService: SchemaService,
    private toastService: ToastService,
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
    const name = prompt('Enter the name of the new type');
    if (!name) {
      return;
    }

    this.equipmentService.createEquipmentType(category.id, {
      equipmentId: category.id,
      name,
    }).subscribe(({data}) => {
      this.equipmentTypes[category.id]?.push(data);
    });
  }

  duplicateSubType(subType: EquipmentType) {
    const name = prompt('Enter the name of the new type', subType.name);
    if (!name) {
      return;
    }

    this.equipmentService.createEquipmentType(subType.equipmentId, {
      equipmentId: subType.equipmentId,
      name,
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
  }
}
