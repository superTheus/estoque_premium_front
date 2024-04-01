import { Component } from '@angular/core';
import { AsideService } from '../aside/aside.service';
import { AuthService } from '../../../shared/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  constructor(
    private asideService: AsideService,
    private authService: AuthService
  ) { }

  menuClick() {
    this.asideService.open();
  }

  logout() {
    this.authService.lougtOut();
  }
}
