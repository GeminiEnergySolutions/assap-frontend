import {CommonModule} from '@angular/common';
import {HTTP_INTERCEPTORS} from '@angular/common/http';
import {NgModule} from '@angular/core';
import {ParseInterceptor} from './parse.interceptor';
import {ParseService} from './parse.service';


@NgModule({
  imports: [
    CommonModule,
  ],
  declarations: [],
  providers: [
    ParseInterceptor,
    ParseService,
    {
      provide: HTTP_INTERCEPTORS,
      multi: true,
      useClass: ParseInterceptor,
    },
  ],
})
export class ParseModule {
}
