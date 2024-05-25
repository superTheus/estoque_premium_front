import { Injectable } from '@angular/core';

export interface ISidebar {
  containerClassnames: string;
  menuClickCount: number;
  selectedMenuHasSubItems: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class LoadService {
  isLoad: boolean = false;
}
