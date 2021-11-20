import {Component, OnInit} from '@angular/core';
import {ToastService} from 'ng-bootstrap-ext';
import {ParseCredentialService} from '../../parse/parse-credential.service';
import {ParseService} from '../../parse/parse.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss'],
})
export class SettingsComponent implements OnInit {
  url: string;
  appId: string;
  masterKey: string;

  constructor(
    private parseCredentialService: ParseCredentialService,
    private parseService: ParseService,
    private toastService: ToastService,
  ) {
  }

  ngOnInit(): void {
    this.url = this.parseCredentialService.url;
    this.appId = this.parseCredentialService.appId;
    this.masterKey = this.parseCredentialService.masterKey;
  }

  save(): void {
    this.parseCredentialService.url = this.url;
    this.parseCredentialService.appId = this.appId;
    this.parseCredentialService.masterKey = this.masterKey;
  }

  test() {
    this.save();
    this.parseService.getConfig().subscribe(() => {
      this.toastService.success('Parse Server', 'Successfully connected to Parse server.');
    }, error => {
      const explanation = {
        403: 'Invalid credentials',
        404: 'Invalid server URL.',
        0: 'Can\'t connect to server.',
      }[error.status];
      this.toastService.error('Parse Server', `Failed to connect to Parse server: ${explanation}`, error);
    });
  }
}
