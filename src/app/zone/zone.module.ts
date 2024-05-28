import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {ZoneRoutingModule} from './zone-routing.module';
import {ZoneListComponent} from './zone-list/zone-list.component';
import {PreZoneComponent} from '../audit/pre-zone/pre-zone.component';
import {ZoneComponent} from './zone/zone.component';
import {ZoneFormComponent} from './zone-form/zone-form.component';
import {SharedModule} from '../shared/shared.module';
import {NgbDropdownModule} from '@ng-bootstrap/ng-bootstrap';
import {FormsModule} from '../shared/form/form.module';


@NgModule({
  declarations: [
    ZoneListComponent,
    PreZoneComponent,
    ZoneComponent,
    ZoneFormComponent,
  ],
  imports: [
    CommonModule,
    ZoneRoutingModule,
    SharedModule,
    NgbDropdownModule,
    FormsModule,
  ],
})
export class ZoneModule { }
