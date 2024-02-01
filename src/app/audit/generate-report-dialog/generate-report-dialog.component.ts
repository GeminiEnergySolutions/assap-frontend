import {Component} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {AuthService} from 'src/app/shared/services/auth.service';
import {environment} from 'src/environments/environment.prod';

@Component({
  selector: 'app-generate-report-dialog',
  templateUrl: './generate-report-dialog.component.html',
  styleUrls: ['./generate-report-dialog.component.scss'],
})
export class GenerateReportDialogComponent {
  auditId = '';
  authToken = '';
  serverUrl = environment.url;

  constructor(
    authService: AuthService,
    route: ActivatedRoute
  ) {
    this.authToken = authService.getAuthToken() ?? '';
    route.params.subscribe(({aid}) => this.auditId = aid);
  }
}
