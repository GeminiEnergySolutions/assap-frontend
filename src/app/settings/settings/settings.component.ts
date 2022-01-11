import {Component, OnInit} from '@angular/core';
import {ToastService} from 'ng-bootstrap-ext';
import {CompanycamCredentialService} from '../../companycam/companycam-credential.service';
import {CompanycamService} from '../../companycam/companycam.service';
import {ParseCredentialService} from '../../parse/parse-credential.service';
import {ParseCredentials} from '../../parse/parse-credentials';


@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss'],
})
export class SettingsComponent implements OnInit {
  profiles!: Map<string, ParseCredentials>;
  activeProfile?: string;

  companycamApiKey!: string;

  constructor(
    private parseCredentialService: ParseCredentialService,
    private companycamCredentialService: CompanycamCredentialService,
    private toastService: ToastService,
    private companycamService: CompanycamService,
  ) {
  }

  ngOnInit(): void {
    this.profiles = this.parseCredentialService.getProfiles();
    this.activeProfile = this.parseCredentialService.activeProfile;
    this.companycamApiKey = this.companycamCredentialService.apiKey;
  }

  setActiveProfile(id: string) {
    this.activeProfile = id;
    this.parseCredentialService.activeProfile = id;
  }

  saveCompanycam() {
    this.companycamCredentialService.apiKey = this.companycamApiKey;
  }

  testCompanycam() {
    this.saveCompanycam();
    this.companycamService.test(this.companycamApiKey).subscribe(user => {
      this.toastService.success('Companycam', `Logged in as ${user.first_name} ${user.last_name}`);
    }, error => {
      this.toastService.error('Companycam', 'Failed to log in', error);
    });
  }
}
