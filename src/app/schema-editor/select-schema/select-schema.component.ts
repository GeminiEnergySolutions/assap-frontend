import {Component, OnInit} from '@angular/core';
import {EquipmentService} from '../../shared/services/equipment.service';
import {EquipmentCategory, EquipmentType} from '../../shared/model/equipment.interface';
import {RouterLink} from '@angular/router';

@Component({
  selector: 'app-select-schema',
  templateUrl: './select-schema.component.html',
  styleUrl: './select-schema.component.scss',
  imports: [RouterLink],
})
export class SelectSchemaComponent implements OnInit {
  categories: EquipmentCategory[] = [];
  equipmentTypes: Partial<Record<number, EquipmentType[]>> = {};

  constructor(
    private equipmentService: EquipmentService,
  ) {
  }

  ngOnInit() {
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
