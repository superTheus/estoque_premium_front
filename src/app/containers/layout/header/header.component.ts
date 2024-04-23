import { Component } from '@angular/core';
import { AsideService } from '../aside/aside.service';
import { AuthService } from '../../../shared/auth.service';
import { ApiService } from '../../../data/api.service';
import { UtilsService } from '../../../shared/utils.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  constructor(
    public apiService: ApiService,
    public authService: AuthService,
    public utilsService: UtilsService,
    private asideService: AsideService
  ) { }

  menuClick() {
    this.asideService.open();
  }

  logout() {
    this.authService.lougtOut();
  }
}
