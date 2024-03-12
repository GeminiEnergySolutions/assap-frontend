import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastService } from '@mean-stream/ngbx';
import { AuthService } from 'src/app/shared/services/auth.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent implements OnInit {

  public forgotPasswordForm !: FormGroup

  constructor(private formBuilder:FormBuilder,
    private authService: AuthService,
    private router: Router,
    private toastService: ToastService,
  ) { }

  ngOnInit(): void {
    this.forgotPasswordForm = this.formBuilder.group({
      email: ['']
    });
  }

  onSubmit(){
    const objData = {
      email: this.forgotPasswordForm.get('email')?.value
    };

    this.authService.forgotPassword(objData).subscribe((res: any) => {
      this.toastService.success('Success', 'Password sent to your email Successfully');
    });
  }

}
