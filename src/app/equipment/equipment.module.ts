import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {EquipmentRoutingModule} from './equipment-routing.module';
import {ConnectZoneComponent} from './connect-zone/connect-zone.component';
import {CreateEquipmentComponent} from './create-equipment/create-equipment.component';
import {TypeComponent} from './type/type.component';
import {PreTypeComponent} from './pre-type/pre-type.component';
import {TypeListComponent} from './type-list/type-list.component';
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
    TypeListComponent,
    PreTypeComponent,
    TypeComponent,
    CreateEquipmentComponent,
    ConnectZoneComponent,
  ],
})
export class EquipmentModule {
}
