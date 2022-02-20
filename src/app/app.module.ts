import {HttpClientModule} from '@angular/common/http';
import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {ServiceWorkerModule} from '@angular/service-worker';
import {NgbCollapseModule, NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {ToastModule} from 'ng-bootstrap-ext';
import {environment} from '../environments/environment';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {FormsModule as AppFormsModule} from './forms/forms.module';
import {NavBarComponent} from './nav-bar/nav-bar.component';
import {ParseModule} from './parse/parse.module';
import { HomeComponent } from './home/home.component';

@NgModule({
  declarations: [
    AppComponent,
    NavBarComponent,
    HomeComponent,
  ],
    imports: [
        BrowserModule,
        HttpClientModule,
        NgbCollapseModule,
        AppRoutingModule,
        ParseModule,
        ServiceWorkerModule.register('ngsw-worker.js', {
            enabled: environment.production,
            // Register the ServiceWorker as soon as the app is stable
            // or after 30 seconds (whichever comes first).
            registrationStrategy: 'registerWhenStable:30000',
        }),
        ToastModule,
    ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {
}
