import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {EquipmentMasterDetailComponent} from './equipment-master-detail/equipment-master-detail.component';
import {CreateEquipmentComponent} from './create-equipment/create-equipment.component';
import {EquipmentDetailComponent} from './equipment-detail/equipment-detail.component';
import {ConnectZoneComponent} from './connect-zone/connect-zone.component';
import {PhotosComponent} from '../audit/photos/photos.component';

const routes: Routes = [
  {
    path: ':eid',
    component: EquipmentMasterDetailComponent,
    children: [
      {
        path: 'new', component: CreateEquipmentComponent,
      },
      {path: 'types/:tid/photos', component: PhotosComponent},
      {
        path: 'types/:tid',
        component: EquipmentDetailComponent,
        children: [
          {path: 'connect', component: ConnectZoneComponent},
        ],
      },
    ],
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EquipmentRoutingModule { }
