import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';
import {NgbDropdownModule} from '@ng-bootstrap/ng-bootstrap';
import {MasterDetailComponent} from './master-detail/master-detail.component';
import {OptionsDropdownComponent} from './options-dropdown/options-dropdown.component';


@NgModule({
  declarations: [
    MasterDetailComponent,
    OptionsDropdownComponent,
  ],
  imports: [
    CommonModule,
    RouterModule,
    NgbDropdownModule,
  ],
  exports: [
    MasterDetailComponent,
    OptionsDropdownComponent,
  ],
})
export class SharedModule {
}
