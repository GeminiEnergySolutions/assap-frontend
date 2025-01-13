import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {ModalModule} from '@mean-stream/ngbx';
import {NgbDropdownModule, NgbTooltipModule} from '@ng-bootstrap/ng-bootstrap';
import {FormsModule as AppFormsModule} from '../shared/form/form.module';
import {SharedModule} from '../shared/shared.module';
import {ConnectZoneComponent} from './connect-zone/connect-zone.component';
import {CreateEquipmentComponent} from './create-equipment/create-equipment.component';
import {EquipmentDetailComponent} from './equipment-detail/equipment-detail.component';
import {EquipmentListComponent} from './equipment-list/equipment-list.component';
import {EquipmentMasterDetailComponent} from './equipment-master-detail/equipment-master-detail.component';
import {EquipmentOptionsDropdownComponent} from './equipment-options-dropdown/equipment-options-dropdown.component';

import {EquipmentRoutingModule} from './equipment-routing.module';


@NgModule({
  imports: [
    CommonModule,
    EquipmentRoutingModule,
    ModalModule,
    FormsModule,
    NgbDropdownModule,
    NgbTooltipModule,
    SharedModule,
    AppFormsModule,
    EquipmentOptionsDropdownComponent,
  ],
  declarations: [
    EquipmentListComponent,
    EquipmentMasterDetailComponent,
    EquipmentDetailComponent,
    CreateEquipmentComponent,
    ConnectZoneComponent,
  ],
})
export class EquipmentModule {
}
