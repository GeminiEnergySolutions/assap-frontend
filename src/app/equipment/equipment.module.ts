import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {EquipmentRoutingModule} from './equipment-routing.module';
import {ConnectZoneComponent} from './connect-zone/connect-zone.component';
import {CreateEquipmentComponent} from './create-equipment/create-equipment.component';
import {EquipmentDetailComponent} from './equipment-detail/equipment-detail.component';
import {EquipmentMasterDetailComponent} from './equipment-master-detail/equipment-master-detail.component';
import {EquipmentListComponent} from './equipment-list/equipment-list.component';
import {ModalModule} from '@mean-stream/ngbx';
import {SharedModule} from '../shared/shared.module';
import {FormsModule as AppFormsModule} from '../shared/form/form.module';
import {NgbDropdownModule, NgbTooltipModule} from '@ng-bootstrap/ng-bootstrap';
import {FormsModule} from '@angular/forms';


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
