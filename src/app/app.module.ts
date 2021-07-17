import {HttpClientModule} from '@angular/common/http';
import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {ServiceWorkerModule} from '@angular/service-worker';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {environment} from '../environments/environment';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {AuditComponent} from './audit/audit.component';
import {FormsModule as AppFormsModule} from './forms/forms.module';
import {MasterDetailComponent} from './master-detail/master-detail.component';
import {NavBarComponent} from './nav-bar/nav-bar.component';
import {OptionsDropdownComponent} from './options-dropdown/options-dropdown.component';
import {ParseModule} from './parse/parse.module';
import {PreAuditComponent} from './pre-audit/pre-audit.component';
import {PreTypeComponent} from './pre-type/pre-type.component';
import {PreZoneComponent} from './pre-zone/pre-zone.component';
import {TypeListComponent} from './type-list/type-list.component';
import {TypeComponent} from './type/type.component';
import {ZoneListComponent} from './zone-list/zone-list.component';
import {ZoneComponent} from './zone/zone.component';

@NgModule({
  declarations: [
    AppComponent,
    NavBarComponent,
    PreAuditComponent,
    ZoneComponent,
    TypeComponent,
    AuditComponent,
    PreZoneComponent,
    PreTypeComponent,
    ZoneListComponent,
    TypeListComponent,
    MasterDetailComponent,
    OptionsDropdownComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    NgbModule,
    AppRoutingModule,
    AppFormsModule,
    ParseModule,
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: environment.production,
      // Register the ServiceWorker as soon as the app is stable
      // or after 30 seconds (whichever comes first).
      registrationStrategy: 'registerWhenStable:30000',
    }),
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {
}
