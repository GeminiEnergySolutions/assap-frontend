import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {PreTypeComponent} from './pre-type/pre-type.component';
import {CreateEquipmentComponent} from './create-equipment/create-equipment.component';
import {TypeComponent} from './type/type.component';
import {ConnectZoneComponent} from './connect-zone/connect-zone.component';
import {PhotosComponent} from '../audit/photos/photos.component';

const routes: Routes = [
  {
    path: ':eid',
    component: PreTypeComponent,
    children: [
      {
        path: 'new', component: CreateEquipmentComponent,
      },
      {path: 'types/:tid/photos', component: PhotosComponent},
      {
        path: 'types/:tid',
        component: TypeComponent,
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
