import {Component, OnInit} from '@angular/core';
import {ParseCredentialService} from '../../parse/parse-credential.service';
import {ParseService} from '../../parse/parse.service';
import {User} from '../../parse/user.interface';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss'],
})
export class SettingsComponent implements OnInit {
  url: string;
  appId: string;
  masterKey: string;
  testResult?: { status: string, message: string };

  username: string;
  password: string;
  user?: User;

  constructor(
    private parseCredentialService: ParseCredentialService,
    private parseService: ParseService,
  ) {
  }

  ngOnInit(): void {
    this.url = this.parseCredentialService.url;
    this.appId = this.parseCredentialService.appId;
    this.masterKey = this.parseCredentialService.masterKey;

    const {sessionToken} = this.parseCredentialService;
    if (sessionToken) {
      this.parseService.refresh(sessionToken).subscribe(user => this.user = user);
    }
  }

  save(): void {
    this.parseCredentialService.url = this.url;
    this.parseCredentialService.appId = this.appId;
    this.parseCredentialService.masterKey = this.masterKey;
  }

  test() {
    this.save();
    const op = this.username && this.password
      ? this.parseService.login(this.username, this.password)
      : this.parseService.getConfig()
    ;
    op.subscribe(() => {
      this.testResult = {status: 'success', message: 'Successfully connected to Parse server.'};
    }, error => {
      console.error(error);
      const explanation = error.error?.error ?? {
        403: 'Invalid credentials',
        404: 'Invalid server URL.',
        0: 'Can\'t connect to server.',
      }[error.status];
      this.testResult = {
        status: 'danger',
        message: `Failed to connect to Parse server: ${explanation} (${error.status} ${error.statusText})`,
      };
    });
  }

  logout() {
    this.parseService.logout().subscribe(() => delete this.user);
  }

  login() {
    this.parseService.login(this.username, this.password).subscribe(user => this.user = user);
  }
}
