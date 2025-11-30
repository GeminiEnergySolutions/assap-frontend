import {Component, inject, TemplateRef, ViewChild} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {Router, RouterLink} from '@angular/router';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {AuthService} from 'src/app/shared/services/auth.service';
import {BrandHeaderComponent} from '../brand-header/brand-header.component';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  imports: [
    BrandHeaderComponent,
    FormsModule,
    RouterLink,
  ],
})
export class LoginComponent {
  private authService = inject(AuthService);
  private modalService = inject(NgbModal);
  private router = inject(Router);

  @ViewChild('pendingModal', {static: true}) pendingModal!: TemplateRef<unknown>;

  loggingIn = false;
  email = '';
  password = '';

  login() {
    this.loggingIn = true;
    this.authService.login({
      email: this.email,
      password: this.password,
    }).subscribe({
      next: ({data}) => {
        this.loggingIn = false;
        localStorage.setItem('accessToken', data.token);
        this.authService.currentLoginUser = data.user;
        this.router.navigate(['audits']);
      },
      error: err => {
        if (err.status === 400 && err.error.message === 'Authorized still in pending') {
          this.modalService.open(this.pendingModal);
        }
        this.loggingIn = false;
      },
    });
  }
}
