import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { switchMap } from 'rxjs';
import { AuditService } from 'src/app/shared/services/audit.service';

@Component({
  selector: 'app-pre-zone',
  templateUrl: './pre-zone.component.html',
  styleUrls: ['./pre-zone.component.scss']
})
export class PreZoneComponent implements OnInit {

  audit: any;
  overFlow: boolean = false;
  
  constructor(private auditService: AuditService,
    private route: ActivatedRoute,
  ) { }

  ngOnInit(): void {
    this.route.params.pipe(
      switchMap(({ aid }) => this.auditService.getSingleAudit(aid)),
    ).subscribe((res: any) => {
      this.audit = res.data;
    });
  }

  getOverFlow(overFlow: boolean) {
    this.overFlow = overFlow;
  }

}
