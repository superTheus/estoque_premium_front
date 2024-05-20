import { Component } from '@angular/core';
import { AuthService } from '../../../../shared/auth.service';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.scss'
})
export class MenuComponent {
  constructor(
    public authService: AuthService,
  ) { }
}
