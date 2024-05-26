import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';
import {NgbDropdownModule} from '@ng-bootstrap/ng-bootstrap';
import {MasterDetailComponent} from './components/master-detail/master-detail.component';
import {OptionDropdownComponent} from './components/option-dropdown/option-dropdown.component';
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
    NgbDropdownModule,
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
