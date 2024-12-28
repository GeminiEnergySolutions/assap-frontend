import {Component, TemplateRef, ViewChild} from '@angular/core';
import {Router} from '@angular/router';
import {AuthService} from 'src/app/shared/services/auth.service';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  standalone: false,
})
export class LoginComponent {
  @ViewChild('pendingModal', {static: true}) pendingModal!: TemplateRef<any>;

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
    }).subscribe(res => {
      this.loggingIn = false;
      localStorage.setItem('accessToken', res.token);
      this.authService.currentLoginUser = res.user;
      this.router.navigate(['audits']);
    }, err => {
      if (err.status === 400 && err.error.message === 'Authorized still in pending') {
        this.modalService.open(this.pendingModal);
      }
      this.loggingIn = false;
    });
  }
}
