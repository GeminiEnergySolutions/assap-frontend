import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {ToastService} from 'ng-bootstrap-ext';
import {of} from 'rxjs';
import {map, switchMap, tap} from 'rxjs/operators';
import {Config} from '../../audits/model/config.interface';
import {ParseCredentialService} from '../../parse/parse-credential.service';
import {ParseCredentials} from '../../parse/parse-credentials';
import {ParseService} from '../../parse/parse.service';
import {User} from '../../parse/user.interface';

const errorExplanations: Record<string, string> = {
  403: 'Invalid credentials',
  404: 'Invalid server URL.',
  0: 'Can\'t connect to server.',
};

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.component.html',
  styleUrls: ['./edit-profile.component.scss'],
})
export class EditProfileComponent implements OnInit {
  id!: string;
  credentials: ParseCredentials = {appId: '', url: ''};

  username = '';
  password = '';
  user?: User;

  constructor(
    private parseCredentialService: ParseCredentialService,
    private parseService: ParseService,
    private toastService: ToastService,
    private route: ActivatedRoute,
    private router: Router,
  ) {
  }

  ngOnInit(): void {
    this.route.params.pipe(
      tap(({id}) => this.id = id),
      map(({id}) => this.parseCredentialService.getProfile(id)),
      tap(credentials => credentials && (this.credentials = credentials)),
      switchMap(c => c?.sessionToken ? this.parseService.getCurrentUser(c) : of(undefined)),
    ).subscribe(user => {
      this.user = user;
    });
  }

  save(): void {
    const id = this.id === 'new' ? Math.random().toString(36) : this.id;
    this.parseCredentialService.saveProfile(id, this.credentials);
    this.router.navigate(['../..'], {relativeTo: this.route});
  }

  test() {
    this.parseService.getConfig<Config>(this.credentials).subscribe(config => {
      if (config.brand) {
        this.credentials.name ||= config.brand.name;
        this.toastService.success('Parse Server', 'Successfully connected to Parse server.');
      } else {
        this.toastService.warn('Parse Server', 'Successfully connected to Parse server, but it is not configured correctly (brand parameter missing)');
      }
    }, error => {
      console.error(error);
      const explanation = error.error?.error ?? errorExplanations[error.status];
      this.toastService.error('Parse Server', `Failed to connect to Parse server: ${explanation}`, error);
    });
  }

  logout() {
    this.parseService.logout(this.credentials).subscribe(() => {
      delete this.user;
    }, error => {
      this.toastService.error('Log out', 'Failed to log out', error);
    });
  }

  login() {
    if (!this.username || !this.password) {
      return;
    }

    this.parseService.login(this.username, this.password, this.credentials).subscribe(user => {
      this.user = user;
    }, error => {
      this.toastService.error('Log in', 'Failed to log in', error);
    });
  }

}
