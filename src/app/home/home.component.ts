import {Component, OnInit} from '@angular/core';
import {ParseCredentialService} from '../parse/parse-credential.service';
import {ParseCredentials} from '../parse/parse-credentials';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  profiles: Map<string, ParseCredentials>;

  constructor(
    private parseCredentialService: ParseCredentialService,
  ) {
    this.profiles = parseCredentialService.getProfiles();
  }

  ngOnInit(): void {
  }

  setActiveProfile(id: string) {
    this.parseCredentialService.activeProfile = id;
  }
}
