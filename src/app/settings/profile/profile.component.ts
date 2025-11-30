import {Component, inject, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {ToastService} from '@mean-stream/ngbx';
import {AuthService} from '../../shared/services/auth.service';
import {BreadcrumbService} from '../../shared/services/breadcrumb.service';

@Component({
  selector: 'app-change-password',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
  imports: [FormsModule, ReactiveFormsModule],
})
export class ProfileComponent implements OnInit, OnDestroy {
  private formBuilder = inject(FormBuilder);
  private authService = inject(AuthService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private toastService = inject(ToastService);
  private breadcrumbService = inject(BreadcrumbService);

  public changePasswordForm !: FormGroup

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
