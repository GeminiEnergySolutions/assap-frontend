import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';


const routes: Routes = [
  {path: 'settings', loadChildren: () => import('./settings/settings.module').then(m => m.SettingsModule)},
  {path: 'audits', loadChildren: () => import('./audits/audits.module').then(m => m.AuditsModule)},
  {path: '', pathMatch: 'full', redirectTo: '/audits'},
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    paramsInheritanceStrategy: 'always',
  })],
  exports: [RouterModule],
})
export class AppRoutingModule {
}
