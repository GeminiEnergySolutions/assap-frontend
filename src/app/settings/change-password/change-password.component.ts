import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {ToastService} from '@mean-stream/ngbx';
import {AuthService} from '../../shared/services/auth.service';
import {BreadcrumbService} from '../../shared/services/breadcrumb.service';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss'],
  imports: [FormsModule, ReactiveFormsModule],
})
export class ChangePasswordComponent implements OnInit, OnDestroy {

  public changePasswordForm !: FormGroup

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private route: ActivatedRoute,
    private router: Router,
    private toastService: ToastService,
    private breadcrumbService: BreadcrumbService,
  ) {
  }

  ngOnInit(): void {
    this.breadcrumbService.pushBreadcrumb({
      label: 'Profile',
      class: 'bi-person',
      routerLink: '.',
      relativeTo: this.route,
    })

    this.changePasswordForm = this.formBuilder.group({
      oldPassword: [''],
      newPassword:[''],
      confirmNewPassword:['']
    })
  }

  ngOnDestroy() {
    this.breadcrumbService.popBreadcrumb();
  }

  onSubmit(){
    const objData = {
      oldPassword: this.changePasswordForm.get('oldPassword')?.value,
      newPassword: this.changePasswordForm.get('newPassword')?.value,
      confirmNewPassword: this.changePasswordForm.get('confirmNewPassword')?.value,
    };

    this.authService.changePassword(objData).subscribe(() => {
      this.toastService.success('Success', 'Password changed Successfully, login again with new password');
      this.router.navigate(['']);
    });
  }

}
