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
  serverUrl?: string = environment.url + "api/";

  constructor(
    private authService: AuthService,
    private route: ActivatedRoute
  ) {
  }

  generateReport(type: string) {
    const {auditId} = this.route.snapshot.params;
    window.location.href = this.serverUrl + type + '?auditId=' + auditId + '&auth_token=' + this.authService.getAuthToken();
  }
}
