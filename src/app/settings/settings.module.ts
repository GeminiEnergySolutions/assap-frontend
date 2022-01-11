import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {CompanycamModule} from '../companycam/companycam.module';
import {EditProfileComponent} from './edit-profile/edit-profile.component';

import {SettingsRoutingModule} from './settings-routing.module';
import {SettingsComponent} from './settings/settings.component';


@NgModule({
  declarations: [
    SettingsComponent,
    EditProfileComponent,
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
