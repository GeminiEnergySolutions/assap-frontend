import {Component, OnInit} from '@angular/core';
import {EquipmentService} from '../../shared/services/equipment.service';
import {EquipmentCategory, EquipmentType} from '../../shared/model/equipment.interface';
import {BreadcrumbService} from '../../shared/services/breadcrumb.service';
import {ActivatedRoute} from '@angular/router';

@Component({
  selector: 'app-select-schema',
  templateUrl: './select-schema.component.html',
  styleUrl: './select-schema.component.scss',
  standalone: false,
})
export class SelectSchemaComponent implements OnInit {
  categories: EquipmentCategory[] = [];
  equipmentTypes: Partial<Record<number, EquipmentType[]>> = {};

  constructor(
    private equipmentService: EquipmentService,
    private breadcrumbService: BreadcrumbService,
    private route: ActivatedRoute,
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
}
