import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {FormsModule as AppFormsModule} from '../shared/form/form.module';
import {
  NgbAccordionModule,
  NgbCollapse,
  NgbDropdownModule,
  NgbNavModule,
  NgbPagination,
  NgbTooltipModule,
  NgbTypeaheadModule,
} from '@ng-bootstrap/ng-bootstrap';
import {SharedModule} from '../shared/shared.module';
import {AuditRoutingModule} from './audit-routing.module';
import {AuditDetailComponent} from './audit-detail/audit-detail.component';
import {AuditMasterDetailComponent} from './audit-master-detail/audit-master-detail.component';
import {AuditZoneService} from '../shared/services/audit-zone.service';
import {EquipmentService} from '../shared/services/equipment.service';
import {PhotosComponent} from './photos/photos.component';
import {CleanEnergyHubComponent} from './clean-energy-hub/clean-energy-hub.component';
import {GrantsComponent} from './grants/grants.component';
import {ModalModule} from '@mean-stream/ngbx';
import {AddDataCollectorModalComponent} from './add-data-collector-modal/add-data-collector-modal.component';
import {PreauditFormComponent} from './preaudit-form/preaudit-form.component';
import {OptionsDropdownComponent} from './options-dropdown/options-dropdown.component';
import {CreateAuditModalComponent} from './create-audit-modal/create-audit-modal.component';
import {EquipmentOverviewComponent} from './equipment-overview/equipment-overview.component';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    FormsModule,
    NgbNavModule,
    NgbDropdownModule,
    AuditRoutingModule,
    NgbTooltipModule,
    AppFormsModule,
    NgbTypeaheadModule,
    ModalModule,
    NgbAccordionModule,
    NgbCollapse,
    NgbPagination,
  ],
  providers: [
    AuditZoneService,
    EquipmentService,
  ],
  declarations: [
    AuditDetailComponent,
    AuditMasterDetailComponent,
    AddDataCollectorModalComponent,
    PhotosComponent,
    CleanEnergyHubComponent,
    GrantsComponent,
    PreauditFormComponent,
    OptionsDropdownComponent,
    CreateAuditModalComponent,
    EquipmentOverviewComponent,
  ],
})
export class AuditModule {
}
