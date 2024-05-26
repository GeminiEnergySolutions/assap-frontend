import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';
import {NgbCollapseModule, NgbDropdownModule, NgbTooltip} from '@ng-bootstrap/ng-bootstrap';
import {MasterDetailComponent} from './components/master-detail/master-detail.component';
import {OptionDropdownComponent} from './components/option-dropdown/option-dropdown.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {FormsModule as AppFormsModule} from '../shared/form/form.module';
import {MatIconModule} from '@angular/material/icon';
import {MatToolbarModule} from '@angular/material/toolbar';
import {OverlayModule} from '@angular/cdk/overlay';
import {PortalModule} from '@angular/cdk/portal';
import {MatPaginatorModule} from '@angular/material/paginator';
import {MatSliderModule} from '@angular/material/slider';
import {MatButtonModule} from '@angular/material/button';
import {MatDialogModule} from '@angular/material/dialog';
import {NgbxDarkmodeModule} from '@mean-stream/ngbx';
import {PhotosPipe} from './pipe/photos.pipe';
import {SafePipe} from './pipe/safe.pipe';


@NgModule({
  declarations: [
    MasterDetailComponent,
    OptionDropdownComponent,
    PhotosPipe,
    SafePipe,
  ],
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    AppFormsModule,
    PortalModule,
    OverlayModule,
    NgbDropdownModule,
    NgbCollapseModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    MatSliderModule,
    MatToolbarModule,
    MatPaginatorModule,
    NgbTooltip,
    NgbxDarkmodeModule,
  ],
  exports: [
    MasterDetailComponent,
    OptionDropdownComponent,
    PhotosPipe,
    SafePipe,
  ],
})
export class SharedModule {
}
