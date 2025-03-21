import {HTTP_INTERCEPTORS, provideHttpClient, withInterceptorsFromDi} from '@angular/common/http';
import {enableProdMode} from '@angular/core';
import {bootstrapApplication} from '@angular/platform-browser';
import {provideAnimations} from '@angular/platform-browser/animations';
import {provideRouter, withRouterConfig} from '@angular/router';
import {provideServiceWorker} from '@angular/service-worker';

import {AppComponent} from './app/app.component';
import {routes} from './app/app.routes';
import {AuthInterceptor} from './app/shared/interceptor/auth.interceptor';
import {ErrorInterceptor} from './app/shared/interceptor/error.interceptor';
import {environment} from './environments/environment';

if (environment.production) {
  enableProdMode();
}

bootstrapApplication(AppComponent, {
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
    provideRouter(routes, withRouterConfig({
      paramsInheritanceStrategy: 'always',
    })),
    provideServiceWorker('ngsw-worker.js', {
      enabled: environment.production,
      // Register the ServiceWorker as soon as the app is stable
      // or after 30 seconds (whichever comes first).
      registrationStrategy: 'registerWhenStable:30000',
    }),
    provideHttpClient(withInterceptorsFromDi()),
    provideAnimations(),
  ],
})
  .catch(err => console.error(err));
