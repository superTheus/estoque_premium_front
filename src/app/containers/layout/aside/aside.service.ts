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
  isOpened: boolean = false;

  open() {
    if (this.isOpened) {
      // document.querySelector('aside')?.classList.add('close');
      document.querySelector('aside')?.classList.remove('active');
      document.querySelector('main')?.classList.remove('main-close');
      document.querySelector('footer')?.classList.add('footer-close');
    } else {
      // document.querySelector('aside')?.classList.remove('close');
      document.querySelector('aside')?.classList.add('active');
      document.querySelector('main')?.classList.add('main-close');
      document.querySelector('footer')?.classList.add('footer-close');
    }

    this.isOpened = !this.isOpened;
  }
}
