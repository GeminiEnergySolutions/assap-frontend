import {Component, TemplateRef, ViewChild} from '@angular/core';
import {Router, RouterLink} from '@angular/router';
import {AuthService} from 'src/app/shared/services/auth.service';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {BrandHeaderComponent} from '../brand-header/brand-header.component';
import {FormsModule} from '@angular/forms';

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
  @ViewChild('pendingModal', {static: true}) pendingModal!: TemplateRef<{}>;

  loggingIn = false;
  email = '';
  password = '';

  constructor(
    private authService: AuthService,
    private modalService: NgbModal,
    private router: Router,
  ) {
  }

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
