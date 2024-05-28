import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {PreZoneComponent} from '../audit/pre-zone/pre-zone.component';
import {ZoneFormComponent} from './zone-form/zone-form.component';
import {PhotosComponent} from '../audit/photos/photos.component';
import {ZoneComponent} from './zone/zone.component';

const routes: Routes = [
  {
    path: '',
    component: PreZoneComponent,
    children: [
      {path: ':zid/details', component: ZoneFormComponent},
      {path: ':zid/photos', component: PhotosComponent},
      {path: ':zid', component: ZoneComponent},
    ],
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ZoneRoutingModule { }
