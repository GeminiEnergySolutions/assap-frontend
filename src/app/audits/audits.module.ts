import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {NgbDropdownModule, NgbNavModule, NgbTooltipModule, NgbTypeaheadModule} from '@ng-bootstrap/ng-bootstrap';
import {FormsModule as AppFormsModule} from '../forms/forms.module';
import {SharedModule} from '../shared/shared.module';
import {AccessControlComponent} from './access-control/access-control.component';
import {AuditService} from './audit.service';
import {AuditComponent} from './audit/audit.component';

import {AuditsRoutingModule} from './audits-routing.module';
import {FeatureService} from './feature.service';
import {IdService} from './id.service';
import {OfflineAuditService} from './offline-audit.service';
import {OfflineFeatureService} from './offline-feature.service';
import {ParseAuditService} from './parse-audit.service';
import {ParseFeatureService} from './parse-feature.service';
import {PreAuditComponent} from './pre-audit/pre-audit.component';
import {PreTypeComponent} from './pre-type/pre-type.component';
import {PreZoneComponent} from './pre-zone/pre-zone.component';
import {TypeListComponent} from './type-list/type-list.component';
import {TypeService} from './type.service';
import {TypeComponent} from './type/type.component';
import {ZoneListComponent} from './zone-list/zone-list.component';
import {ZoneService} from './zone.service';
import {ZoneComponent} from './zone/zone.component';


@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    FormsModule,
    NgbNavModule,
    NgbDropdownModule,
    AuditsRoutingModule,
    NgbTooltipModule,
    FormsModule,
    AppFormsModule,
    NgbTypeaheadModule,
  ],
  providers: [
    IdService,
    AuditService,
    OfflineAuditService,
    ParseAuditService,
    ZoneService,
    TypeService,
    FeatureService,
    OfflineFeatureService,
    ParseFeatureService,
  ],
  declarations: [
    PreAuditComponent,
    ZoneComponent,
    TypeComponent,
    AuditComponent,
    PreZoneComponent,
    PreTypeComponent,
    ZoneListComponent,
    TypeListComponent,
    AccessControlComponent,
  ],
})
export class AuditsModule {
}
