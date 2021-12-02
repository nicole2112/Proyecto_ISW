import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthenticationService } from '../services/auth.services';

@Injectable({
  providedIn: 'root'
})
export class RoleGuardGuard implements CanActivate {

  constructor(public authservice: AuthenticationService)
  {

  }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return this.authservice.isAdmin();
  }
  
}
