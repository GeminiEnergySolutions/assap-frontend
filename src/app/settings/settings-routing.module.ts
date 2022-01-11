import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {EditProfileComponent} from './edit-profile/edit-profile.component';
import {SettingsComponent} from './settings/settings.component';

const routes: Routes = [
  {path: 'profiles/:id', component: EditProfileComponent},
  {path: '', component: SettingsComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SettingsRoutingModule {
}
