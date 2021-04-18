import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { SessionService } from 'src/services/session.service';

@Injectable({
  providedIn: 'root'
})
export class AuthenticatedGuard implements CanActivate {
  constructor(
    private sessionService: SessionService,
    private router: Router
  ) { }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    const sessionActive = this.sessionService.sessionIsActive();
    if (route.url.length === 0) {
      // Login Page
      if (sessionActive) {
        this.router.navigate(['tickets']);
        return false;
      } else {
        return true;
      }
    } else {
      if (sessionActive) {
        return true;
      } else {
        this.sessionService.setAfterLoginUrl(route.url.join('/'));
        this.router.navigateByUrl('/');
        return false;
      }
    }
  }

}
