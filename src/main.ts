import {enableProdMode, importProvidersFrom} from '@angular/core';


import {environment} from './environments/environment';
import {HTTP_INTERCEPTORS, provideHttpClient, withInterceptorsFromDi} from '@angular/common/http';
import {AuthInterceptor} from './app/shared/interceptor/auth.interceptor';
import {ErrorInterceptor} from './app/shared/interceptor/error.interceptor';
import {bootstrapApplication, BrowserModule} from '@angular/platform-browser';
import {provideAnimations} from '@angular/platform-browser/animations';
import {AppRoutingModule} from './app/app-routing.module';
import {ServiceWorkerModule} from '@angular/service-worker';
import {NgbDropdownModule} from '@ng-bootstrap/ng-bootstrap';
import {NgbxDarkmodeModule, ToastModule} from '@mean-stream/ngbx';
import {AppComponent} from './app/app.component';

if (environment.production) {
  enableProdMode();
}

bootstrapApplication(AppComponent, {
  providers: [
    importProvidersFrom(
      BrowserModule,
      AppRoutingModule,
      ServiceWorkerModule.register('ngsw-worker.js', {
        enabled: environment.production,
        // Register the ServiceWorker as soon as the app is stable
        // or after 30 seconds (whichever comes first).
        registrationStrategy: 'registerWhenStable:30000',
      }),
      NgbDropdownModule,
      NgbxDarkmodeModule,
      ToastModule,
    ),
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
    provideHttpClient(withInterceptorsFromDi()),
    provideAnimations(),
  ],
})
  .catch(err => console.error(err));
