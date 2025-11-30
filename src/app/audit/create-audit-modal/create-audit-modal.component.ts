import {Component, inject, OnInit} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {ModalModule} from '@mean-stream/ngbx';
import {NgbTooltip} from '@ng-bootstrap/ng-bootstrap';
import {State} from '../../shared/model/state.interface';
import {AuditService} from '../../shared/services/audit.service';
import {StateService} from '../../shared/services/state.service';

@Component({
  selector: 'app-create-audit-modal',
  templateUrl: './create-audit-modal.component.html',
  styleUrl: './create-audit-modal.component.scss',
  imports: [
    ModalModule,
    NgbTooltip,
    FormsModule,
  ],
})
export class CreateAuditModalComponent implements OnInit {
  private stateService = inject(StateService);
  private auditService = inject(AuditService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  name = '';
  stateId = 0;
  feasibilityStudy = false;

  states: State[] = [];

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
