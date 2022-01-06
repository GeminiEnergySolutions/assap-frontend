import {CommonModule} from '@angular/common';
import {HttpClientModule} from '@angular/common/http';
import {NgModule} from '@angular/core';
import {CompanycamCredentialService} from './companycam-credential.service';
import {CompanycamService} from './companycam.service';


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    HttpClientModule,
  ],
  providers: [
    CompanycamService,
    CompanycamCredentialService,
  ],
})
export class CompanycamModule {
}
