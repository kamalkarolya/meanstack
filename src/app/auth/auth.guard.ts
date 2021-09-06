import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { authService } from './auth.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private authservice: authService,private router:Router ) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    const isAuth = this.authservice.userAuthStatus();
    if(!isAuth){
      this.router.navigate(["/login"]);
    }
    return isAuth;
  }
}
