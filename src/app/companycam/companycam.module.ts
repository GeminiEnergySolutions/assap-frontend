import {CommonModule} from '@angular/common';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import {NgModule} from '@angular/core';
import {CompanycamInterceptor} from './companycam.interceptor';
import {CompanycamService} from './companycam.service';


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    HttpClientModule,
  ],
  providers: [
    CompanycamService,
    {
      provide: HTTP_INTERCEPTORS,
      multi: true,
      useClass: CompanycamInterceptor,
    },
  ],
})
export class CompanycamModule {
}
