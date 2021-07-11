import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MainComponent } from './main/main.component';
import { NavBarComponent } from './nav-bar/nav-bar.component';
import {NgbModule} from "@ng-bootstrap/ng-bootstrap";
import {FormsModule} from "./forms/forms.module";
import {HttpClientModule} from "@angular/common/http";
import { PreAuditComponent } from './pre-audit/pre-audit.component';
import { ZoneComponent } from './zone/zone.component';
import { TypeComponent } from './type/type.component';
import { AuditComponent } from './audit/audit.component';

@NgModule({
  declarations: [
    AppComponent,
    MainComponent,
    NavBarComponent,
    PreAuditComponent,
    ZoneComponent,
    TypeComponent,
    AuditComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    NgbModule,
    AppRoutingModule,
    FormsModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
