import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {ServiceWorkerModule} from '@angular/service-worker';
import {environment} from '../environments/environment';
import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {HomeComponent} from './home/home.component';
import {SharedModule} from './shared/shared.module';
import {AuthInterceptor} from './shared/interceptor/auth.interceptor';
import {ErrorInterceptor} from './shared/interceptor/error.interceptor';
import {PageNotFoundComponent} from './page-not-found/page-not-found.component';
import {NavBarComponent} from './nav-bar/nav-bar.component';
import {NgbDropdownModule} from '@ng-bootstrap/ng-bootstrap';
import {NgbxDarkmodeModule} from '@mean-stream/ngbx';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    PageNotFoundComponent,
    NavBarComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    SharedModule,
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: environment.production,
      // Register the ServiceWorker as soon as the app is stable
      // or after 30 seconds (whichever comes first).
      registrationStrategy: 'registerWhenStable:30000',
    }),
    NgbDropdownModule,
    NgbxDarkmodeModule,
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      multi: true,
      useClass: AuthInterceptor,
    },
    {
      provide: HTTP_INTERCEPTORS,
      multi: true,
      useClass: ErrorInterceptor,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {
}
