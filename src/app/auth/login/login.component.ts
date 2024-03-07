import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {Router} from '@angular/router';
import {AuthService} from 'src/app/shared/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  public loginForm !: FormGroup

  constructor(private formBuilder:FormBuilder,
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loginForm = this.formBuilder.group({
      email:[''],
      password:[''],
    })
  }

  login(){
    this.authService.login({
      email: this.loginForm.get('email')?.value,
      password: this.loginForm.get('password')?.value,
    }).subscribe(res => {
      localStorage.setItem('accessToken', res.token);
      this.authService.currentLoginUser = res.user;
      this.router.navigate(['audits']);
    });
  }
}
