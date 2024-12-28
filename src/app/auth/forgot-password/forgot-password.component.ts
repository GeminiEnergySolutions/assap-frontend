import {Component} from '@angular/core';
import {ToastService} from '@mean-stream/ngbx';
import {AuthService} from 'src/app/shared/services/auth.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss'],
  standalone: false,
})
export class ForgotPasswordComponent {
  email = '';
  submitting = false;

  constructor(
    private authService: AuthService,
    private toastService: ToastService,
  ) {
  }

  onSubmit() {
    this.submitting = true;
    this.authService.forgotPassword({
      email: this.email,
    }).subscribe(() => {
      this.submitting = false;
      this.toastService.success('Reset Password', 'A new password was sent to your email. Please check your inbox.');
    }, () => {
      this.submitting = false;
    });
  }
}
