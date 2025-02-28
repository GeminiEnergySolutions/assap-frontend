import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, RouterLink} from '@angular/router';
import {BreadcrumbService} from 'src/app/shared/services/breadcrumb.service';
import {MasterDetailComponent} from '../../shared/components/master-detail/master-detail.component';

@Component({
  selector: 'app-settings',
  imports: [
    RouterLink,
    MasterDetailComponent,
  ],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.scss'
})
export class SettingsComponent implements OnInit {
  constructor(
    private breadcrumbService: BreadcrumbService,
    private route: ActivatedRoute,
  ) {
  }

  ngOnInit(): void {
    this.breadcrumbService.setBreadcrumbs([
      {
        label: 'Settings',
        class: 'bi-gear',
        routerLink: '.',
        relativeTo: this.route,
      },
    ]);
  }
}
