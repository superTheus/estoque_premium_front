import { Component } from '@angular/core';
import { AsideService } from '../aside/aside.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  constructor(private asideService: AsideService) { }

  menuClick() {
    console.log('menuClick')
    this.asideService.open();
  }
}
