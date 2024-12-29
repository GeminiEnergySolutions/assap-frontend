import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {EquipmentRoutingModule} from './equipment-routing.module';
import {ConnectZoneComponent} from './connect-zone/connect-zone.component';
import {CreateEquipmentComponent} from './create-equipment/create-equipment.component';
import {EquipmentDetailComponent} from './equipment-detail/equipment-detail.component';
import {EquipmentMasterDetailComponent} from './equipment-master-detail/equipment-master-detail.component';
import {EquipmentListComponent} from './equipment-list/equipment-list.component';
import {ModalModule} from '@mean-stream/ngbx';
import {FormsModule as AppFormsModule} from '../shared/form/form.module';
import {NgbDropdownModule, NgbTooltipModule} from '@ng-bootstrap/ng-bootstrap';
import {FormsModule} from '@angular/forms';
import {ProgressBarComponent} from '../shared/components/progress-bar/progress-bar.component';
import {OptionDropdownComponent} from '../shared/components/option-dropdown/option-dropdown.component';
import {FeatureCardComponent} from '../shared/components/feature-card/feature-card.component';
import {PhotoCaptureComponent} from '../shared/components/photo-capture/photo-capture.component';
import {MasterDetailComponent} from '../shared/components/master-detail/master-detail.component';


@NgModule({
  imports: [
    CommonModule,
    EquipmentRoutingModule,
    ModalModule,
    FormsModule,
    NgbDropdownModule,
    NgbTooltipModule,
    AppFormsModule,
    ProgressBarComponent,
    OptionDropdownComponent,
    FeatureCardComponent,
    PhotoCaptureComponent,
    MasterDetailComponent,
    EquipmentListComponent,
    EquipmentMasterDetailComponent,
    EquipmentDetailComponent,
    CreateEquipmentComponent,
    ConnectZoneComponent,
  ],
})
export class EquipmentModule {
}
