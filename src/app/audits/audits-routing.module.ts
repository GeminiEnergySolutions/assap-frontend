import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {UnsavedChangesGuard} from '../unsaved-changes.guard';
import {AccessControlComponent} from './access-control/access-control.component';
import {AuditComponent} from './audit/audit.component';
import {PhotosComponent} from './photos/photos.component';
import {PreAuditComponent} from './pre-audit/pre-audit.component';
import {PreTypeComponent} from './pre-type/pre-type.component';
import {PreZoneComponent} from './pre-zone/pre-zone.component';
import {TypeComponent} from './type/type.component';
import {ZoneListComponent} from './zone-list/zone-list.component';
import {ZoneComponent} from './zone/zone.component';

const routes: Routes = [
  {
    path: '',
    component: PreAuditComponent,
    children: [
      {
        path: ':aid',
        component: AuditComponent,
        canDeactivate: [UnsavedChangesGuard],
        children: [
          {path: 'zones', component: ZoneListComponent},
          {path: 'photos', component: PhotosComponent},
          {path: 'access', component: AccessControlComponent},
        ],
      },
    ],
  },
  {
    path: ':aid/zones',
    component: PreZoneComponent,
    children: [
      {path: ':zid', component: ZoneComponent},
    ],
  },
  {
    path: ':aid/zones/:zid/:type',
    component: PreTypeComponent,
    children: [
      {path: ':tid', component: TypeComponent, canDeactivate: [UnsavedChangesGuard]},
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AuditsRoutingModule {
}
