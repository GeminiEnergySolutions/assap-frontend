import {Component, inject} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {RouterLink} from '@angular/router';
import {ToastService} from '@mean-stream/ngbx';
import {AuthService} from 'src/app/shared/services/auth.service';
import {BrandHeaderComponent} from '../brand-header/brand-header.component';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss'],
  imports: [
    BrandHeaderComponent,
    FormsModule,
    RouterLink,
  ],
})
export class ForgotPasswordComponent {
  private authService = inject(AuthService);
  private toastService = inject(ToastService);

  email = '';
  submitting = false;

  onSubmit() {
    this.submitting = true;
    this.authService.forgotPassword({
      email: this.email,
    }).subscribe({
      next: () => {
        this.submitting = false;
        this.toastService.success('Reset Password', 'A new password was sent to your email. Please check your inbox.');
      },
      error: () => this.submitting = false,
    });
  }
}
