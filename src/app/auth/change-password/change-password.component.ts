import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../shared/services/auth.service';
import { ToastService } from '@mean-stream/ngbx';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss']
})
export class ChangePasswordComponent implements OnInit {

  public changePasswordForm !: FormGroup

  constructor(private formBuilder:FormBuilder,
    private authService: AuthService,
    private router: Router,
    private toastService: ToastService,
  ) { }

  ngOnInit(): void {
    this.changePasswordForm = this.formBuilder.group({
      oldPassword: [''],
      newPassword:[''],
      confirmNewPassword:['']
    })
  }

  onSubmit(){
    const objData = {
      oldPassword: this.changePasswordForm.get('oldPassword')?.value,
      newPassword: this.changePasswordForm.get('newPassword')?.value,
      confirmNewPassword: this.changePasswordForm.get('confirmNewPassword')?.value,
    };

    this.authService.changePassword(objData).subscribe((res: any) => {
      this.toastService.success('Success', 'Password changed Successfully, login again with new password');
      this.router.navigate(['']);
    });
  }

}
