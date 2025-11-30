import {Component, inject, OnInit} from '@angular/core';
import {ActivatedRoute, RouterLink, RouterLinkActive} from '@angular/router';
import {BreadcrumbService} from 'src/app/shared/services/breadcrumb.service';
import {MasterDetailComponent} from '../../shared/components/master-detail/master-detail.component';

@Component({
  selector: 'app-settings',
  imports: [
    RouterLink,
    MasterDetailComponent,
    RouterLinkActive,
  ],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.scss'
})
export class SettingsComponent implements OnInit {
  private breadcrumbService = inject(BreadcrumbService);
  private route = inject(ActivatedRoute);

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
