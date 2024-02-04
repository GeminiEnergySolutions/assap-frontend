import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {ToastService} from 'ng-bootstrap-ext';
import {AuthService} from 'src/app/shared/services/auth.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css'],
})
export class SignupComponent implements OnInit {
  signupForm!: FormGroup;
  selectedUserType = 'sandbox';
  submitting = false;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private toastService: ToastService,
  ) {
  }

  ngOnInit(): void {
    this.signupForm = this.formBuilder.group({
      userName: ['', Validators.required],
      Email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      ConfirmPassword: ['', Validators.required],
      state: [''],
    });
  }

  signUp() {
    let userData: any = {
      userName: this.signupForm.get('userName')?.value,
      email: this.signupForm.get('Email')?.value,
      password: this.signupForm.get('password')?.value,
      password_confirm: this.signupForm.get('ConfirmPassword')?.value,
    };

    if (this.selectedUserType === 'sandbox') {
      userData.role = 'guest';
    } else if (this.selectedUserType === 'dataCollector') {
      userData.role = 'dataCollector';
    }

    this.submitting = true;
    this.authService.signUp(userData).subscribe((res) => {
      this.submitting = false;
      this.toastService.success('Success', 'Registration successful!');
      this.signupForm.reset();
      this.router.navigate(['auth/login']);
    }, error => {
      this.submitting = false;
      this.toastService.error('Error', 'Registration failed', error);
    });
  }
}
