import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree } from "@angular/router";
import { Observable } from "rxjs";
import {environment} from 'src/environments/environment.prod'


@Injectable({ providedIn: 'root' })
export class PageNotFoundGuard implements CanActivate {
  
  constructor(
  ) { }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    if (state.url === '/api/admin') {
      window.location.href = environment.url+'api/admin/';
      return false;
    }
    return true;
  }
}
