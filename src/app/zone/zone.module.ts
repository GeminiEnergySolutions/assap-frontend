import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {ZoneRoutingModule} from './zone-routing.module';
import {ZoneListComponent} from './zone-list/zone-list.component';
import {ZoneMasterDetailComponent} from './zone-master-detail/zone-master-detail.component';
import {ZoneDetailComponent} from './zone/zone-detail.component';
import {ZoneFormComponent} from './zone-form/zone-form.component';
import {NgbDropdownModule} from '@ng-bootstrap/ng-bootstrap';
import {FormsModule} from '../shared/form/form.module';
import {ProgressBarComponent} from '../shared/components/progress-bar/progress-bar.component';
import {PhotoCaptureComponent} from '../shared/components/photo-capture/photo-capture.component';
import {FeatureCardComponent} from '../shared/components/feature-card/feature-card.component';
import {OptionDropdownComponent} from '../shared/components/option-dropdown/option-dropdown.component';
import {MasterDetailComponent} from '../shared/components/master-detail/master-detail.component';


@NgModule({
  declarations: [
    ZoneListComponent,
    ZoneMasterDetailComponent,
    ZoneDetailComponent,
    ZoneFormComponent,
  ],
  imports: [
    CommonModule,
    ZoneRoutingModule,
    NgbDropdownModule,
    FormsModule,
    ProgressBarComponent,
    PhotoCaptureComponent,
    FeatureCardComponent,
    OptionDropdownComponent,
    MasterDetailComponent,
  ],
})
export class ZoneModule { }
