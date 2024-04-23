import { Component } from '@angular/core';
import { ApiService } from '../../../data/api.service';

declare const $: any;

@Component({
  selector: 'app-aside',
  templateUrl: './aside.component.html',
  styleUrl: './aside.component.scss'
})
export class AsideComponent {
  menuIsOpen = false;
  constructor(public apiService: ApiService) { }

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
