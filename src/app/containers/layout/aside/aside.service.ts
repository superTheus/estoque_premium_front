import { Injectable, OnInit } from '@angular/core';

export interface ISidebar {
  containerClassnames: string;
  menuClickCount: number;
  selectedMenuHasSubItems: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class AsideService {
  isOpened: boolean = true;

  open() {
    if (this.isOpened) {
      document.querySelector('nav')?.classList.add('close');
      document.querySelector('main')?.classList.add('main-close');
    } else {
      document.querySelector('nav')?.classList.remove('close');
      document.querySelector('main')?.classList.remove('main-close');
    }

    this.isOpened = !this.isOpened;
  }
}
