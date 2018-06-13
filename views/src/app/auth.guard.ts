import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthService } from './auth.service';
import { Router } from '@angular/router';

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(private authService: AuthService, private router: Router){ }

   canActivate(router: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
       return true;
    // if(this.authService.isAuth()) {
    //     alert(true);
    //     return true;
    //  } else {
    //     this.router.navigate(['/login']);
    //     alert(false);
    //     return false;
    //  }   
    }

     login()
     {
         this.authService.login();
     }
}