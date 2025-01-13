import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {Router, RouterLink} from '@angular/router';
import {ToastService} from '@mean-stream/ngbx';
import {AuthService} from 'src/app/shared/services/auth.service';
import {BrandHeaderComponent} from '../brand-header/brand-header.component';
import {TitleCasePipe} from '@angular/common';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css'],
  imports: [
    BrandHeaderComponent,
    FormsModule,
    ReactiveFormsModule,
    RouterLink,
    TitleCasePipe,
  ],
})
export class SignupComponent implements OnInit {
  readonly userTypes = ['guest', 'dataCollector'] as const;

  signupForm!: FormGroup;
  selectedUserType: (typeof this.userTypes)[number] = 'guest';
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
    });
  }

  signUp() {
    this.submitting = true;
    this.authService.signUp({
      userName: this.signupForm.get('userName')?.value,
      email: this.signupForm.get('Email')?.value,
      password: this.signupForm.get('password')?.value,
      password_confirm: this.signupForm.get('ConfirmPassword')?.value,
      role: this.selectedUserType,
    }).subscribe({
      next: () => {
        this.submitting = false;
        this.toastService.success('Success', 'Registration successful!');
        this.router.navigate(['auth/login']);
      },
      error: () => this.submitting = false,
    });
  }
}
