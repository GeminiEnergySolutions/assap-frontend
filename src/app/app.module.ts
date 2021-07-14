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
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    NgbModule,
    AppRoutingModule,
    FormsModule,
    AppFormsModule,
    ParseModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {
}
