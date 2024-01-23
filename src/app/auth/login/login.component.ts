import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { HttpClient } from '@angular/common/http'
import { Router } from '@angular/router';
import { AuthService } from 'src/app/shared/services/auth.service';
import { AppSetting } from 'src/app/shared/setting';

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
    const userData = {
      email: this.loginForm.get('email')?.value,
      password: this.loginForm.get('password')?.value,
    };
  
    this.authService.login(userData).subscribe((res: any) =>{
      // const token = res.token
      // if(token){
      // alert("Login success")
      // this.loginForm.reset();
      // ###
      localStorage.setItem('role', res.user.role)
      localStorage.setItem('accessToken', res.token)
      this.authService.currentLoginUser = AppSetting.user = res.user;
      // Decode the token to get user information
      // const decodedToken: any = jwt_decode(token);
      // const roleId = decodedToken.user.roleId; // Assuming the role ID field is named "roleId"
      
      // localStorage.setItem('userRole', roleId);

      this.router.navigate(['audits']);
      // } else{
      //   alert("User not found")
      // }
    });
  }
}
