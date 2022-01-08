import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';
import {NgbDropdownModule} from '@ng-bootstrap/ng-bootstrap';
import {MasterDetailComponent} from './master-detail/master-detail.component';
import {OptionsDropdownComponent} from './options-dropdown/options-dropdown.component';
import {SafePipe} from './safe.pipe';


@NgModule({
  declarations: [
    MasterDetailComponent,
    OptionsDropdownComponent,
    SafePipe,
  ],
  imports: [
    CommonModule,
    RouterModule,
    NgbDropdownModule,
  ],
  exports: [
    MasterDetailComponent,
    OptionsDropdownComponent,
    SafePipe,
  ],
})
export class SharedModule {
}
