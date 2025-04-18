import {Routes} from '@angular/router';
import {ZoneMasterDetailComponent} from './zone-master-detail/zone-master-detail.component';
import {ZoneFormComponent} from './zone-form/zone-form.component';
import {PhotosComponent} from '../audit/photos/photos.component';
import {ZoneDetailComponent} from './zone/zone-detail.component';
import {UnsavedChangesGuard} from '../shared/guard/unsaved-changes.guard';

export const routes: Routes = [
  {
    path: '',
    component: ZoneMasterDetailComponent,
    children: [
      {path: ':zid/details', component: ZoneFormComponent, canDeactivate: [UnsavedChangesGuard]},
      {path: ':zid/photos', component: PhotosComponent},
      {path: ':zid', component: ZoneDetailComponent},
    ],
  }
];
