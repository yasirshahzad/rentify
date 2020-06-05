import { map } from 'rxjs/operators';
import { UserService } from './login.service';
import { CanActivate } from '@angular/router';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AdminAuthGauardService implements CanActivate {
  constructor(private auth: UserService) {}
  canActivate(
    route: import('@angular/router').ActivatedRouteSnapshot,
    state: import('@angular/router').RouterStateSnapshot
  ):
    | boolean
    | import('@angular/router').UrlTree
    | import('rxjs').Observable<boolean | import('@angular/router').UrlTree>
    | Promise<boolean | import('@angular/router').UrlTree> {
    return this.auth.getMe().pipe(
      map((x) => {
        if (x.isAdmin) {
          return true;
        } else {
          return false;
        }
      })
    );
  }
}
