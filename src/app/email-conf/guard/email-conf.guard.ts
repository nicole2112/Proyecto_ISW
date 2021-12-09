import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthenticationService } from 'src/app/services/auth.services';

@Injectable({
  providedIn: 'root'
})
export class EmailConfGuard implements CanActivate {

  constructor(private authservice:AuthenticationService, private router: Router)
  {

  }
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    if(this.authservice.emailVerified())
      return true;
    else
      this.router.navigate(['/no-email-confirmation']);

    return false;
  }
  
}
