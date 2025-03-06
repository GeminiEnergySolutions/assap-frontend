import {Injectable, TemplateRef} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {BehaviorSubject, Observable} from 'rxjs';

@Injectable({providedIn: 'root'})
export class BreadcrumbService {
  private breadcrumbs = new BehaviorSubject<Breadcrumb[]>([]);

  readonly breadcrumbs$: Observable<Breadcrumb[]> = this.breadcrumbs.asObservable();

  options?: TemplateRef<any>;

  constructor() {}

  setBreadcrumbs(breadcrumbs: Breadcrumb[]): void {
    this.breadcrumbs.next(breadcrumbs);
  }

  pushBreadcrumb(breadcrumb: Breadcrumb): void {
    const breadcrumbs = this.breadcrumbs.value;
    breadcrumbs.push(breadcrumb);
    this.breadcrumbs.next(breadcrumbs);
  }

  popBreadcrumb(): Breadcrumb | undefined {
    const breadcrumbs = this.breadcrumbs.value;
    if (!breadcrumbs.length) {
      return;
    }

    const last = breadcrumbs.pop();
    this.breadcrumbs.next(breadcrumbs);
    return last;
  }
}
export interface Breadcrumb {
  label: string;
  // CSS class or icon
  class?: string;
  routerLink?: string | any[];
  relativeTo?: ActivatedRoute;
}
