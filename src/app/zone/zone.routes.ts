import {Routes} from '@angular/router';
import {ZoneMasterDetailComponent} from './zone-master-detail/zone-master-detail.component';
import {ZoneFormComponent} from './zone-form/zone-form.component';
import {PhotosComponent} from '../audit/photos/photos.component';
import {ZoneDetailComponent} from './zone/zone-detail.component';

export const routes: Routes = [
  {
    path: '',
    component: ZoneMasterDetailComponent,
    children: [
      {path: ':zid/details', component: ZoneFormComponent},
      {path: ':zid/photos', component: PhotosComponent},
      {path: ':zid', component: ZoneDetailComponent},
    ],
  }
];
