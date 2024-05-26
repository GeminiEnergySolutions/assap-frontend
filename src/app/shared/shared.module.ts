import {CommonModule, DatePipe} from '@angular/common';
import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';
import {NgbCollapseModule, NgbDropdownModule, NgbTooltip} from '@ng-bootstrap/ng-bootstrap';
import {MasterDetailComponent} from './components/master-detail/master-detail.component';
import {OptionDropdownComponent} from './components/option-dropdown/option-dropdown.component';
import {PageNotFoundComponent} from './components/page-not-found/page-not-found.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {FormsModule as AppFormsModule} from '../shared/form/form.module';
import {NavBarComponent} from './components/nav-bar/nav-bar.component';
import {MatIconModule} from '@angular/material/icon';
import {MatToolbarModule} from '@angular/material/toolbar';
import {OverlayModule} from '@angular/cdk/overlay';
import {PortalModule} from '@angular/cdk/portal';
import {PipeModule} from './pipe/pipe.module';
import {ChangePasswordComponent} from './components/change-password/change-password.component';
import {MatPaginatorModule} from '@angular/material/paginator';
import {MatSliderModule} from '@angular/material/slider';
import {MatButtonModule} from '@angular/material/button';
import {MatDialogModule} from '@angular/material/dialog';
import {NgbxDarkmodeModule} from '@mean-stream/ngbx';


@NgModule({
  declarations: [
    MasterDetailComponent,
    OptionDropdownComponent,
    PageNotFoundComponent,
    NavBarComponent,
    ChangePasswordComponent,
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
    PipeModule,
    NgbTooltip,
    NgbxDarkmodeModule,
  ],
  exports: [
    MasterDetailComponent,
    OptionDropdownComponent,
    PageNotFoundComponent,
    NavBarComponent,
  ],
  providers: [DatePipe]
})
export class SharedModule {
}
