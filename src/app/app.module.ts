import {HttpClientModule} from '@angular/common/http';
import {NgModule} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {BrowserModule} from '@angular/platform-browser';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {AuditComponent} from './audit/audit.component';
import {FormsModule as AppFormsModule} from './forms/forms.module';
import {NavBarComponent} from './nav-bar/nav-bar.component';
import {ParseModule} from './parse/parse.module';
import {PreAuditComponent} from './pre-audit/pre-audit.component';
import {PreTypeComponent} from './pre-type/pre-type.component';
import {PreZoneComponent} from './pre-zone/pre-zone.component';
import {SettingsComponent} from './settings/settings.component';
import {TypeComponent} from './type/type.component';
import {ZoneComponent} from './zone/zone.component';
import { ZoneListComponent } from './zone-list/zone-list.component';
import { TypeListComponent } from './type-list/type-list.component';
import { MasterDetailComponent } from './master-detail/master-detail.component';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';

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
    SettingsComponent,
    ZoneListComponent,
    TypeListComponent,
    MasterDetailComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    NgbModule,
    AppRoutingModule,
    FormsModule,
    AppFormsModule,
    ParseModule,
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: environment.production,
      // Register the ServiceWorker as soon as the app is stable
      // or after 30 seconds (whichever comes first).
      registrationStrategy: 'registerWhenStable:30000'
    }),
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {
}
