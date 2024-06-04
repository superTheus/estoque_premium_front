import moment from 'moment';
import { Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { UtilsService } from './utils.service';

@Injectable({ providedIn: 'root' })
export class AuthGuard {
  constructor(private authService: AuthService, private router: Router, private utilsService: UtilsService) { }

  async canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean> {
    const currentUser = this.authService.user;

    if (currentUser) {
      if (state.url === '/user/login') {
        this.router.navigate(['/app'])
      }
    }

    return true;
  }

  async canActivateChild(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean> {
    const currentUser = this.authService.user;

    if (currentUser) {
      const currentDate = moment();
      const dateLogin = moment(currentUser.dateLogin);

      if (!currentDate.isSame(dateLogin, 'day')) {
        this.authService.lougtOut();
      }

      if (state.url === '/user/login') {
        this.router.navigate(['/app'])
      }
    } else {
      if (state.url !== '/user/login') {
        this.router.navigate(['/user/login'])
      }
    }

    return true
  }
}
