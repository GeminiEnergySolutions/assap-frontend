import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {ToastService} from 'ng-bootstrap-ext';
import {Observable, OperatorFunction} from 'rxjs';
import {debounceTime, distinctUntilChanged, map} from 'rxjs/operators';
import {ACL} from '../../parse/parse-object.interface';
import {ParseService} from '../../parse/parse.service';
import {User} from '../../parse/user.interface';
import {AuditService} from '../audit.service';
import {Audit} from '../model/audit.interface';

@Component({
  selector: 'app-access-control',
  templateUrl: './access-control.component.html',
  styleUrls: ['./access-control.component.scss'],
})
export class AccessControlComponent implements OnInit, OnChanges {
  @Input() audit: Audit;

  user?: User;

  acl: { key: string; read: boolean; write: boolean; }[] = [];

  userIdToName: Record<string, string> = {};
  userNameToId: Record<string, string> = {};

  typeahead: OperatorFunction<string, readonly string[]> = (text$: Observable<string>) => text$.pipe(
    debounceTime(200),
    distinctUntilChanged(),
    map(term => {
      if (term.length < 2) {
        return [];
      }
      const lowerTerm = term.toLowerCase();
      return Object.keys(this.userNameToId).filter(v => v.toLowerCase().includes(lowerTerm)).slice(0, 10);
    }),
  );

  constructor(
    private auditService: AuditService,
    private parseService: ParseService,
    private toastService: ToastService,
  ) {
  }

  ngOnInit() {
    this.parseService.getCurrentUser().subscribe(user => this.user = user);

    this.parseService.getUsers().subscribe(users => {
      for (let user of users) {
        this.userIdToName[user.objectId] = user.username;
        this.userNameToId[user.username] = user.objectId;
      }
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.audit) {
      this.acl = Object.entries(this.audit.ACL ?? {'*': {read: true, write: true}})
        .map(([key, rest]) => ({key, ...rest}))
        .sort(({key: k1}, {key: k2}) => k1.localeCompare(k2))
      ;
    }
  }

  delete(index: number) {
    this.acl.splice(index, 1);
  }

  add(key: string, read: boolean, write: boolean) {
    key = this.userNameToId[key] || key;
    this.acl.push({key, read, write});
  }

  save() {
    const ACL: ACL = {};
    for (const {key, ...rest} of this.acl) {
      ACL[key] = rest;
    }

    // prevent current user from removing their own write access
    if (this.user && !(ACL[this.user.objectId].write || ACL['*'].write)) {
      // TODO toast
      return;
    }

    this.auditService.update(this.audit, {ACL}, a => {
      a.ACL = ACL;
      return a;
    }).subscribe(undefined, error => {
      this.toastService.error('Access Control', 'Failed to update access control', error);
    });
  }
}
