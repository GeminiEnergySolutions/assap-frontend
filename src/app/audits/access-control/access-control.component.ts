import {Component, Input, OnChanges, SimpleChanges} from '@angular/core';
import {ACL} from '../../parse/parse-object.interface';
import {AuditService} from '../audit.service';
import {Audit} from '../model/audit.interface';

@Component({
  selector: 'app-access-control',
  templateUrl: './access-control.component.html',
  styleUrls: ['./access-control.component.scss'],
})
export class AccessControlComponent implements OnChanges {
  @Input() audit: Audit;

  acl: { key: string; read: boolean; write: boolean; }[] = [];

  constructor(
    private auditService: AuditService,
  ) {
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.audit) {
      this.acl = Object.entries(this.audit.ACL)
        .map(([key, rest]) => ({key, ...rest}))
        .sort(({key: k1}, {key: k2}) => k1.localeCompare(k2))
      ;
    }
  }

  delete(index: number) {
    this.acl.splice(index, 1);
  }

  add(key: string, read: boolean, write: boolean) {
    this.acl.push({key, read, write});
  }

  save() {
    const ACL: ACL = {};
    for (const {key, ...rest} of this.acl) {
      ACL[key] = rest;
    }
    this.auditService.update(this.audit, {ACL}, a => {
      a.ACL = ACL;
      return a;
    }).subscribe();
  }
}
