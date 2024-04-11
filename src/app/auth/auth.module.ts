import { CommonModule } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FormsModule as AppFormsModule } from '../shared/form/form.module';
import { AuthRoutingModule } from './auth-routing.module';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { BrandHeaderComponent } from './brand-header/brand-header.component';
// import { SharedModule } from '../shared/shared.module';

@NgModule({
    imports: [
        CommonModule,
        AuthRoutingModule,
        // SharedModule,
        FormsModule,
        ReactiveFormsModule,
        AppFormsModule,
    ],
    providers: [],
    declarations: [
        LoginComponent,
        SignupComponent,
        ForgotPasswordComponent,
        BrandHeaderComponent,
    ],
    exports: [
        BrandHeaderComponent,
    ],
    // schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AuthModule {
}
