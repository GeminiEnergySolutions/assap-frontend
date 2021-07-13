import {Component, OnInit} from '@angular/core';
import {ParseCredentialService} from '../parse/parse-credential.service';

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
}
