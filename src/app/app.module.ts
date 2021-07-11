import {HttpClientModule} from '@angular/common/http';
import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {AuditComponent} from './audit/audit.component';
import {FormsModule} from './forms/forms.module';
import {NavBarComponent} from './nav-bar/nav-bar.component';
import {PreAuditComponent} from './pre-audit/pre-audit.component';
import {PreTypeComponent} from './pre-type/pre-type.component';
import {PreZoneComponent} from './pre-zone/pre-zone.component';
import {TypeComponent} from './type/type.component';
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
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    NgbModule,
    AppRoutingModule,
    FormsModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {
}
