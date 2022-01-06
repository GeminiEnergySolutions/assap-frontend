import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {CompanycamModule} from '../companycam/companycam.module';

import {SettingsRoutingModule} from './settings-routing.module';
import {SettingsComponent} from './settings/settings.component';


@NgModule({
  declarations: [
    SettingsComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    SettingsRoutingModule,
    CompanycamModule,
  ],
})
export class SettingsModule {
}
