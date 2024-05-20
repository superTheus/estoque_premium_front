import { Component } from '@angular/core';
import { ApiService } from '../../../data/api.service';
import { AuthService } from '../../../shared/auth.service';

declare const $: any;

@Component({
  selector: 'app-aside',
  templateUrl: './aside.component.html',
  styleUrl: './aside.component.scss'
})
export class AsideComponent {
  public isAdmin: boolean = true;

  menuIsOpen = false;
  constructor(
    public apiService: ApiService,
    public authService: AuthService
  ) {
    this.isAdmin = this.authService.user.companyData?.type === 1 && this.authService.user.profile === 'ADMIN';
  }


  changeMenuState(isCompoustMenu: boolean) {
    if (this.menuIsOpen) {
      setTimeout(() => {
        $('.collapse').collapse('hide');
      }, 300);

      this.menuIsOpen = !this.menuIsOpen;
    } else if (isCompoustMenu) {
      this.menuIsOpen = !this.menuIsOpen;
    }
  }
}
