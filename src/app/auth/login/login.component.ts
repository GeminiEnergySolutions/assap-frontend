import {Component} from '@angular/core';
import {Router} from '@angular/router';
import {AuthService} from 'src/app/shared/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  loggingIn = false;
  email = '';
  password = '';

  constructor(
    private authService: AuthService,
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
    }, () => {
      this.loggingIn = false;
    });
  }
}
