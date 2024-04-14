import { Component } from '@angular/core';

declare const $: any;

@Component({
  selector: 'app-aside',
  templateUrl: './aside.component.html',
  styleUrl: './aside.component.scss'
})
export class AsideComponent {
  menuIsOpen = false;
  constructor() { }

  changeMenuState(isCompoustMenu: boolean) {
    console.log('changeMenuState', isCompoustMenu);
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
