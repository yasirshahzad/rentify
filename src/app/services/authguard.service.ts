import { UserService } from './login.service';
import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class Authguard implements CanActivate {
  constructor(private auth: UserService, private router: Router) {}
  canActivate(
    route: import('@angular/router').ActivatedRouteSnapshot,
    state: import('@angular/router').RouterStateSnapshot
  ) {
    return this.auth.user$.pipe(
      map((user) => {
        if (user) return true;
        else {
          this.router.navigate(['/login'], {
            queryParams: { returnUrl: state.url },
          });
          return false;
        }
      })
    );
  }
}
