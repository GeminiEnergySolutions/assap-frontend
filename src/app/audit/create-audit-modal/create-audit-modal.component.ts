import {Component, OnInit} from '@angular/core';
import {AuditService} from '../../shared/services/audit.service';
import {ActivatedRoute, Router} from '@angular/router';
import {State} from '../../shared/model/state.interface';
import {StateService} from '../../shared/services/state.service';

@Component({
  selector: 'app-create-audit-modal',
  templateUrl: './create-audit-modal.component.html',
  styleUrl: './create-audit-modal.component.scss',
  standalone: false,
})
export class CreateAuditModalComponent implements OnInit {
  name = '';
  stateId = 0;
  feasibilityStudy = false;

  states: State[] = [];

  constructor(
    private stateService: StateService,
    private auditService: AuditService,
    private router: Router,
    private route: ActivatedRoute,
  ) {
  }

  ngOnInit() {
    this.stateService.getStates().subscribe(res => this.states = res.data);
  }

  create() {
    this.auditService.createAudit({
      auditName: this.name,
      grantStatus: this.feasibilityStudy,
      cehStatus: this.feasibilityStudy,
      stateId: this.stateId,
    }).subscribe(result => {
      this.router.navigate(['..'], {
        relativeTo: this.route,
        queryParams: {
          new: result.data.auditId,
        },
      });
    });
  }
}
