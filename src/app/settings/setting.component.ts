import { Component, OnInit } from '@angular/core';
import { SettingService } from 'src/app/shared/services/settings.services'; // Update the path to your service
import { AuthService } from '../shared/services/auth.service';
interface Audit {
    auditId: number;
    auditName: string;
    assignedTo: string;
    admin_name: string;
    admin_state:string;
    data_collectors :string;
  }

@Component({
  selector: 'app-setting',
  templateUrl: './setting.component.html',
  styleUrls: ['./setting.component.scss'],
})
export class SettingComponent implements OnInit {
  audits: any[] = [];
  auditsGrouped: any[] = [];

  constructor(private settingService: SettingService,public authService: AuthService) {}

  ngOnInit() {
    this.fetchAudits();
  }

  fetchAudits() {
    this.settingService.allAudits().subscribe((response) => {
      this.audits = response;
      this.groupAudits();
    });
  }

  groupAudits() {
  const auditGroups: { [auditName: string]: Audit[] } = {}; // Explicitly define type

  for (const audit of this.audits) {
    if (!auditGroups[audit.auditName]) {
      auditGroups[audit.auditName] = [];
    }
    auditGroups[audit.auditName].push(audit);
  }

  this.auditsGrouped = Object.keys(auditGroups).map((auditName) => ({
    auditName,
    audits: auditGroups[auditName],
  }));
}

  addReview(audit: any) {
    console.log('Adding review for', audit);
  }

  deleteReview(audit: any) {
    console.log('Deleting review for', audit);
  }
}
