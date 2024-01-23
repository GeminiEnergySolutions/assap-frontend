import { CommonModule } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FormsModule as AppFormsModule } from '../shared/form/form.module';
import { NgbDropdownModule, NgbNavModule, NgbTooltipModule, NgbTypeaheadModule } from '@ng-bootstrap/ng-bootstrap';
import { SharedModule } from '../shared/shared.module';
import { AuditRoutingModule } from './audit-routing.module';
import { AuditComponent } from './audit.component';
import { PreAuditComponent } from './pre-audit/pre-audit.component';
import { ZoneListComponent } from './zone-list/zone-list.component';
// import { PhotosComponent } from '../audit/photos/photos.component';
import { AuditZoneService } from '../shared/services/audit-zone.service';
import { PreZoneComponent } from './zone-list/pre-zone/pre-zone.component';
import { ZoneComponent } from './zone-list/zone/zone.component';
import { TypeListComponent } from './zone-list/zone/type-list/type-list.component';
import { EquipmentService } from '../shared/services/equipment.service';
import { PreTypeComponent } from './zone-list/zone/type-list/pre-type/pre-type.component';
import { TypeComponent } from './zone-list/zone/type-list/type/type.component';
import { PhotosComponent } from './photos/photos.component';
import { FileUploadComponent } from './file-upload/file-upload.component';
import { MatPaginatorModule } from '@angular/material/paginator';
import { GenerateReportDialogComponent } from './generate-report-dialog/generate-report-dialog.component';
import { CleanEnergyHubComponent } from './clean-energy-hub/clean-energy-hub.component';
import { GrantComponent } from './grant/grant.component';
import { AddDataCollectorModalComponent } from './pre-audit/data.component';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    MatPaginatorModule,
    FormsModule,
    NgbNavModule,
    NgbDropdownModule,
    AuditRoutingModule,
    NgbTooltipModule,
    AppFormsModule,
    NgbTypeaheadModule,
    // CompanycamModule,
  ],
  providers: [
    AuditZoneService,
    EquipmentService,
  ],
  declarations: [
    AuditComponent,
    PreAuditComponent,
    AddDataCollectorModalComponent,
    ZoneListComponent,
    PhotosComponent,
    PreZoneComponent,
    ZoneComponent,
    TypeListComponent,
    PreTypeComponent,
    TypeComponent,
    FileUploadComponent,
    GenerateReportDialogComponent,
    CleanEnergyHubComponent,
    GrantComponent,
    // AccessControlComponent,
  ],
  // schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AuditModule {
}
